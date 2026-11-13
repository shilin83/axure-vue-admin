<script setup lang="ts">
import type { DescriptionProps } from "./types";

const { schema, data, column = 2 } = defineProps<DescriptionProps>();
</script>

<template>
	<ElDescriptions :column="column" border>
		<ElDescriptionsItem v-for="item in schema" :key="item.field" :label="item.label" :span="item.span">
			{{ item.formatter?.(data, data[item.field]) ?? data[item.field] ?? "-" }}
		</ElDescriptionsItem>
	</ElDescriptions>
</template>
