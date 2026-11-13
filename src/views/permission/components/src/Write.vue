<script setup lang="ts">
import type { PermissionExpose, PermissionProps } from "./types";

import { INITIAL_PERMISSION, createPermission, updatePermission } from "./helpers";

const { error, success } = useMessage();
const { data } = defineProps<PermissionProps>();
const showDialog = ref<boolean>(false);
const isEdit = ref<boolean>(false);
const formRef = ref<FormExpose>();
const model = reactive<Permission>(Object.assign({}, INITIAL_PERMISSION));

const rules = computed<FormRules<Omit<Permission, "children">>>(() => {
	const parentCode = data.find((item) => item.id === model.parentId)?.code;

	return {
		name: [required(), chinese()],
		code: [
			required(),
			...(parentCode === undefined
				? [
						{
							validator: (_: any, value: string, callback: (error?: Error | string) => void) => {
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
							validator: (_: any, value: string, callback: (error?: Error | string) => void) => {
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
		field: "parentId",
		label: "父权限",
		component: Select,
		componentProps: {
			disabled: isEdit.value && (data.find((item) => item.id === model.id)?.children?.length ?? 0) > 0,
			options: data
				.filter((item) => item.parentId === 0 && item.id !== model.id)
				.map((item) => ({
					label: item.name,
					value: item.id,
				})),
		},
	},
	{
		field: TABLE_COLUMN.KEY.CODE,
		label: TABLE_COLUMN.LABEL.CODE,
		component: Input,
		componentProps: {
			disabled: isEdit.value && (data.find((item) => item.id === model.id)?.children?.length ?? 0) > 0,
		},
	},
	{
		field: TABLE_COLUMN.KEY.NAME,
		label: TABLE_COLUMN.LABEL.NAME,
		component: Input,
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
		? await updatePermission(id, {
				...payload,
				updatedAt: currentTime(),
			})
		: await createPermission({
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
	<Dialog v-if="showDialog" v-model="showDialog" :title="isEdit ? BUTTON_MAP.EDIT.LABEL : BUTTON_MAP.ADD.LABEL">
		<Form ref="formRef" :schema="schema" :model="model" :rules="rules" />

		<template #footer>
			<Button :label="BUTTON_MAP.CANCEL.LABEL" :icon="BUTTON_MAP.CANCEL.ICON" @click="showDialog = false" />
			<Button type="primary" :label="BUTTON_MAP.CONFIRM.LABEL" :icon="BUTTON_MAP.CONFIRM.ICON" @click="handleSubmit" />
		</template>
	</Dialog>
</template>
