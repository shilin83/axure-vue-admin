<script setup lang="ts">
import type { TableProps, TableEmits, SortProps } from "./types";
import type { TableInstance } from "element-plus";

import { useDebounceFn } from "@vueuse/core";

const { pagination = true, search, schema, data } = defineProps<TableProps>();
const emit = defineEmits<TableEmits>();
const selection = defineModel<any[]>();
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);
const treeRows = ref<any[]>([]);
const searchKeyword = ref<string>(search?.keyword ?? "");
const debouncedKeyword = ref<string>(searchKeyword.value);
const filterValues = reactive<Recordable<any[]>>({});
const tableRef = useTemplateRef<TableInstance>("tableRef");

const sortState = ref<SortProps>({
	prop: "",
	order: null,
});

/**
 * 同步防抖后的搜索关键词，并在关键词生效时重置到第一页
 *
 * @param value 搜索框当前关键词
 *
 * @returns 无内容
 */
const updateDebouncedKeyword = useDebounceFn((value: string): void => {
	debouncedKeyword.value = value;
	if (pagination) currentPage.value = 1;
}, DEBOUNCE_TIME);

/** 根据父组件传入的搜索字段标题生成输入框占位符 */
const searchPlaceholder = computed<string>(() => {
	const labels = search?.fields.flatMap((field) => Object.values(field)) ?? [];
	return labels.length > 1 ? `${labels.join(" / ")}` : (labels[0] ?? "");
});

const filteredData = computed<any[]>(() => {
	const { fields = [] } = search ?? {};
	const keyword = debouncedKeyword.value.trim().toLowerCase();

	const entries = Object.entries(filterValues);
	if (entries.length === 0 && keyword === "") return data;

	return data.filter((row) => {
		if (keyword !== "" && fields.length > 0) {
			const hit = fields.some((field) =>
				String(row[Object.keys(field)[0] ?? ""] ?? "")
					.toLowerCase()
					.includes(keyword),
			);
			if (!hit) return false;
		}

		return entries.every(([field, values]) => {
			const column = schema.find((item) => item.field === field);
			if (column === undefined || column.filterMethod === undefined) return true;

			return values.some((value) => column.filterMethod?.(value, row));
		});
	});
});

const sortedData = computed<any[]>(() => {
	const { prop, order } = sortState.value;
	if (prop === "" || order === null) return filteredData.value;

	const direction = order === "ascending" ? 1 : -1;

	return [...filteredData.value].sort((a, b) => compareByProp(a[prop ?? ""], b[prop ?? ""]) * direction);
});

const pagedData = computed<any[]>(() => {
	if (!pagination) return sortedData.value;

	const start = (currentPage.value - 1) * pageSize.value;
	const end = start + pageSize.value;

	return sortedData.value.slice(start, end);
});

const total = computed<number>(() => filteredData.value.length);

/**
 * 处理表格列排序变更，更新排序状态并重置到第一页
 *
 * @param params 排序参数（字段与排序方向）
 *
 * @returns 无内容
 */
function handleSortChange(params: SortProps): void {
	sortState.value = {
		prop: params.prop ?? "",
		order: params.order,
	};

	if (pagination) currentPage.value = 1;
}

/**
 * 处理行展开状态变更：手风琴模式下，任意一行被展开时收起其余所有已展开行
 *
 * @param row 当前触发展开/收起的行数据
 * @param expanded 树形/懒加载场景为当前行展开状态（boolean）
 *
 * @returns 无内容
 */
function handleExpandChange(row: any, expanded: any[] | boolean): void {
	if (expanded) {
		treeRows.value.filter((item) => item !== row).forEach((item) => tableRef.value?.toggleRowExpansion(item, false));
		treeRows.value = [row];
	} else {
		treeRows.value = treeRows.value.filter((item) => item !== row);
	}
}

/**
 * 处理表格列筛选条件变更，更新筛选值并重置到第一页
 *
 * @param filters 各字段的筛选值集合
 *
 * @returns 无内容
 */
function handleFilterChange(filters: Recordable<any[]>): void {
	for (const key of Object.keys(filterValues)) delete filterValues[key];

	Object.entries(filters).forEach(([field, values]) => {
		if (values.length > 0) filterValues[field] = values;
	});

	if (pagination) currentPage.value = 1;
}

/**
 * 根据属性值比较两条数据（用于列排序），空值优先、数字按差值、其余按中文本地化比较
 *
 * @param a 参与比较的字段值
 * @param b 参与比较的字段值
 *
 * @returns 比较结果：负数、零或正数
 */
