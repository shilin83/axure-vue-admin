<script setup lang="tsx">
import type { RoleExpose, RoleProps } from "./types";

import Detail from "./Detail.vue";
import Write from "./Write.vue";
import { COLUMN_ROLE, assignedRole, deleteRole, updateRole } from "./helpers";

const { error, success, warning } = useMessage();
const { confirm } = useMessageBox();
const { data, menus, permissions } = defineProps<RoleProps>();
const selectedRows = ref<Role[]>([]);
const assignedList = ref<number[]>([]);
const writeRef = useTemplateRef<RoleExpose>("writeRef");
const detailRef = useTemplateRef<RoleExpose>("detailRef");

const operation: TableOperation = {
	add: PERMISSION_CODE.ROLE_ADD,
	edit: PERMISSION_CODE.ROLE_EDIT,
	delete: PERMISSION_CODE.ROLE_DELETE,
	batchDestroy: PERMISSION_CODE.ROLE_DELETE,
};

const tableSchema: TableSchema[] = [
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
		field: COLUMN_ROLE.KEY.NAME,
		label: COLUMN_ROLE.LABEL.NAME,
		minWidth: TABLE_COLUMN.WIDTH.DEFAULT,
	},
	{
		field: TABLE_COLUMN.KEY.STATUS,
		label: TABLE_COLUMN.LABEL.STATUS,
		minWidth: TABLE_COLUMN.WIDTH.DEFAULT,
		filterMethod: (value, row) => row.status === value,
		filters: filterStatus(),
		formatter: (row: Role) => <Switch v-model={row.status} before-change={() => handleUpdate(row.id, !row.status)} />,
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
 * @param id 角色 ID
 * @param status 状态
 *
 * @returns 无内容
 */
async function handleUpdate(id: number, status: boolean): Promise<void> {
	if (assignedList.value.includes(id)) {
		warning("角色已分配，无法禁用！");
		return;
	}

	const { code, message } = await updateRole(id, status);
	if (code !== HTTP_CODE.NO_CONTENT) {
		error(message);
	} else if (message !== "") {
		success(message);
	}
}

/**
 * 删除操作
 *
 * @param id 角色 ID
 *
 * @returns 无内容
 */
async function handleDelete(id: Arrayable<number>): Promise<void> {
	if (typeof id === "number" && assignedList.value.includes(id)) {
		warning("角色已分配，无法删除！");
		return;
	}

	confirm()
		.then(async () => {
			const { code, message } = await deleteRole(id);
			if (code === HTTP_CODE.NO_CONTENT) {
				success(message);
			} else {
				error(message);
			}
		})
		.catch(() => (selectedRows.value = []));
}

onMounted(async () => (assignedList.value = await assignedRole()));
</script>

<template>
	<Table
		v-model="selectedRows"
		:schema="tableSchema"
		:data="data"
		:operation="operation"
		:selectable="(row) => !assignedList.includes(row.id)"
		@add="writeRef?.open()"
		@edit="writeRef?.open($event)"
		@delete="handleDelete($event)"
	>
		<template #operation="{ row }">
			<Button
				type="success"
				:label="BUTTON_TEXT.DETAIL"
				:icon="ICON_MAP.DETAIL"
				@click="detailRef?.open(row as Role)"
			/>
		</template>
	</Table>

	<Write ref="writeRef" :menus="menus" :permissions="permissions" />
	<Detail ref="detailRef" :menus="menus" :permissions="permissions" />
</template>
