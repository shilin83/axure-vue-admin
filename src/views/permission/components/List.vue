<script setup lang="ts">
import type { PermissionProps, PermissionExpose } from "./types";

import Write from "./Write.vue";
import { COLUMN_PERMISSION, assignedPermission, deletePermission } from "./helpers";

const { error, success, warning } = useMessage();
const { confirm } = useMessageBox();
const { data } = defineProps<PermissionProps>();
const assignedList = ref<number[]>([]);
const writeRef = useTemplateRef<PermissionExpose>("writeRef");

const operation: TableOperation = {
	add: PERMISSION_CODE.PERMISSION_ADD,
	edit: PERMISSION_CODE.PERMISSION_EDIT,
	delete: PERMISSION_CODE.PERMISSION_DELETE,
};

const schema: TableSchema[] = [
	{
		field: TABLE_COLUMN.KEY.ID,
		label: TABLE_COLUMN.LABEL.ID,
		minWidth: TABLE_COLUMN.WIDTH.ID,
	},
	{
		field: COLUMN_PERMISSION.KEY.CODE,
		label: COLUMN_PERMISSION.LABEL.CODE,
		minWidth: TABLE_COLUMN.WIDTH.DEFAULT,
	},
	{
		field: COLUMN_PERMISSION.KEY.NAME,
		label: COLUMN_PERMISSION.LABEL.NAME,
		minWidth: TABLE_COLUMN.WIDTH.DEFAULT,
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
 * 删除操作
 *
 * @param id 权限 ID
 *
 * @returns 无内容
 */
async function handleDelete(id: number): Promise<void> {
	if ((data.find((item) => item.id === id)?.children?.length ?? 0) > 0) {
		warning("存在子权限，无法删除！");
		return;
	}

	if (assignedList.value.includes(id)) {
		warning("权限已分配，无法删除！");
		return;
	}

	confirm()
		.then(async () => {
			const { code, message } = await deletePermission(id);
			if (code === HTTP_CODE.NO_CONTENT) {
				success(message);
			} else {
				error(message);
			}
		})
		.catch(() => {});
}

onMounted(async () => (assignedList.value = await assignedPermission()));
</script>

<template>
	<Table
		:schema="schema"
		:data="data"
		:operation="operation"
		@add="writeRef?.open()"
		@edit="writeRef?.open($event)"
		@delete="handleDelete($event as number)"
	/>

	<Write ref="writeRef" :data="data" />
</template>
