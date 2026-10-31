<script setup lang="ts">
import type { DescriptionProps } from "./types";

const props = defineProps<DescriptionProps>();
</script>

<template>
	<ElDescriptions :column="props.column ?? 2" border>
		<ElDescriptionsItem v-for="item in props.items" :key="item.label" :label="item.label" :span="item.span">
			{{ item.value }}
		</ElDescriptionsItem>
	</ElDescriptions>
</template>
