<script setup lang="tsx">
import type { DepartmentExpose } from "./types";

import { INITIAL_DEPARTMENT, COLUMN_DEPARTMENT, createDepartment, updateDepartment } from "./helpers";

const { error, success } = useMessage();
const showDialog = ref<boolean>(false);
const isEdit = ref<boolean>(false);
const formRef = useTemplateRef<FormExpose>("formRef");
const model = reactive<Department>(Object.assign({}, INITIAL_DEPARTMENT));

const rules: FormRules<Department> = {
	name: [required(), chinese()],
};

const schema: FormSchema[] = [
	{
		field: COLUMN_DEPARTMENT.KEY.NAME,
		label: COLUMN_DEPARTMENT.LABEL.NAME,
		component: COMPONENT_NAME.INPUT,
	},
	{
		field: TABLE_COLUMN.KEY.STATUS,
		label: TABLE_COLUMN.LABEL.STATUS,
		component: COMPONENT_NAME.SWITCH,
		componentProps: {
			disabled: isEdit.value,
		},
	},
];

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
		? await updateDepartment(id, {
				...payload,
				updatedAt: currentUnix(),
			})
		: await createDepartment({
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
			Object.assign(model, INITIAL_DEPARTMENT);
		}
	},
);

defineExpose<DepartmentExpose>({
	open: (row?: Department) => {
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
