<script setup lang="ts">
import type { DepartmentProps, DepartmentExpose } from "./types";

import { isBoolean, isString } from "es-toolkit/predicate";

import { DialogModal } from "..";
import { assignedDepartment, deleteDepartment, updateDepartment } from "./helpers";

const { error, success, warning } = useMessage();
const { confirm } = useMessageBox();
const props = defineProps<DepartmentProps>();
const activeTab = ref<string>(ACTIVE_TAB.KEY.DEFAULT);
const dialogRef = ref<DepartmentExpose>();
const selectedRows = ref<Department[]>([]);
const assignedList = ref<number[]>([]);

const tableSchema = computed<TableSchema[]>(() => [
	{
		field: TABLE_COLUMN.KEY.SELECTION,
		label: TABLE_COLUMN.LABEL.SELECTION,
		type: TABLE_COLUMN.KEY.SELECTION,
		minWidth: TABLE_COLUMN.WIDTH.SELECTION,
	},
	{
		field: TABLE_COLUMN.KEY.ID,
		label: TABLE_COLUMN.LABEL.ID,
		minWidth: TABLE_COLUMN.WIDTH.ID,
	},
	{
		field: TABLE_COLUMN.KEY.NAME,
		label: TABLE_COLUMN.LABEL.NAME,
		minWidth: TABLE_COLUMN.WIDTH.DEFAULT,
	},
	{
		field: TABLE_COLUMN.KEY.STATUS,
		label: TABLE_COLUMN.LABEL.STATUS,
		filterMethod: (value: boolean, row: Department) => row.status === value,
		filters: Object.values([true, false]).map((value) => ({
			text: value ? STATUS_TEXT.ENABLED : STATUS_TEXT.DISABLED,
			value,
		})),
	},
	{
		field: TABLE_COLUMN.KEY.CREATED_AT,
		label: TABLE_COLUMN.LABEL.CREATED_AT,
		minWidth: TABLE_COLUMN.WIDTH.OPERATION,
	},
	{
		field: TABLE_COLUMN.KEY.UPDATED_AT,
		label: TABLE_COLUMN.LABEL.UPDATED_AT,
		minWidth: TABLE_COLUMN.WIDTH.OPERATION,
	},
]);

/**
 * 更新操作
 *
 * @param id 部门 ID
 * @param data 更新数据
 *
 * @returns 无内容
 */
async function handleUpdate(id: number, data: boolean | string): Promise<void> {
	if (isBoolean(data) && assignedList.value.includes(id)) {
		warning("该部门已分配，无法禁用！");
		return;
	}

	if (isString(data) && assignedList.value.includes(id)) {
		warning("该部门已分配，无法删除！");
		return;
	}

	const { code, message } = await updateDepartment(id, data);
	if (code !== HTTP_CODE.NO_CONTENT) {
		error(message);
	} else {
		if (props.recycled.filter((item) => item.id !== id).length === 0) activeTab.value = ACTIVE_TAB.KEY.DEFAULT;
		if (message !== "") success(message);
	}
}

/**
 * 删除操作
 *
 * @param ids 部门 ID 列表
 * @param clear 是否清空回收站
 *
 * @returns 无内容
 */
async function handleDelete(ids: number[], clear: boolean = false): Promise<void> {
	confirm(DELETE_CONFIRM)
		.then(async () => {
			const { code, message } = await deleteDepartment(ids, clear);
			if (code === HTTP_CODE.NO_CONTENT) {
				if (clear) activeTab.value = ACTIVE_TAB.KEY.DEFAULT;
				else selectedRows.value = [];
				success(message);
			} else {
				error(message);
			}
		})
		.catch(() => (selectedRows.value = []));
}

onMounted(async () => (assignedList.value = await assignedDepartment()));
</script>

<template>
	<div class="m-5 rounded-lg bg-white p-5">
		<ElTabs v-model="activeTab" type="border-card">
			<ElTabPane :label="ACTIVE_TAB.LABEL.DEFAULT" :name="ACTIVE_TAB.KEY.DEFAULT">
				<div class="flex-center-x mb-5">
					<Button
						type="primary"
						v-perm="PERMISSION_CODE.DEPARTMENT_ADD"
						:label="BUTTON_MAP.ADD.LABEL"
						:icon="BUTTON_MAP.ADD.ICON"
						@handle-click="dialogRef?.open()"
					/>
					<Button
						type="danger"
						v-perm="PERMISSION_CODE.DEPARTMENT_DELETE"
						:disabled="selectedRows.length === 0"
						:label="BUTTON_MAP.BATCH.LABEL"
						:icon="BUTTON_MAP.BATCH.ICON"
						@handle-click="handleDelete(selectedRows.map((row) => row.id))"
					/>
				</div>

				<Table
					v-model="selectedRows"
					:schema="tableSchema"
					:data="props.data"
					:selectable="(row: Department) => !assignedList.includes(row.id)"
					:beforeStatusChange="handleUpdate"
					pagination
				>
					<template #operation="{ row }">
						<Button
							type="primary"
							v-perm="PERMISSION_CODE.DEPARTMENT_EDIT"
							:label="BUTTON_MAP.EDIT.LABEL"
							:icon="BUTTON_MAP.EDIT.ICON"
							@handle-click="dialogRef?.open(row)"
						/>
						<Button
							type="danger"
							v-perm="PERMISSION_CODE.DEPARTMENT_DELETE"
							:label="BUTTON_MAP.DELETE.LABEL"
							:icon="BUTTON_MAP.DELETE.ICON"
							@handle-click="handleUpdate(row.id, currentTime())"
						/>
					</template>
				</Table>
			</ElTabPane>

			<ElTabPane :label="ACTIVE_TAB.LABEL.RECYCLE" :name="ACTIVE_TAB.KEY.RECYCLE">
				<div class="flex-center-x mb-5">
					<Button
						type="danger"
						v-perm="PERMISSION_CODE.DEPARTMENT_DELETE"
						:disabled="props.recycled.length === 0"
						:label="BUTTON_MAP.CLEAR.LABEL"
						:icon="BUTTON_MAP.CLEAR.ICON"
						@handle-click="
							handleDelete(
								props.recycled.map((item) => item.id),
								true,
							)
						"
					/>
				</div>

				<Table :schema="RECYCLE_SCHEMA" :data="props.recycled">
					<template #operation="{ row }">
						<Button
							type="success"
							v-perm="PERMISSION_CODE.DEPARTMENT_DELETE"
							:label="BUTTON_MAP.RESTORE.LABEL"
							:icon="BUTTON_MAP.RESTORE.ICON"
							@handle-click="handleUpdate(row.id, '')"
						/>
					</template>
				</Table>
			</ElTabPane>
		</ElTabs>
	</div>

	<DialogModal ref="dialogRef" :data="props.data" />
</template>
