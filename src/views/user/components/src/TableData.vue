<script setup lang="tsx">
import type { UserExpose, UserProps } from "./types";

import { DetailView, DialogModal } from "..";
import { COLUMN_USER, deleteUser, updateUser } from "./helpers";

const { error, success } = useMessage();
const { confirm } = useMessageBox();
const props = defineProps<UserProps>();
const activeTab = ref<string>(ACTIVE_TAB.KEY.DEFAULT);
const dialogRef = ref<UserExpose>();
const detailRef = ref<UserExpose>();
const selectedRows = ref<User[]>([]);

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
		field: COLUMN_USER.KEY.DEPARTMENT,
		label: COLUMN_USER.LABEL.DEPARTMENT,
		minWidth: TABLE_COLUMN.WIDTH.DEFAULT,
		formatter: (row: User) => props.departments.find((item) => item.id === row.department)?.name ?? "",
	},
	{
		field: COLUMN_USER.KEY.AVATAR,
		label: COLUMN_USER.LABEL.AVATAR,
		minWidth: TABLE_COLUMN.WIDTH.DEFAULT,
		formatter: (row: User) => <Icon class="mx-auto h-5 w-5" icon={row.avatar} />,
	},
	{
		field: COLUMN_USER.KEY.REALNAME,
		label: COLUMN_USER.LABEL.REALNAME,
		minWidth: TABLE_COLUMN.WIDTH.DEFAULT,
	},
	{
		field: COLUMN_USER.KEY.USERNAME,
		label: COLUMN_USER.LABEL.USERNAME,
		minWidth: TABLE_COLUMN.WIDTH.DEFAULT,
	},
	{
		field: COLUMN_USER.KEY.EMAIL,
		label: COLUMN_USER.LABEL.EMAIL,
		minWidth: TABLE_COLUMN.WIDTH.OPERATION + 50,
	},
	{
		field: COLUMN_USER.KEY.PHONE,
		label: COLUMN_USER.LABEL.PHONE,
		minWidth: TABLE_COLUMN.WIDTH.DEFAULT + 50,
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
 * @param id 用户 ID
 * @param data 更新数据
 *
 * @returns 无内容
 */
async function handleUpdate(id: number, data: string): Promise<void> {
	const { code, message } = await updateUser(id, data);
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
 * @param ids 用户 ID 列表
 * @param clear 是否清空回收站
 *
 * @returns 无内容
 */
async function handleDelete(ids: number[], clear: boolean = false): Promise<void> {
	confirm(DELETE_CONFIRM)
		.then(async () => {
			const { code, message } = await deleteUser(ids, clear);
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
</script>

<template>
	<div class="m-5 rounded-lg bg-white p-5">
		<ElTabs v-model="activeTab" type="border-card">
			<ElTabPane :label="ACTIVE_TAB.LABEL.DEFAULT" :name="ACTIVE_TAB.KEY.DEFAULT">
				<div class="flex-center-x mb-5">
					<Button
						type="primary"
						v-perm="PERMISSION_CODE.USER_ADD"
						:label="BUTTON_MAP.ADD.LABEL"
						:icon="BUTTON_MAP.ADD.ICON"
						@handle-click="dialogRef?.open()"
					/>
					<Button
						type="danger"
						v-perm="PERMISSION_CODE.USER_DELETE"
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
					:selectable="(row: User) => row.id !== 1"
					pagination
				>
					<template #operation="{ row }">
						<Button
							type="success"
							:label="BUTTON_MAP.DETAIL.LABEL"
							:icon="BUTTON_MAP.DETAIL.ICON"
							@handle-click="detailRef?.open(row)"
						/>
						<Button
							type="primary"
							v-perm="PERMISSION_CODE.USER_EDIT"
							:label="BUTTON_MAP.EDIT.LABEL"
							:icon="BUTTON_MAP.EDIT.ICON"
							@handle-click="dialogRef?.open(row)"
						/>
						<Button
							type="danger"
							v-perm="PERMISSION_CODE.USER_DELETE"
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
						v-perm="PERMISSION_CODE.USER_DELETE"
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
							v-perm="PERMISSION_CODE.USER_DELETE"
							:label="BUTTON_MAP.RESTORE.LABEL"
							:icon="BUTTON_MAP.RESTORE.ICON"
							@handle-click="handleUpdate(row.id, '')"
						/>
					</template>
				</Table>
			</ElTabPane>
		</ElTabs>
	</div>

	<DialogModal ref="dialogRef" :data="props.data" :roles="props.roles" :departments="props.departments" />
	<DetailView ref="detailRef" :roles="props.roles" :departments="props.departments" />
</template>
