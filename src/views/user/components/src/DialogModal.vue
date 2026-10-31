<script setup lang="tsx">
import type { UserProps, UserExpose } from "./types";

import circleFlags from "@iconify/json/json/circle-flags.json";

import { COLUMN_USER, INITIAL_USER, createUser, updateUser } from "./helpers";

const { success, error } = useMessage();
const props = defineProps<Omit<UserProps, "recycled">>();
const showDialog = ref<boolean>(false);
const isEdit = ref<boolean>(false);
const formRef = ref<FormExpose>();
const formModel = reactive<User>(Object.assign({}, INITIAL_USER));

const formRules = reactive<FormRules<Omit<User, "password">>>({
	username: [required(), alphanumeric()],
	realname: [required(), chinese()],
	email: [required(), alphanumeric()],
	phone: [required(), phone139()],
	avatar: [required()],
	roles: [array("请选择1-2个角色")],
	department: [
		required(),
		{
			validator: (_: any, value: number, callback: (error?: Error | string) => void) => {
				if (value === undefined || value === null || value === 0) {
					callback(new Error("请选择部门"));
					return;
				}
				callback();
			},
		},
	],
});

const formSchema = computed<FormSchema[]>(() => [
	{
		field: COLUMN_USER.KEY.REALNAME,
		label: COLUMN_USER.LABEL.REALNAME,
		component: COMPONENT_NAME.INPUT,
	},
	{
		field: COLUMN_USER.KEY.USERNAME,
		label: COLUMN_USER.LABEL.USERNAME,
		component: COMPONENT_NAME.INPUT,
		componentProps: {
			disabled: isEdit.value,
		} as InputProps,
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
				v-model={formModel.avatar}
				icons={Object.keys(circleFlags.icons).map((key) => `${circleFlags.prefix}:${key}`)}
			/>
		),
	},
	{
		field: COLUMN_USER.KEY.DEPARTMENT,
		label: COLUMN_USER.LABEL.DEPARTMENT,
		component: COMPONENT_NAME.SELECT,
		componentProps: {
			options: props.departments.map((item) => ({
				label: item.name,
				value: item.id,
			})),
		} as SelectProps,
	},
	{
		field: COLUMN_USER.KEY.ROLE,
		label: COLUMN_USER.LABEL.ROLE,
		component: COMPONENT_NAME.CHECKBOX,
		componentProps: {
			max: 2,
			options: props.roles
				.filter((item) => item.id !== 1)
				.map((item) => ({
					label: item.name,
					value: item.id,
				})),
		} as CheckboxProps,
	},
]);

/**
 * 提交表单
 *
 * @returns 无内容
 */
async function handleSubmit(): Promise<void> {
	if (formRef.value === undefined) return;
	if (!(await formRef.value.validate())) return;

	try {
		const { id, ...payload } = toRaw(formModel);

		const { code, message } = isEdit.value
			? await updateUser(id, {
					...payload,
					updatedAt: currentTime(),
				})
			: await createUser({
					...payload,
					password: DEFAULT_PASSWORD,
					email: `${payload.username}${EMAIL_SUFFIX}`,
					createdAt: currentTime(),
				});

		if (code === HTTP_CODE.CREATED || code === HTTP_CODE.NO_CONTENT) {
			success(message);
		} else {
			error(message);
		}
	} finally {
		showDialog.value = false;
	}
}

watch([() => formModel.avatar, () => showDialog.value], ([icon, bool]) => {
	if (icon !== "") formRef.value?.clearValidate(COLUMN_USER.KEY.AVATAR);
	if (!bool) {
		isEdit.value = false;
		Object.assign(formModel, INITIAL_USER);
	}
});

defineExpose<UserExpose>({
	open: (row?: User) => {
		showDialog.value = true;

		if (row !== undefined) {
			isEdit.value = true;
			Object.assign(formModel, row);
		}
	},
});
</script>

<template>
	<Dialog v-if="showDialog" v-model="showDialog" :title="isEdit ? BUTTON_MAP.EDIT.LABEL : BUTTON_MAP.ADD.LABEL">
		<Form ref="formRef" :schema="formSchema" :model="formModel" :rules="formRules" />

		<template #footer>
			<Button :label="BUTTON_MAP.CANCEL.LABEL" :icon="BUTTON_MAP.CANCEL.ICON" @handle-click="showDialog = false" />
			<Button
				type="primary"
				:label="BUTTON_MAP.CONFIRM.LABEL"
				:icon="BUTTON_MAP.CONFIRM.ICON"
				@handle-click="handleSubmit"
			/>
		</template>
	</Dialog>
</template>
