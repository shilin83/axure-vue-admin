<script setup lang="ts">
import type { DialogProps, DialogEmits } from "./types";

const { title = "Dialog", width = "500px", height = "" } = defineProps<DialogProps>();
const emit = defineEmits<DialogEmits>();
const model = defineModel<boolean>();
const dialogHeight = ref<string>(height);
const fullscreen = ref<boolean>(false);

watch(
	[() => fullscreen.value, () => height],
	async ([full, height]) => {
		await nextTick();

		if (full) {
			dialogHeight.value = `${document.documentElement.offsetHeight - 120}px`;
		} else {
			dialogHeight.value = height;
		}
	},
	{
		immediate: true,
	},
);
</script>

<template>
	<ElDialog
		v-model="model"
		:fullscreen="fullscreen"
		:width="width"
		:show-close="false"
		draggable
		align-center
		destroy-on-close
	>
		<template #header>
			<div class="flex-center-x justify-between">
				<span>{{ title }}</span>
				<div class="flex-center-x gap-1">
					<Icon
						class="cursor-pointer"
						:icon="fullscreen ? 'mdi:fullscreen-exit' : 'mdi:fullscreen'"
						@click="fullscreen = !fullscreen"
					/>
					<Icon class="cursor-pointer" icon="mdi:close" @click="model = false" />
				</div>
			</div>
		</template>

		<ElScrollbar :height="dialogHeight">
			<slot />
		</ElScrollbar>

		<template #footer>
			<slot name="footer">
				<Button label="取消" @click="model = false" />
				<Button type="primary" label="确认" @click="emit('submit')" />
			</slot>
		</template>
	</ElDialog>
</template>
