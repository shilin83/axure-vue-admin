<script setup lang="ts">
import type { DepartmentExpose, DepartmentProps } from "./types";

import { INITIAL_DEPARTMENT, createDepartment, updateDepartment } from "./helpers";

const { success, error } = useMessage();
const props = defineProps<Omit<DepartmentProps, "recycled">>();
const showDialog = defineModel<boolean>();
const isEdit = ref<boolean>(false);
const formRef = ref<FormExpose>();
const formModel = reactive<Department>(Object.assign({}, INITIAL_DEPARTMENT));

const formRules = reactive<FormRules<Pick<Department, "name">>>({
	name: [required(), chinese()],
});

const formSchema = computed<FormSchema[]>(() => [
	{
		field: TABLE_COLUMN.KEY.NAME,
		label: TABLE_COLUMN.LABEL.NAME,
		component: COMPONENT_NAME.INPUT,
	},
	{
		field: TABLE_COLUMN.KEY.STATUS,
		label: TABLE_COLUMN.LABEL.STATUS,
		component: COMPONENT_NAME.SWITCH,
		componentProps: {
			disabled: isEdit.value,
		} as SwitchProps,
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
			? await updateDepartment(id, {
					...payload,
					updatedAt: currentTime(),
				})
			: await createDepartment({
					...payload,
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

watch(
	() => showDialog.value,
	(bool) => {
		if (!bool) {
			isEdit.value = false;
			Object.assign(formModel, INITIAL_DEPARTMENT);
		}
	},
);

defineExpose<DepartmentExpose>({
	open: (row?: Department) => {
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
