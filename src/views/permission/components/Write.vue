<script setup lang="ts">
import type { PermissionExpose, PermissionProps } from "./types";

import { INITIAL_PERMISSION, COLUMN_PERMISSION, createPermission, updatePermission } from "./helpers";

const { error, success } = useMessage();
const { data } = defineProps<PermissionProps>();
const showDialog = ref<boolean>(false);
const isEdit = ref<boolean>(false);
const formRef = useTemplateRef<FormExpose>("formRef");
const model = reactive<Permission>(Object.assign({}, INITIAL_PERMISSION));

const rules = computed<FormRules<Omit<Permission, "children">>>(() => {
	const parentCode = data.find((item) => item.id === model.parentId)?.code;

	return {
		name: [chinese()],
		code: [
			required(),
			...(parentCode === undefined
				? [
						{
							validator: (_: unknown, value: string, callback: (error?: Error | string) => void) => {
								if (!/^[a-z]+$/.test(value)) {
									callback(new Error("父权限标识只能为英文字符（如 user）"));
								} else {
									callback();
								}
							},
						},
					]
				: [
						{
							validator: (_: unknown, value: string, callback: (error?: Error | string) => void) => {
								const prefix = value.split(":")[0];

								if (!/^[a-z]+:[a-z]+$/.test(value) || prefix !== parentCode) {
									callback(new Error(`子标识以 ${parentCode} 开头，（如 ${parentCode}:add）`));
								} else {
									callback();
								}
							},
						},
					]),
		],
	};
});

const schema = computed<FormSchema[]>(() => [
	{
		field: COLUMN_PERMISSION.KEY.PARENT,
		label: COLUMN_PERMISSION.LABEL.PARENT,
		component: COMPONENT_NAME.SELECT,
		componentProps: {
			disabled: isEdit.value && (data.find((item) => item.id === model.id)?.children?.length ?? 0) > 0,
			options: data
				.filter((item) => item.id !== model.id)
				.map((item) => ({
					label: item.name,
					value: item.id,
				})),
		},
	},
	{
		field: COLUMN_PERMISSION.KEY.CODE,
		label: COLUMN_PERMISSION.LABEL.CODE,
		component: COMPONENT_NAME.INPUT,
		componentProps: {
			disabled: isEdit.value && (data.find((item) => item.id === model.id)?.children?.length ?? 0) > 0,
		},
	},
	{
		field: COLUMN_PERMISSION.KEY.NAME,
		label: COLUMN_PERMISSION.LABEL.NAME,
		component: COMPONENT_NAME.INPUT,
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
		? await updatePermission(id, {
				...payload,
				updatedAt: currentUnix(),
			})
		: await createPermission({
				...payload,
				createdAt: currentUnix(),
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
			Object.assign(model, INITIAL_PERMISSION);
		}
	},
);

defineExpose<PermissionExpose>({
	open: (row?: Permission) => {
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
