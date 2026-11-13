<script setup lang="ts">
import type { PermissionExpose, PermissionProps } from "./types";

import { Write } from "..";
import { assignedPermission, deletePermission } from "./helpers";

const { error, success, warning } = useMessage();
const { confirm } = useMessageBox();
const { data } = defineProps<PermissionProps>();
const writeRef = ref<PermissionExpose>();
const assignedList = ref<number[]>([]);

const schema: TableSchema[] = [
	{
		field: "expand",
		label: "",
		type: "expand",
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

const expand = schema.slice(1);

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
	<div class="m-5 rounded-lg bg-white p-5">
		<div class="flex-center-x mb-5">
			<Button
				type="primary"
				v-perm="PERMISSION_CODE.PERMISSION_ADD"
				:label="BUTTON_MAP.ADD.LABEL"
				:icon="BUTTON_MAP.ADD.ICON"
				@click="writeRef?.open()"
			/>
		</div>

		<Table :schema="schema" :data="data" :pagination="false">
			<template #expand="{ row }">
				<Table v-if="row.children.length > 0" :schema="expand" :data="row.children" :pagination="false">
					<template #operation="{ row }">
						<Button
							type="primary"
							v-perm="PERMISSION_CODE.PERMISSION_EDIT"
							:label="BUTTON_MAP.EDIT.LABEL"
							:icon="BUTTON_MAP.EDIT.ICON"
							@click="writeRef?.open(row)"
						/>
						<Button
							type="danger"
							v-perm="PERMISSION_CODE.PERMISSION_DELETE"
							:label="BUTTON_MAP.DELETE.LABEL"
							:icon="BUTTON_MAP.DELETE.ICON"
							@click="handleDelete(row.id)"
						/>
					</template>
				</Table>
			</template>

			<template #operation="{ row }">
				<Button
					type="primary"
					v-perm="PERMISSION_CODE.PERMISSION_EDIT"
					:label="BUTTON_MAP.EDIT.LABEL"
					:icon="BUTTON_MAP.EDIT.ICON"
					@click="writeRef?.open(row)"
				/>
				<Button
					type="danger"
					v-perm="PERMISSION_CODE.PERMISSION_DELETE"
					:label="BUTTON_MAP.DELETE.LABEL"
					:icon="BUTTON_MAP.DELETE.ICON"
					@click="handleDelete(row.id)"
				/>
			</template>
		</Table>
	</div>

	<Write ref="writeRef" :data="data" />
</template>
