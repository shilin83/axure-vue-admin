<script setup lang="ts">
import type { DescriptionProps } from "./types";

const { column = 2 } = defineProps<DescriptionProps>();
</script>

<template>
	<ElDescriptions :column="column" border>
		<ElDescriptionsItem v-for="item in schema" :key="item.field" :label="item.label" :span="item.span">
			<component v-if="item.formatter !== undefined" :is="() => item.formatter?.(data, data[item.field])" />

			<template v-else-if="item.field === TABLE_COLUMN.KEY.CREATED_AT || item.field === TABLE_COLUMN.KEY.UPDATED_AT">
				{{ data[item.field] !== undefined ? formatUnix(data[item.field]) : "" }}
			</template>

			<template v-else>{{ data[item.field] ?? "" }}</template>
		</ElDescriptionsItem>
	</ElDescriptions>
</template>
