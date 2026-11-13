<script setup lang="ts">
import type { UserExpose, UserProps } from "./types";

import { Write } from "..";
import { COLUMN_USER, deleteUser } from "./helpers";

const { error, success } = useMessage();
const { confirm } = useMessageBox();
const { data, roles, departments } = defineProps<UserProps>();
const selectedRows = ref<User[]>([]);
const writeRef = ref<UserExpose>();
const searchKeyword = ref<string>("");
const input$ = new Subject<string>();

const subscription = input$.pipe(debounceTime(DEBOUNCE_TIME), distinctUntilChanged()).subscribe((value) => {
	searchKeyword.value = value;
});

const schema = computed<TableSchema[]>(() => [
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
		field: COLUMN_USER.KEY.AVATAR,
		label: COLUMN_USER.LABEL.AVATAR,
		minWidth: TABLE_COLUMN.WIDTH.DEFAULT,
		formatter: (row: User) =>
			h(Icon, {
				class: "mx-auto h-5 w-5",
				icon: row.avatar,
			}),
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
	confirm()
		.then(async () => {
			const { code, message } = await deleteUser(id);
			if (code === HTTP_CODE.NO_CONTENT) {
				success(message);
			} else {
				error(message);
			}
		})
		.catch(() => {});
}

onUnmounted(() => subscription.unsubscribe());
</script>

<template>
	<div class="m-5 rounded-lg bg-white p-5">
		<div class="flex-center-x mb-5 justify-between">
			<div>
				<Button
					type="primary"
					v-perm="PERMISSION_CODE.USER_ADD"
					:label="BUTTON_MAP.ADD.LABEL"
					:icon="BUTTON_MAP.ADD.ICON"
					@click="writeRef?.open()"
				/>
				<Button
					type="danger"
					v-perm="PERMISSION_CODE.USER_DELETE"
					:disabled="selectedRows.length === 0"
					:label="BUTTON_MAP.BATCH_DESTROY.LABEL"
					:icon="BUTTON_MAP.BATCH_DESTROY.ICON"
					@click="handleDelete(selectedRows.map((row) => row.id))"
				/>
			</div>

			<div>
				<Input
					v-model="searchKeyword"
					placeholder="请输入账号 / 姓名"
					:prefix-icon="
						h(Icon, {
							icon: BUTTON_MAP.SEARCH.ICON,
						})
					"
					@update:model-value="(value) => input$.next(value as string)"
				/>
			</div>
		</div>

		<Table
			v-model="selectedRows"
			:schema="schema"
			:data="data"
			:selectable="(row) => row.id !== 1"
			:search="{
				keyword: searchKeyword,
				fields: [COLUMN_USER.KEY.ACCOUNT, COLUMN_USER.KEY.NAME],
			}"
		>
			<template #operation="{ row }">
				<Button
					type="primary"
					v-perm="PERMISSION_CODE.USER_EDIT"
					:label="BUTTON_MAP.EDIT.LABEL"
					:icon="BUTTON_MAP.EDIT.ICON"
					@click="writeRef?.open(row)"
				/>
				<Button
					type="danger"
					v-perm="PERMISSION_CODE.USER_DELETE"
					:disabled="row.id === 1"
					:label="BUTTON_MAP.DELETE.LABEL"
					:icon="BUTTON_MAP.DELETE.ICON"
					@click="handleDelete(row.id)"
				/>
			</template>
		</Table>
	</div>

	<Write ref="writeRef" :roles="roles" :departments="departments" />
</template>
