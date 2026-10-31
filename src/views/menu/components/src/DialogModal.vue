<script setup lang="tsx">
import type { MenuProps, MenuExpose } from "./types";

import flagpack from "@iconify/json/json/flagpack.json";

import { COLUMN_MENU, INITIAL_MENU, createMenu, updateMenu } from "./helpers";

const { success, error } = useMessage();
const props = defineProps<MenuProps>();
const showDialog = defineModel<boolean>();
const isEdit = ref<boolean>(false);
const formRef = ref<FormExpose>();
const formModel = reactive<Menu>(Object.assign({}, INITIAL_MENU));

const formRules = reactive<FormRules<Omit<Menu, "children">>>({
	code: [required(), alphanumeric()],
	name: [required(), chinese()],
	icon: [required()],
});

const formSchema = computed<FormSchema[]>(() => [
	{
		field: COLUMN_MENU.KEY.PARENT_ID,
		label: COLUMN_MENU.LABEL.PARENT_ID,
		component: COMPONENT_NAME.SELECT,
		componentProps: {
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
	},
	{
		field: TABLE_COLUMN.KEY.NAME,
		label: TABLE_COLUMN.LABEL.NAME,
		component: COMPONENT_NAME.INPUT,
	},
	{
		field: COLUMN_MENU.KEY.ICON,
		label: COLUMN_MENU.LABEL.ICON,
		customRender: () => (
			<IconPicker
				v-model={formModel.icon}
				icons={Object.keys(flagpack.icons).map((key) => `${flagpack.prefix}:${key}`)}
			/>
		),
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
			? await updateMenu(id, {
					...payload,
					updatedAt: currentTime(),
				})
			: await createMenu({
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

watch([() => formModel.icon, () => showDialog.value], ([icon, bool]) => {
	if (icon !== "") formRef.value?.clearValidate(COLUMN_MENU.KEY.ICON);
	if (!bool) {
		isEdit.value = false;
		Object.assign(formModel, INITIAL_MENU);
	}
});

defineExpose<MenuExpose>({
	open: (row?: Menu) => {
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
