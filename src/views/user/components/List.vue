<script setup lang="tsx">
import type { UserProps, UserExpose } from "./types";

import Write from "./Write.vue";
import { COLUMN_USER, deleteUser } from "./helpers";

const { error, success, warning } = useMessage();
const { confirm } = useMessageBox();
const { data, roles, departments } = defineProps<UserProps>();
const selectedRows = ref<User[]>([]);
const searchKeyword = ref<string>("");
const writeRef = useTemplateRef<UserExpose>("writeRef");

const operation: TableOperation = {
	add: PERMISSION_CODE.USER_ADD,
	edit: PERMISSION_CODE.USER_EDIT,
	delete: PERMISSION_CODE.USER_DELETE,
	batchDestroy: PERMISSION_CODE.USER_DELETE,
};

const schema = computed<TableSchema[]>(() => [
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
		field: COLUMN_USER.KEY.AVATAR,
		label: COLUMN_USER.LABEL.AVATAR,
		minWidth: TABLE_COLUMN.WIDTH.DEFAULT,
		formatter: (row: User) => <Icon class="mx-auto h-5 w-5" icon={row.avatar} />,
	},
	{
		field: COLUMN_USER.KEY.NAME,
		label: COLUMN_USER.LABEL.NAME,
		minWidth: TABLE_COLUMN.WIDTH.DEFAULT,
	},
	{
		field: COLUMN_USER.KEY.DEPARTMENT,
		label: COLUMN_USER.LABEL.DEPARTMENT,
		minWidth: TABLE_COLUMN.WIDTH.DEFAULT,
		formatter: (row: User) => departments.find((department) => department.id === row.department)?.name ?? "",
		filterMethod: (value, row) => row.department === value,
		filters: departments.map((department) => ({
			text: department.name,
			value: department.id,
		})),
	},
	{
		field: COLUMN_USER.KEY.ROLES,
		label: COLUMN_USER.LABEL.ROLES,
		minWidth: TABLE_COLUMN.WIDTH.OPERATION,
		formatter: (row: User) =>
			roles
				.filter((role) => row.roles.includes(role.id))
				.map((role) => role.name)
				.join("、"),
	},
	{
		field: COLUMN_USER.KEY.ACCOUNT,
		label: COLUMN_USER.LABEL.ACCOUNT,
		minWidth: TABLE_COLUMN.WIDTH.DEFAULT,
	},
	{
		field: COLUMN_USER.KEY.EMAIL,
		label: COLUMN_USER.LABEL.EMAIL,
		minWidth: TABLE_COLUMN.WIDTH.OPERATION,
	},
	{
		field: COLUMN_USER.KEY.PHONE,
		label: COLUMN_USER.LABEL.PHONE,
		minWidth: TABLE_COLUMN.WIDTH.OPERATION,
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
 * 删除操作
 *
 * @param id 用户 ID
 *
 * @returns 无内容
 */
async function handleDelete(id: Arrayable<number>): Promise<void> {
	if (id === 1) {
		warning("默认用户无法删除");
		return;
	}

	confirm()
		.then(async () => {
			const { code, message } = await deleteUser(id);
			if (code === HTTP_CODE.NO_CONTENT) {
				success(message);
			} else {
				error(message);
			}
		})
		.catch(() => (selectedRows.value = []));
}
</script>

<template>
	<Table
		v-model="selectedRows"
		:schema="schema"
		:data="data"
		:operation="operation"
		:selectable="(row) => row.id !== 1"
		:search="{
			keyword: searchKeyword,
			fields: [
				{
					[COLUMN_USER.KEY.ACCOUNT]: COLUMN_USER.LABEL.ACCOUNT,
				},
				{
					[COLUMN_USER.KEY.NAME]: COLUMN_USER.LABEL.NAME,
				},
			],
		}"
		@add="writeRef?.open()"
		@edit="writeRef?.open($event)"
		@delete="handleDelete($event)"
	/>

	<Write ref="writeRef" :roles="roles" :departments="departments" />
</template>
