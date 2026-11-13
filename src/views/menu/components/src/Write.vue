<script setup lang="ts">
import type { MenuExpose, MenuProps } from "./types";

import flagpack from "@iconify/json/json/flagpack.json";

import { COLUMN_MENU, INITIAL_MENU, createMenu, updateMenu } from "./helpers";

const { error, success } = useMessage();
const { data } = defineProps<MenuProps>();
const showDialog = ref<boolean>(false);
const isEdit = ref<boolean>(false);
const formRef = ref<FormExpose>();
const model = reactive<Menu>(Object.assign({}, INITIAL_MENU));

const rules: FormRules<Omit<Menu, "children">> = {
	code: [required(), alphanumeric()],
	name: [required(), chinese()],
	icon: [required()],
};

const schema = computed<FormSchema[]>(() => [
	{
		field: "parentId",
		label: "父菜单",
		component: Select,
		componentProps: {
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
	},
	{
		field: TABLE_COLUMN.KEY.NAME,
		label: TABLE_COLUMN.LABEL.NAME,
		component: Input,
	},
	{
		field: COLUMN_MENU.KEY.ICON,
		label: COLUMN_MENU.LABEL.ICON,
		customRender: () =>
			h(IconPicker, {
				icons: Object.keys(flagpack.icons).map((key) => `${flagpack.prefix}:${key}`),
				modelValue: model.icon,
				"onUpdate:modelValue": (icon) => {
					model.icon = icon as string;
					if (model.icon !== "") formRef.value?.clearValidate(COLUMN_MENU.KEY.ICON);
				},
			}),
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
		? await updateMenu(id, {
				...payload,
				updatedAt: currentTime(),
			})
		: await createMenu({
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
			Object.assign(model, INITIAL_MENU);
		}
	},
);

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
	<Dialog v-if="showDialog" v-model="showDialog" :title="isEdit ? BUTTON_MAP.EDIT.LABEL : BUTTON_MAP.ADD.LABEL">
		<Form ref="formRef" :schema="schema" :model="model" :rules="rules" />

		<template #footer>
			<Button :label="BUTTON_MAP.CANCEL.LABEL" :icon="BUTTON_MAP.CANCEL.ICON" @click="showDialog = false" />
			<Button type="primary" :label="BUTTON_MAP.CONFIRM.LABEL" :icon="BUTTON_MAP.CONFIRM.ICON" @click="handleSubmit" />
		</template>
	</Dialog>
</template>
