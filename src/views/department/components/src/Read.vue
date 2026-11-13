<script setup lang="ts">
import type { DepartmentExpose, DepartmentProps } from "./types";

import { isNumber } from "es-toolkit/predicate";

import { Write } from "..";
import { assignedDepartment, deleteDepartment, updateDepartment } from "./helpers";

const { error, success, warning } = useMessage();
const { confirm } = useMessageBox();
const { data } = defineProps<DepartmentProps>();
const selectedRows = ref<Department[]>([]);
const writeRef = ref<DepartmentExpose>();
const assignedList = ref<number[]>([]);

const schema: TableSchema[] = [
	{
		field: TABLE_COLUMN.KEY.SELECTION,
		label: TABLE_COLUMN.LABEL.SELECTION,
		type: TABLE_COLUMN.KEY.SELECTION,
		minWidth: TABLE_COLUMN.WIDTH.ID,
	},
	{
		field: TABLE_COLUMN.KEY.ID,
		label: TABLE_COLUMN.LABEL.ID,
		minWidth: TABLE_COLUMN.WIDTH.ID,
		sortable: true,
	},

	{
		field: TABLE_COLUMN.KEY.NAME,
		label: TABLE_COLUMN.LABEL.NAME,
		minWidth: TABLE_COLUMN.WIDTH.DEFAULT,
	},
	{
		field: TABLE_COLUMN.KEY.STATUS,
		label: TABLE_COLUMN.LABEL.STATUS,
		minWidth: TABLE_COLUMN.WIDTH.DEFAULT,
		filterMethod: (value, row) => row.status === value,
		filters: filterStatus(),
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
];

/**
 * 更新操作
 *
 * @param id 部门 ID
 * @param status 状态
 *
 * @returns 无内容
 */
async function handleUpdate(id: number, status: boolean): Promise<void> {
	if (assignedList.value.includes(id)) {
		warning("部门已分配，无法禁用！");
		return;
	}

	const { code, message } = await updateDepartment(id, !status);
	if (code !== HTTP_CODE.NO_CONTENT) {
		error(message);
	} else if (message !== "") success(message);
}

/**
 * 删除操作
 *
 * @param id 部门 ID
 *
 * @returns 无内容
 */
async function handleDelete(id: Arrayable<number>): Promise<void> {
	if (isNumber(id) && assignedList.value.includes(id)) {
		warning("部门已分配，无法删除！");
		return;
	}

	confirm()
		.then(async () => {
			const { code, message } = await deleteDepartment(id);
			if (code === HTTP_CODE.NO_CONTENT) {
				success(message);
			} else {
				error(message);
			}
		})
		.catch(() => {});
}

onMounted(async () => (assignedList.value = await assignedDepartment()));
</script>

<template>
	<div class="m-5 rounded-lg bg-white p-5">
		<div class="flex-center-x mb-5">
			<Button
				type="primary"
				v-perm="PERMISSION_CODE.DEPARTMENT_ADD"
				:label="BUTTON_MAP.ADD.LABEL"
				:icon="BUTTON_MAP.ADD.ICON"
				@click="writeRef?.open()"
			/>
			<Button
				type="danger"
				v-perm="PERMISSION_CODE.DEPARTMENT_DELETE"
				:disabled="selectedRows.length === 0"
				:label="BUTTON_MAP.BATCH_DESTROY.LABEL"
				:icon="BUTTON_MAP.BATCH_DESTROY.ICON"
				@click="handleDelete(selectedRows.map((row) => row.id))"
			/>
		</div>

		<Table
			v-model="selectedRows"
			:schema="schema"
			:data="data"
			:selectable="(row) => !assignedList.includes(row.id)"
			:before-status-change="handleUpdate"
		>
			<template #operation="{ row }">
				<Button
					type="primary"
					v-perm="PERMISSION_CODE.DEPARTMENT_EDIT"
					:label="BUTTON_MAP.EDIT.LABEL"
					:icon="BUTTON_MAP.EDIT.ICON"
					@click="writeRef?.open(row)"
				/>
				<Button
					type="danger"
					v-perm="PERMISSION_CODE.DEPARTMENT_DELETE"
					:label="BUTTON_MAP.DELETE.LABEL"
					:icon="BUTTON_MAP.DELETE.ICON"
					@click="handleDelete(row.id)"
				/>
			</template>
		</Table>
	</div>

	<Write ref="writeRef" />
</template>
