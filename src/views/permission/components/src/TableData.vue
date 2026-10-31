<script setup lang="ts">
import type { PermissionExpose, PermissionProps } from "./types";

import { DialogModal } from "..";
import { assignedPermission, deletePermission } from "./helpers";

const { error, success, warning } = useMessage();
const { confirm } = useMessageBox();
const props = defineProps<PermissionProps>();
const dialogRef = ref<PermissionExpose>();
const assignedList = ref<number[]>([]);

const tableSchema = computed<TableSchema[]>(() => [
	{
		field: "expand",
		label: "",
		type: "expand",
		minWidth: 60,
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
]);

const expandSchema = computed<TableSchema[]>(() => tableSchema.value.slice(1));

/**
 * 删除操作
 *
 * @param id 权限ID
 *
 * @returns 无内容
 */
async function handleDelete(id: number): Promise<void> {
	if (props.data.some((item) => item.id === id && (item.children?.length ?? 0) > 0)) {
		warning("存在子权限，无法删除！");
		return;
	}

	if (assignedList.value.includes(id)) {
		warning("该权限已分配，无法删除！");
		return;
	}

	confirm(DELETE_CONFIRM).then(async () => {
		const { code, message } = await deletePermission(id);
		if (code === HTTP_CODE.NO_CONTENT) {
			success(message);
		} else {
			error(message);
		}
	});
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
				@handle-click="dialogRef?.open()"
			/>
		</div>

		<Table :schema="tableSchema" :data="props.data">
			<template #expand="{ row }">
				<Table v-if="row.children.length > 0" :schema="expandSchema" :data="row.children">
					<template #operation="{ row }">
						<Button
							type="primary"
							v-perm="PERMISSION_CODE.PERMISSION_EDIT"
							:label="BUTTON_MAP.EDIT.LABEL"
							:icon="BUTTON_MAP.EDIT.ICON"
							@handle-click="dialogRef?.open(row)"
						/>
						<Button
							type="danger"
							v-perm="PERMISSION_CODE.PERMISSION_DELETE"
							:label="BUTTON_MAP.DELETE.LABEL"
							:icon="BUTTON_MAP.DELETE.ICON"
							@handle-click="handleDelete(row.id)"
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
					@handle-click="dialogRef?.open(row)"
				/>
				<Button
					type="danger"
					v-perm="PERMISSION_CODE.PERMISSION_DELETE"
					:label="BUTTON_MAP.DELETE.LABEL"
					:icon="BUTTON_MAP.DELETE.ICON"
					@handle-click="handleDelete(row.id)"
				/>
			</template>
		</Table>
	</div>

	<DialogModal ref="dialogRef" :data="props.data" />
</template>
