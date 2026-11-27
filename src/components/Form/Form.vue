<script setup lang="ts">
import type { FormProps, FormExpose } from "./types";
import type { FormInstance } from "element-plus";

const { labelWidth = "auto" } = defineProps<FormProps>();
const formRef = useTemplateRef<FormInstance>("formRef");

defineExpose<FormExpose>({
	validate: async () => (await formRef.value?.validate()) ?? false,
	resetFields: (props?: Optional<Arrayable<string>>) => formRef.value?.resetFields(props),
	clearValidate: (props?: Optional<Arrayable<string>>) => formRef.value?.clearValidate(props),
});
</script>

<template>
	<ElForm ref="formRef" :model="model" :rules="rules" :size="size" :label-width="labelWidth">
		<ElRow v-bind="rowProps">
			<ElCol v-for="item in schema" v-bind="item.colProps" :key="item.field">
				<ElFormItem :prop="item.field" :label="item.label">
					<component v-if="item.customRender !== undefined" :is="item.customRender()" />
					<component v-else :is="item.component" v-bind="item.componentProps" v-model="model[item.field]" />
				</ElFormItem>
			</ElCol>
		</ElRow>
	</ElForm>
</template>
