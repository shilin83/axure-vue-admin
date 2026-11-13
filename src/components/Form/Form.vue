<script setup lang="ts">
import type { FormProps } from "./types";
import type { FormInstance } from "element-plus";

const { schema, model } = defineProps<FormProps>();
const formRef = useTemplateRef<FormInstance>("formRef");

defineExpose<FormExpose>({
	validate: async () => (await formRef.value?.validate()) ?? false,
	resetFields: (props?: Optional<Arrayable<string>>) => formRef.value?.resetFields(props),
	clearValidate: (props?: Optional<Arrayable<string>>) => formRef.value?.clearValidate(props),
});
</script>

<template>
	<ElForm ref="formRef" label-width="auto" :model="model">
		<ElFormItem v-for="item in schema" :key="item.field" :prop="item.field" :label="item.label">
			<component v-if="item.customRender !== undefined" :is="item.customRender()" />
			<component v-else :is="item.component" v-bind="item.componentProps" v-model="model[item.field]" />
		</ElFormItem>
	</ElForm>
</template>
