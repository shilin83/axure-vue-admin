<script setup lang="tsx">
import type { PermissionExpose, PermissionProps } from "./types";

import { COLUMN_PERMISSION, INITIAL_PERMISSION, createPermission, updatePermission } from "./helpers";

const { success, error } = useMessage();
const props = defineProps<PermissionProps>();
const showDialog = defineModel<boolean>();
const isEdit = ref<boolean>(false);
const formRef = ref<FormExpose>();
const formModel = reactive<Permission>(Object.assign({}, INITIAL_PERMISSION));

const formRules = computed<FormRules<Omit<Permission, "children">>>(() => {
	const parentCode = props.data.find((item) => item.id === formModel.parentId)?.code;

	return {
		code: [
			required(),
			...(parentCode === undefined
				? [
						{
							validator: (_: any, value: string, callback: (error?: Error | string) => void) => {
								if (!/^[a-z]+$/.test(value)) {
									callback(new Error("父权限标识只能为英文字符（如 user）"));
									return;
								}

								callback();
							},
						},
					]
				: [
						{
							validator: (_: any, value: string, callback: (error?: Error | string) => void) => {
								const prefix = value.split(":")[0];

								if (!/^[a-z]+:[a-z]+$/.test(value) || prefix !== parentCode) {
									callback(new Error(`子标识以 ${parentCode} 开头，（如 ${parentCode}:add）`));
									return;
								}

								callback();
							},
						},
					]),
		],
		name: [required(), chinese()],
	};
});

const formSchema = computed<FormSchema[]>(() => [
	{
		field: COLUMN_PERMISSION.KEY.PARENT_ID,
		label: COLUMN_PERMISSION.LABEL.PARENT_ID,
		component: COMPONENT_NAME.SELECT,
		componentProps: {
			disabled: isEdit.value && formModel.parentId === 0,
			options: props.data
				.filter((item) => item.parentId === 0 && item.id !== formModel.id)
				.map((item) => ({
					label: item.name,
					value: item.id,
				})),
		} as SelectProps,
	},
	{
		field: TABLE_COLUMN.KEY.CODE,
		label: TABLE_COLUMN.LABEL.CODE,
		component: COMPONENT_NAME.INPUT,
		componentProps: {
			disabled: isEdit.value && formModel.parentId === 0,
		} as InputProps,
	},
	{
		field: TABLE_COLUMN.KEY.NAME,
		label: TABLE_COLUMN.LABEL.NAME,
		component: COMPONENT_NAME.INPUT,
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
			? await updatePermission(id, {
					...payload,
					updatedAt: currentTime(),
				})
			: await createPermission({
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
			Object.assign(formModel, INITIAL_PERMISSION);
		}
	},
);

defineExpose<PermissionExpose>({
	open: (row?: Permission) => {
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
