<script setup lang="ts">
import type { RoleExpose, RoleProps } from "./types";

import { COLUMN_ROLE, INITIAL_ROLE, createRole, updateRole } from "./helpers";

const { error, success } = useMessage();
const { menus, permissions } = defineProps<Omit<RoleProps, "data">>();
const showDialog = ref<boolean>(false);
const isEdit = ref<boolean>(false);
const formRef = ref<FormExpose>();
const model = reactive<Role>(Object.assign({}, INITIAL_ROLE));

const rules: FormRules<Role> = {
	name: [required(), chinese()],
	menus: [array()],
	permissions: [array()],
};

const schema = computed<FormSchema[]>(() => [
	{
		field: TABLE_COLUMN.KEY.NAME,
		label: TABLE_COLUMN.LABEL.NAME,
		component: Input,
	},
	{
		field: COLUMN_ROLE.KEY.MENU,
		label: COLUMN_ROLE.LABEL.MENU,
		component: TreeSelect,
		componentProps: {
			data: menus,
		},
	},
	{
		field: COLUMN_ROLE.KEY.PERMISSION,
		label: COLUMN_ROLE.LABEL.PERMISSION,
		component: TreeSelect,
		componentProps: {
			data: permissions,
		},
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
		? await updateRole(id, {
				...payload,
				updatedAt: currentTime(),
			})
		: await createRole({
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
	<Dialog v-if="showDialog" v-model="showDialog" :title="isEdit ? BUTTON_MAP.EDIT.LABEL : BUTTON_MAP.ADD.LABEL">
		<Form ref="formRef" :schema="schema" :model="model" :rules="rules" />

		<template #footer>
			<Button :label="BUTTON_MAP.CANCEL.LABEL" :icon="BUTTON_MAP.CANCEL.ICON" @click="showDialog = false" />
			<Button type="primary" :label="BUTTON_MAP.CONFIRM.LABEL" :icon="BUTTON_MAP.CONFIRM.ICON" @click="handleSubmit" />
		</template>
	</Dialog>
</template>
