<script setup lang="tsx">
import type { DepartmentProps, DepartmentExpose } from "./types";

import Write from "./Write.vue";
import { assignedDepartment, COLUMN_DEPARTMENT, deleteDepartment, updateDepartment } from "./helpers";

const { error, success, warning } = useMessage();
const { confirm } = useMessageBox();
const { data } = defineProps<DepartmentProps>();
const selectedRows = ref<Department[]>([]);
const assignedList = ref<number[]>([]);
const writeRef = useTemplateRef<DepartmentExpose>("writeRef");

const operation: TableOperation = {
	add: PERMISSION_CODE.DEPARTMENT_ADD,
	edit: PERMISSION_CODE.DEPARTMENT_EDIT,
	delete: PERMISSION_CODE.DEPARTMENT_DELETE,
	batchDestroy: PERMISSION_CODE.DEPARTMENT_DELETE,
};

const schema: TableSchema[] = [
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
		sortable: true,
	},

	{
		field: COLUMN_DEPARTMENT.KEY.NAME,
		label: COLUMN_DEPARTMENT.LABEL.NAME,
		minWidth: TABLE_COLUMN.WIDTH.DEFAULT,
	},
	{
		field: TABLE_COLUMN.KEY.STATUS,
		label: TABLE_COLUMN.LABEL.STATUS,
		minWidth: TABLE_COLUMN.WIDTH.DEFAULT,
		filterMethod: (value, row) => row.status === value,
		filters: filterStatus(),
		formatter: (row: Department) => (
			<Switch v-model={row.status} before-change={() => handleUpdate(row.id, !row.status)} />
		),
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

	const { code, message } = await updateDepartment(id, status);
	if (code !== HTTP_CODE.NO_CONTENT) {
		error(message);
	} else if (message !== "") {
		success(message);
	}
}

/**
 * 删除操作
 *
 * @param id 部门 ID
 *
 * @returns 无内容
 */
async function handleDelete(id: Arrayable<number>): Promise<void> {
	if (typeof id === "number" && assignedList.value.includes(id)) {
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
		.catch(() => (selectedRows.value = []));
}

onMounted(async () => (assignedList.value = await assignedDepartment()));
</script>

<template>
	<Table
		v-model="selectedRows"
		:schema="schema"
		:data="data"
		:selectable="(row) => !assignedList.includes(row.id)"
		:operation="operation"
		@add="writeRef?.open()"
		@edit="writeRef?.open($event)"
		@delete="handleDelete($event)"
	/>

	<Write ref="writeRef" />
</template>
