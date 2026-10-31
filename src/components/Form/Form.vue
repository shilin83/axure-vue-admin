<script setup lang="ts">
import type { FormExpose, FormProps } from "./types";
import type { FormInstance } from "element-plus";

const props = defineProps<FormProps>();
const formRef = useTemplateRef<FormInstance>("formRef");

defineExpose<FormExpose>({
	validate: async () => (await formRef.value?.validate()) ?? false,
	resetFields: (props?: Optional<string | string[]>) => formRef.value?.resetFields(props),
	clearValidate: (props?: Optional<string | string[]>) => formRef.value?.clearValidate(props),
});
</script>

<template>
	<ElForm ref="formRef" label-width="auto" :model="props.model" :rules="props.rules" :size="props.size">
		<ElFormItem v-for="item in props.schema" :key="item.field" :prop="item.field" :label="item.label">
			<component v-if="item.customRender !== undefined" :is="item.customRender()" />
			<component v-else :is="item.component" v-bind="item.componentProps" v-model="props.model[item.field]" />
		</ElFormItem>
	</ElForm>
</template>
