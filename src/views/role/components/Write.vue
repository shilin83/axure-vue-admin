<script setup lang="tsx">
import type { RoleExpose, RoleProps } from "./types";

import { INITIAL_ROLE, COLUMN_ROLE, createRole, updateRole } from "./helpers";

const { error, success } = useMessage();
const { menus, permissions } = defineProps<Omit<RoleProps, "data">>();
const showDialog = ref<boolean>(false);
const isEdit = ref<boolean>(false);
const formRef = useTemplateRef<FormExpose>("formRef");
const model = reactive<Role>(Object.assign({}, INITIAL_ROLE));

const rules: FormRules<Role> = {
	name: [required(), chinese()],
	menus: [array()],
	permissions: [array()],
};

const schema = computed<FormSchema[]>(() => [
	{
		field: COLUMN_ROLE.KEY.NAME,
		label: COLUMN_ROLE.LABEL.NAME,
		component: COMPONENT_NAME.INPUT,
	},
	{
		field: COLUMN_ROLE.KEY.MENU,
		label: COLUMN_ROLE.LABEL.MENU,
		component: COMPONENT_NAME.TREE_SELECT,
		componentProps: {
			data: menus,
			disabled: isEdit.value && model.id === 1,
		},
	},
	{
		field: COLUMN_ROLE.KEY.PERMISSION,
		label: COLUMN_ROLE.LABEL.PERMISSION,
		component: COMPONENT_NAME.TREE_SELECT,
		componentProps: {
			data: permissions,
			disabled: isEdit.value && model.id === 1,
		},
	},
	{
		field: TABLE_COLUMN.KEY.STATUS,
		label: TABLE_COLUMN.LABEL.STATUS,
		component: COMPONENT_NAME.SWITCH,
		componentProps: {
			disabled: isEdit.value,
		},
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
		? await updateRole(id, {
				...payload,
				updatedAt: currentUnix(),
			})
		: await createRole({
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
			Object.assign(model, INITIAL_ROLE);
		}
	},
);

defineExpose<RoleExpose>({
	open: (row?: Role) => {
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