function compareByProp(a: unknown, b: unknown): number {
	if (a === b) return 0;
	if (a === null || a === undefined) return 1;
	if (b === null || b === undefined) return -1;
	if (typeof a === "number" && typeof b === "number") return a - b;

	return String(a).localeCompare(String(b), "zh-CN");
}

/**
 * 统一处理搜索、分页与选中状态变化：
 * 关键词变化时触发防抖同步（页码在防抖回调中重置），选中清空时取消勾选，数据量变化时收敛页码
 *
 * @returns 无内容
 */
watch(
	[() => searchKeyword.value, () => filteredData.value.length, () => pageSize.value, () => selection.value],
	([keyword, length, size, rows], [prevKeyword]) => {
		if (keyword !== prevKeyword) updateDebouncedKeyword(keyword);
		if (rows !== undefined && rows.length === 0) tableRef.value?.clearSelection();
		if (!pagination) return;

		const maxPage = Math.max(1, Math.ceil(length / size));
		currentPage.value = Math.min(currentPage.value, maxPage);
	},
	{
		immediate: true,
	},
);
</script>

<template>
	<div class="m-5 rounded-lg bg-white p-5">
		<div class="flex-center-x mb-5 justify-between">
			<div>
				<Button
					v-if="operation?.add !== undefined"
					v-perm="operation.add"
					type="primary"
					:label="BUTTON_TEXT.ADD"
					:icon="ICON_MAP.ADD"
					@click="emit('add')"
				/>

				<Button
					v-if="operation?.batchDestroy !== undefined"
					v-perm="operation.batchDestroy"
					type="danger"
					:label="BUTTON_TEXT.BATCH_DESTROY"
					:icon="ICON_MAP.BATCH_DESTROY"
					:disabled="selection?.length === 0"
					@click="emit('delete', selection?.map((item) => item[TABLE_COLUMN.KEY.ID]) ?? [])"
				/>
			</div>

			<div v-if="search !== undefined">
				<Input v-model="searchKeyword" :placeholder="searchPlaceholder" search />
			</div>
		</div>

		<ElTable
			ref="tableRef"
			style="width: 100%"
			:data="pagedData"
			:row-key="TABLE_COLUMN.KEY.ID"
			@sort-change="handleSortChange"
			@filter-change="handleFilterChange"
			@expand-change="handleExpandChange"
			@selection-change="(rows: any[]) => (selection = rows)"
			border
			stripe
		>
			<ElTableColumn
				v-for="item in schema"
				align="center"
				:key="item.field"
				:prop="item.field"
				:label="item.label"
				:type="item.type"
				:sortable="item.sortable"
				:filters="item.filters"
				:formatter="item.formatter"
				:min-width="item.minWidth"
				:column-key="item.field"
				:selectable="selectable"
			>
				<template #default="{ row }">
					<template v-if="item.field === TABLE_COLUMN.KEY.CREATED_AT || item.field === TABLE_COLUMN.KEY.UPDATED_AT">
						{{ row[item.field] !== undefined ? formatUnix(row[item.field]) : "" }}
					</template>
				</template>
			</ElTableColumn>

			<ElTableColumn width="300" align="center" fixed="right" label="操作">
				<template #default="{ row }">
					<slot name="operation" :row="row" />
					<Button
						v-if="operation?.edit !== undefined"
						v-perm="operation.edit"
						color="#9065DB"
						:label="BUTTON_TEXT.EDIT"
						:icon="ICON_MAP.EDIT"
						@click="emit('edit', row)"
					/>
					<Button
						v-if="operation?.delete !== undefined"
						v-perm="operation.delete"
						type="danger"
						:label="BUTTON_TEXT.DELETE"
						:icon="ICON_MAP.DELETE"
						@click="emit('delete', row['id'])"
					/>
				</template>
			</ElTableColumn>
		</ElTable>

		<div v-if="pagination" class="flex-center-x mt-5 justify-between">
			<div class="flex-center-x gap-2 text-sm text-gray-500">
				<ElPagination
					size="small"
					layout="prev, pager, next"
					:total="total"
					:current-page="currentPage"
					:page-size="pageSize"
					@current-change="(val: number) => (currentPage = val)"
					background
				/>

				<Select
					v-model="pageSize"
					class="w-25!"
					size="small"
					:clearable="false"
					:options="
						[10, 20, 50, 100].map((value) => ({
							value,
							label: `每页 ${value} 条`,
						}))
					"
				/>
			</div>

			<div class="text-sm">共 {{ total }} 条</div>
		</div>
	</div>
</template>
