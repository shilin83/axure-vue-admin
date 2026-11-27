<script setup lang="tsx">
import type { MenuProps, MenuExpose } from "./types";

import flagpack from "@iconify/json/json/flagpack.json";

import { INITIAL_MENU, COLUMN_MENU, createMenu, updateMenu } from "./helpers";

const { error, success } = useMessage();
const { data } = defineProps<MenuProps>();
const showDialog = ref<boolean>(false);
const isEdit = ref<boolean>(false);
const formRef = useTemplateRef<FormExpose>("formRef");
const model = reactive<Menu>(Object.assign({}, INITIAL_MENU));

const rules: FormRules<Omit<Menu, "children">> = {
	code: [alphanumeric()],
	name: [chinese()],
	icon: [required()],
};

const schema = computed<FormSchema[]>(() => [
	{
		field: COLUMN_MENU.KEY.PARENT,
		label: COLUMN_MENU.LABEL.PARENT,
		component: COMPONENT_NAME.SELECT,
		componentProps: {
			options: data
				.filter((item) => item.id !== model.id)
				.map((item) => ({
					label: item.name,
					value: item.id,
				})),
		},
	},
	{
		field: COLUMN_MENU.KEY.CODE,
		label: COLUMN_MENU.LABEL.CODE,
		component: COMPONENT_NAME.INPUT,
	},
	{
		field: COLUMN_MENU.KEY.NAME,
		label: COLUMN_MENU.LABEL.NAME,
		component: COMPONENT_NAME.INPUT,
	},
	{
		field: COLUMN_MENU.KEY.ICON,
		label: COLUMN_MENU.LABEL.ICON,
		customRender: () => (
			<IconPicker v-model={model.icon} icons={Object.keys(flagpack.icons).map((key) => `${flagpack.prefix}:${key}`)} />
		),
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
		? await updateMenu(id, {
				...payload,
				updatedAt: currentUnix(),
			})
		: await createMenu({
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

watch([() => showDialog.value, () => model.icon], ([bool, icon]) => {
	if (icon !== "") formRef.value?.clearValidate(COLUMN_MENU.KEY.ICON);

	if (!bool) {
		isEdit.value = false;
		Object.assign(model, INITIAL_MENU);
	}
});

defineExpose<MenuExpose>({
	open: (row?: Menu) => {
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
