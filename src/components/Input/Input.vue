<script setup lang="ts">
import type { InputProps } from "./types";

import { useDebounceFn } from "@vueuse/core";

const { placeholder = "请输入", search } = defineProps<InputProps>();
const model = defineModel<string>();
const text = ref<string>(model.value ?? "");
const updateModel = useDebounceFn((value: string) => (model.value = value), DEBOUNCE_TIME);

/**
 * 处理输入事件：搜索模式防抖同步，普通模式即时同步
 *
 * @param value 输入内容
 *
 * @returns 无内容
 */
function handleInput(value: string): void {
	text.value = value;

	if (search) {
		updateModel(value);
	} else {
		model.value = value;
	}
}

watch(model, (value) => {
	if (value !== text.value) {
		updateModel.cancel();
		text.value = value ?? "";
	}
});

onUnmounted(() => updateModel.cancel());
</script>

<template>
	<ElInput
		:type="type"
		:size="size"
		:disabled="disabled"
		:placeholder="placeholder"
		:model-value="text"
		:show-password="showPassword"
		@blur="on?.blur"
		@focus="on?.focus"
		@update:model-value="handleInput"
		clearable
	>
		<template v-if="search" #prefix>
			<Icon icon="mdi:magnify" />
		</template>

		<template v-else-if="slots?.prefix !== undefined" #prefix>
			<component :is="slots.prefix()" />
		</template>

		<template v-if="slots?.suffix !== undefined" #suffix>
			<component :is="slots.suffix()" />
		</template>
	</ElInput>
</template>
