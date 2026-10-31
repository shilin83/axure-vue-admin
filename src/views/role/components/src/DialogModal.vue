<script setup lang="ts">
import type { RoleProps, RoleExpose } from "./types";

import { COLUMN_ROLE, INITIAL_ROLE, createRole, updateRole } from "./helpers";

const { success, error } = useMessage();
const props = defineProps<Omit<RoleProps, "recycled">>();
const showDialog = ref<boolean>(false);
const isEdit = ref<boolean>(false);
const formRef = ref<FormExpose>();
const formModel = reactive<Role>(Object.assign({}, INITIAL_ROLE));

const formRules = reactive<FormRules<Pick<Role, "name" | "menus" | "permissions">>>({
	name: [required(), chinese()],
	menus: [array()],
	permissions: [array()],
});

const formSchema = computed<FormSchema[]>(() => [
	{
		field: TABLE_COLUMN.KEY.NAME,
		label: TABLE_COLUMN.LABEL.NAME,
		component: COMPONENT_NAME.INPUT,
	},
	{
		field: COLUMN_ROLE.KEY.MENU,
		label: COLUMN_ROLE.LABEL.MENU,
		component: COMPONENT_NAME.TREE_SELECT,
		componentProps: {
			data: props.menus,
		},
	},
	{
		field: COLUMN_ROLE.KEY.PERMISSION,
		label: COLUMN_ROLE.LABEL.PERMISSION,
		component: COMPONENT_NAME.TREE_SELECT,
		componentProps: {
			data: props.permissions,
		},
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
			? await updateRole(id, {
					...payload,
					updatedAt: currentTime(),
				})
			: await createRole({
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
			Object.assign(formModel, INITIAL_ROLE);
		}
	},
);

defineExpose<RoleExpose>({
	open: (row?: Role) => {
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
