<script setup lang="tsx">
import type { UserProps, UserExpose } from "./types";

import circleFlags from "@iconify/json/json/circle-flags.json";

import { COLUMN_USER, INITIAL_USER, createUser, updateUser } from "./helpers";

const { error, success } = useMessage();
const { roles, departments } = defineProps<Omit<UserProps, "data">>();
const showDialog = ref<boolean>(false);
const isEdit = ref<boolean>(false);
const formRef = ref<FormExpose>();
const model = reactive<User>(Object.assign({}, INITIAL_USER));

const rules: FormRules<User> = {
	account: [required(), alphanumeric()],
	name: [required(), chinese()],
	phone: [required(), phone139()],
	avatar: [required()],
	roles: [array("请选择1-2个角色")],
	department: {
		required: true,
		validator: (_: any, value: number, callback: (error?: Error | string) => void) => {
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
		component: Input,
	},
	{
		field: COLUMN_USER.KEY.ACCOUNT,
		label: COLUMN_USER.LABEL.ACCOUNT,
		component: Input,
	},
	{
		field: COLUMN_USER.KEY.PHONE,
		label: COLUMN_USER.LABEL.PHONE,
		component: Input,
	},
	{
		field: COLUMN_USER.KEY.AVATAR,
		label: COLUMN_USER.LABEL.AVATAR,
		customRender: () =>
			h(IconPicker, {
				icons: Object.keys(circleFlags.icons).map((key) => `${circleFlags.prefix}:${key}`),
				modelValue: model.avatar,
				"onUpdate:modelValue": (avatar) => {
					model.avatar = avatar as string;
					if (model.avatar !== "") formRef.value?.clearValidate(COLUMN_USER.KEY.AVATAR);
				},
			}),
	},
	{
		field: COLUMN_USER.KEY.DEPARTMENT,
		label: COLUMN_USER.LABEL.DEPARTMENT,
		component: Select,
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
		component: Checkbox,
		componentProps: {
			max: 2,
			options: roles
				.filter((item) => item.id !== 1)
				.map((item) => ({
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
	if (formRef.value === undefined) return;
	if (!(await formRef.value.validate())) return;

	const { id, ...payload } = toRaw(model);
	const { code, message } = isEdit.value
		? await updateUser(id, {
				...payload,
				updatedAt: currentTime(),
			})
		: await createUser({
				...payload,
				email: payload.account + EMAIL_SUFFIX,
				createdAt: currentTime(),
			});

	if (code === HTTP_CODE.CREATED || code === HTTP_CODE.NO_CONTENT) {
		showDialog.value = false;
		success(message);
	} else {
		error(message);
	}
}

watch(
	() => showDialog.value,
	(bool) => {
		if (!bool) {
			isEdit.value = false;
			Object.assign(model, INITIAL_USER);
		}
	},
);

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
	<Dialog v-if="showDialog" v-model="showDialog" :title="isEdit ? BUTTON_MAP.EDIT.LABEL : BUTTON_MAP.ADD.LABEL">
		<Form ref="formRef" :schema="schema" :model="model" :rules="rules" />

		<template #footer>
			<Button :label="BUTTON_MAP.CANCEL.LABEL" :icon="BUTTON_MAP.CANCEL.ICON" @click="showDialog = false" />
			<Button type="primary" :label="BUTTON_MAP.CONFIRM.LABEL" :icon="BUTTON_MAP.CONFIRM.ICON" @click="handleSubmit" />
		</template>
	</Dialog>
</template>
