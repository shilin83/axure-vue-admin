<script setup lang="ts">
import type { MenuProps, MenuExpose } from "./types";

import { Write } from "..";
import { assignedMenu, COLUMN_MENU, deleteMenu } from "./helpers";

const { error, success, warning } = useMessage();
const { confirm } = useMessageBox();
const { data } = defineProps<MenuProps>();
const writeRef = ref<MenuExpose>();
const assignedList = ref<number[]>([]);

const schema: TableSchema[] = [
	{
		field: TABLE_COLUMN.KEY.ID,
		label: TABLE_COLUMN.LABEL.ID,
		minWidth: TABLE_COLUMN.WIDTH.ID,
	},
	{
		field: TABLE_COLUMN.KEY.CODE,
		label: TABLE_COLUMN.LABEL.CODE,
		minWidth: TABLE_COLUMN.WIDTH.DEFAULT,
	},
	{
		field: TABLE_COLUMN.KEY.NAME,
		label: TABLE_COLUMN.LABEL.NAME,
		minWidth: TABLE_COLUMN.WIDTH.DEFAULT,
	},
	{
		field: COLUMN_MENU.KEY.ICON,
		label: COLUMN_MENU.LABEL.ICON,
		minWidth: TABLE_COLUMN.WIDTH.DEFAULT,
		formatter: (row: Menu) =>
			h(Icon, {
				class: "mx-auto",
				icon: row.icon,
			}),
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
	<div class="m-5 rounded-lg bg-white p-5">
		<div class="flex-center-x mb-5">
			<Button
				type="primary"
				v-perm="PERMISSION_CODE.MENU_ADD"
				:label="BUTTON_MAP.ADD.LABEL"
				:icon="BUTTON_MAP.ADD.ICON"
				@click="writeRef?.open()"
			/>
		</div>

		<Table :schema="schema" :data="data" :pagination="false">
			<template #operation="{ row }">
				<Button
					type="primary"
					v-perm="PERMISSION_CODE.MENU_EDIT"
					:label="BUTTON_MAP.EDIT.LABEL"
					:icon="BUTTON_MAP.EDIT.ICON"
					@click="writeRef?.open(row)"
				/>
				<Button
					type="danger"
					v-perm="PERMISSION_CODE.MENU_DELETE"
					:label="BUTTON_MAP.DELETE.LABEL"
					:icon="BUTTON_MAP.DELETE.ICON"
					@click="handleDelete(row.id)"
				/>
			</template>
		</Table>
	</div>

	<Write ref="writeRef" :data="data" />
</template>
