<script setup lang="ts">
import type { DialogProps } from "./types";

const props = defineProps<DialogProps>();
const model = defineModel<boolean>();
const dialogHeight = ref<string>(props.height ?? "");
const isFullscreen = ref<boolean>(false);

watch(
	[() => isFullscreen.value, () => props.height],
	async ([full, height]) => {
		await nextTick();

		if (full) dialogHeight.value = `${document.documentElement.offsetHeight - 120}px`;
		else dialogHeight.value = height ?? "";
	},
	{
		immediate: true,
	},
);
</script>

<template>
	<ElDialog
		v-model="model"
		:width="props.width ?? 500"
		:fullscreen="isFullscreen"
		:show-close="false"
		draggable
		align-center
		destroy-on-close
	>
		<template #header>
			<div class="flex-center-x justify-between">
				<span>{{ props.title }}</span>
				<div class="flex-center-x gap-1">
					<Icon
						class="cursor-pointer"
						:icon="isFullscreen ? 'mdi:fullscreen-exit' : 'mdi:fullscreen'"
						@click="isFullscreen = !isFullscreen"
					/>
					<Icon class="cursor-pointer" icon="mdi:close" @click="model = false" />
				</div>
			</div>
		</template>

		<ElScrollbar :height="dialogHeight">
			<slot />
		</ElScrollbar>

		<template #footer>
			<slot name="footer" />
		</template>
	</ElDialog>
</template>
