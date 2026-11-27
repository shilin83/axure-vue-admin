<script setup lang="tsx">
import type { UserProps, UserExpose } from "./types";

import circleFlags from "@iconify/json/json/circle-flags.json";

import { INITIAL_USER, COLUMN_USER, createUser, updateUser } from "./helpers";

const { error, success } = useMessage();
const { roles, departments } = defineProps<Omit<UserProps, "data">>();
const showDialog = ref<boolean>(false);
const isEdit = ref<boolean>(false);
const formRef = useTemplateRef<FormExpose>("formRef");
const model = reactive<User>(Object.assign({}, INITIAL_USER));

const rules: FormRules<User> = {
	account: [alphanumeric()],
	name: [chinese()],
	phone: [phone()],
	avatar: [required()],
	roles: [array("请选择1-2个角色")],
	department: {
		required: true,
		validator: (_: unknown, value: number, callback: (error?: Error | string) => void) => {
			if (value === undefined || value === null || value === 0) {
				callback(new Error("请选择部门"));
			} else {
				callback();
			}
		},
	},
};

const schema = computed<FormSchema[]>(() => [
	{
		field: COLUMN_USER.KEY.NAME,
		label: COLUMN_USER.LABEL.NAME,
		component: COMPONENT_NAME.INPUT,
	},
	{
		field: COLUMN_USER.KEY.ACCOUNT,
		label: COLUMN_USER.LABEL.ACCOUNT,
		component: COMPONENT_NAME.INPUT,
		componentProps: {
			disabled: isEdit.value && model.id === 1,
		},
	},
	{
		field: COLUMN_USER.KEY.PHONE,
		label: COLUMN_USER.LABEL.PHONE,
		component: COMPONENT_NAME.INPUT,
	},
	{
		field: COLUMN_USER.KEY.AVATAR,
		label: COLUMN_USER.LABEL.AVATAR,
		customRender: () => (
			<IconPicker
				v-model={model.avatar}
				icons={Object.keys(circleFlags.icons).map((key) => `${circleFlags.prefix}:${key}`)}
			/>
		),
	},
	{
		field: COLUMN_USER.KEY.DEPARTMENT,
		label: COLUMN_USER.LABEL.DEPARTMENT,
		component: COMPONENT_NAME.SELECT,
		componentProps: {
			options: departments.map((item) => ({
				label: item.name,
				value: item.id,
			})),
		},
	},
	{
		field: COLUMN_USER.KEY.ROLES,
		label: COLUMN_USER.LABEL.ROLES,
		component: COMPONENT_NAME.CHECKBOX_GROUP,
		componentProps: {
			max: 2,
			options: roles.map((item) => ({
				label: item.name,
				value: item.id,
			})),
		},
	},
]);

/**
 * 提交表单
 *
 * @returns 无内容
 */
async function handleSubmit(): Promise<void> {
	if (formRef.value === null) return;
	if (!(await formRef.value.validate())) return;

	const { id, ...payload } = toRaw(model);
	const { code, message } = isEdit.value
		? await updateUser(id, {
				...payload,
				updatedAt: currentUnix(),
			})
		: await createUser({
				...payload,
				password: DEFAULT_USER.PASSWORD,
				email: `${payload.account}${DEFAULT_USER.EMAIL_SUFFIX}`,
				createdAt: currentUnix(),
			});

	if (code === HTTP_CODE.CREATED || code === HTTP_CODE.NO_CONTENT) {
		showDialog.value = false;
		success(message);
	} else {
		error(message);
	}
}

watch([() => showDialog.value, () => model.avatar], ([bool, avatar]) => {
	if (avatar !== "") formRef.value?.clearValidate(COLUMN_USER.KEY.AVATAR);

	if (!bool) {
		isEdit.value = false;
		Object.assign(model, INITIAL_USER);
	}
});

defineExpose<UserExpose>({
	open: (row?: User) => {
		showDialog.value = true;

		if (row !== undefined) {
			isEdit.value = true;
			Object.assign(model, row);
		}
	},
});
</script>

<template>
	<Dialog v-model="showDialog" :title="isEdit ? BUTTON_TEXT.EDIT : BUTTON_TEXT.ADD" @submit="handleSubmit">
		<Form ref="formRef" :schema="schema" :model="model" :rules="rules" />
	</Dialog>
</template>
