<script setup lang="ts">
import type { SortProps, TableProps, TableSlots } from "./types";
import type { TableInstance } from "element-plus";

import { isNumber } from "es-toolkit/predicate";

const props = defineProps<TableProps>();
const slots = defineSlots<TableSlots>();
const selection = defineModel<any[]>();
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);
const filterValues = reactive<Recordable<any[]>>({});
const total = computed<number>(() => filteredData.value.length);
const tableRef = useTemplateRef<TableInstance>("tableRef");

const sortState = ref<SortProps>({
	prop: "",
	order: null,
});

const filteredData = computed<any[]>(() => {
	const { keyword = "", fields = [] } = props.search ?? {};
	const searchKeyword = keyword.trim().toLowerCase();

	const entries = Object.entries(filterValues);
	if (entries.length === 0 && searchKeyword === "") return props.data;

	return props.data.filter((row) => {
		if (searchKeyword !== "" && fields.length > 0) {
			const hit = fields.some((field) =>
				String(row[field] ?? "")
					.toLowerCase()
					.includes(searchKeyword),
			);
			if (!hit) return false;
		}

		return entries.every(([field, values]) => {
			const column = props.schema.find((item) => item.field === field);
			if (column === undefined || column.filterMethod === undefined) return true;

			return values.some((value) => column.filterMethod?.(value, row));
		});
	});
});

const sortedData = computed<any[]>(() => {
	const { prop, order } = sortState.value;
	if (prop === "" || order === null) return filteredData.value;

	const direction = order === "ascending" ? 1 : -1;

	return [...filteredData.value].sort((a, b) => compareByProp(a[prop], b[prop]) * direction);
});

const pagedData = computed<any[]>(() => {
	if (!props.pagination) return sortedData.value;

	const start = (currentPage.value - 1) * pageSize.value;
	const end = start + pageSize.value;

	return sortedData.value.slice(start, end);
});

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
	if (isNumber(a) && isNumber(b)) return a - b;

	return String(a).localeCompare(String(b), "zh-CN");
}

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

	if (props.pagination) currentPage.value = 1;
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

	if (props.pagination) currentPage.value = 1;
}

watch(
	[() => props.search?.keyword, () => filteredData.value.length, () => pageSize.value, () => selection.value],
	([keyword, length, size, rows], [prevKeyword]) => {
		if (rows !== undefined && rows.length === 0) tableRef.value?.clearSelection();
		if (!props.pagination) return;

		if (keyword !== prevKeyword) {
			currentPage.value = 1;
			return;
		}

		const maxPage = Math.max(1, Math.ceil(length / size));
		currentPage.value = Math.min(currentPage.value, maxPage);
	},
	{
		immediate: true,
	},
);
</script>

<template>
	<ElTable
		ref="tableRef"
		style="width: 100%"
		:data="pagedData"
		:row-key="TABLE_COLUMN.KEY.ID"
		@sortChange="handleSortChange"
		@filterChange="handleFilterChange"
		@selectionChange="(rows: any[]) => (selection = rows)"
		border
		stripe
	>
		<ElTableColumn
			v-for="item in props.schema"
			align="center"
			filter-placement="top"
			:key="item.field"
			:prop="item.field"
			:label="item.label"
			:type="item.type"
			:sortable="item.sortable"
			:filters="item.filters"
			:formatter="item.formatter"
			:min-width="item.minWidth"
			:column-key="item.field"
			:selectable="props.selectable"
		>
			<template v-if="slots.expand !== undefined && item.type === 'expand'" #default="{ row }">
				<slot name="expand" :row="row" />
			</template>
			<template v-else #default="{ row }">
				<template v-if="item.field === 'status' && item.formatter === undefined">
					<Switch
						v-model="row[item.field]"
						:before-change="() => props.beforeStatusChange?.(row['id'], row[item.field]) as unknown as boolean"
					/>
				</template>
			</template>
		</ElTableColumn>
		<ElTableColumn v-if="slots.operation !== undefined" width="300" align="center" fixed="right" label="操作">
			<template #default="{ row }">
				<slot name="operation" :row="row" />
			</template>
		</ElTableColumn>
	</ElTable>

	<ElPagination
		v-if="props.pagination"
		class="mt-5"
		layout="total, sizes, prev, pager, next, jumper"
		:current-page="currentPage"
		:page-size="pageSize"
		:page-sizes="[10, 20, 50, 100]"
		:total="total"
		@current-change="(val: number) => (currentPage = val)"
		@size-change="(val: number) => (pageSize = val)"
		background
	/>
</template>
