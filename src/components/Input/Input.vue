<script setup lang="ts">
import type { InputProps } from "./types";

const props = defineProps<InputProps>();
const model = defineModel<string>();
</script>

<template>
	<ElInput
		v-model="model"
		:type="props.type"
		:disabled="props.disabled"
		:placeholder="props.placeholder ?? '请输入'"
		:prefix-icon="props.prefixIcon"
		:show-word-limit="props.showWordLimit"
		:maxlength="props.maxlength"
		@blur="props.on?.blur"
		@focus="props.on?.focus"
		clearable
	>
		<template v-if="props.slots?.prefix" #prefix>
			<component :is="props.slots.prefix" />
		</template>
		<template v-if="props.slots?.suffix" #suffix>
			<component :is="props.slots.suffix" />
		</template>
		<template v-if="props.slots?.prepend" #prepend>
			<component :is="props.slots.prepend" />
		</template>
		<template v-if="props.slots?.append" #append>
			<component :is="props.slots.append" />
		</template>
	</ElInput>
</template>
