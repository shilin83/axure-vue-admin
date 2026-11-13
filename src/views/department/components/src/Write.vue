<script setup lang="ts">
import type { DepartmentExpose } from "./types";

import { INITIAL_DEPARTMENT, createDepartment, updateDepartment } from "./helpers";

const { error, success } = useMessage();
const showDialog = ref<boolean>(false);
const isEdit = ref<boolean>(false);
const formRef = ref<FormExpose>();
const model = reactive<Department>(Object.assign({}, INITIAL_DEPARTMENT));

const rules: FormRules<Department> = {
	name: [required(), chinese()],
};

const schema: FormSchema[] = [
	{
		field: TABLE_COLUMN.KEY.NAME,
		label: TABLE_COLUMN.LABEL.NAME,
		component: Input,
	},
];

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
		? await updateDepartment(id, {
				...payload,
				updatedAt: currentTime(),
			})
		: await createDepartment({
				...payload,
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
	<Dialog v-if="showDialog" v-model="showDialog" :title="isEdit ? BUTTON_MAP.EDIT.LABEL : BUTTON_MAP.ADD.LABEL">
		<Form ref="formRef" :schema="schema" :model="model" :rules="rules" />

		<template #footer>
			<Button :label="BUTTON_MAP.CANCEL.LABEL" :icon="BUTTON_MAP.CANCEL.ICON" @click="showDialog = false" />
			<Button type="primary" :label="BUTTON_MAP.CONFIRM.LABEL" :icon="BUTTON_MAP.CONFIRM.ICON" @click="handleSubmit" />
		</template>
	</Dialog>
</template>
