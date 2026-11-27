<script setup lang="tsx">
import type { MenuExpose, MenuProps } from "./types";

import Write from "./Write.vue";
import { COLUMN_MENU, assignedMenu, deleteMenu } from "./helpers";

const { error, success, warning } = useMessage();
const { confirm } = useMessageBox();
const { data } = defineProps<MenuProps>();
const assignedList = ref<number[]>([]);
const writeRef = useTemplateRef<MenuExpose>("writeRef");

const operation: TableOperation = {
	add: PERMISSION_CODE.MENU_ADD,
	edit: PERMISSION_CODE.MENU_EDIT,
	delete: PERMISSION_CODE.MENU_DELETE,
};

const schema: TableSchema[] = [
	{
		field: TABLE_COLUMN.KEY.ID,
		label: TABLE_COLUMN.LABEL.ID,
		minWidth: TABLE_COLUMN.WIDTH.ID,
	},
	{
		field: COLUMN_MENU.KEY.CODE,
		label: COLUMN_MENU.LABEL.CODE,
		minWidth: TABLE_COLUMN.WIDTH.DEFAULT,
	},
	{
		field: COLUMN_MENU.KEY.NAME,
		label: COLUMN_MENU.LABEL.NAME,
		minWidth: TABLE_COLUMN.WIDTH.DEFAULT,
	},
	{
		field: COLUMN_MENU.KEY.ICON,
		label: COLUMN_MENU.LABEL.ICON,
		minWidth: TABLE_COLUMN.WIDTH.DEFAULT,
		formatter: (row: Menu) => <Icon class="mx-auto" icon={row.icon} />,
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
 * @param id 菜单 ID
 *
 * @returns 无内容
 */
async function handleDelete(id: number): Promise<void> {
	if ((data.find((item) => item.id === id)?.children?.length ?? 0) > 0) {
		warning("存在子菜单，无法删除！");
		return;
	}

	if (assignedList.value.includes(id)) {
		warning("菜单已分配，无法删除！");
		return;
	}

	confirm()
		.then(async () => {
			const { code, message } = await deleteMenu(id);
			if (code === HTTP_CODE.NO_CONTENT) {
				success(message);
			} else {
				error(message);
			}
		})
		.catch(() => {});
}

onMounted(async () => (assignedList.value = await assignedMenu()));
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
