<script setup lang="ts">
import type { IconPickerProps } from "./types";

const { icons, width = 20, height = 20 } = defineProps<IconPickerProps>();
const model = defineModel<string>();
const visible = ref<boolean>(false);
const search = ref<string>("");

const filteredIcons = computed<string[]>(() => {
	if (search.value === "") return icons;

	return icons.filter((name) => name.toLowerCase().includes(search.value.toLowerCase()));
});

/**
 * 选择图标
 *
 * @param icon 选中的图标
 *
 * @returns 无内容
 */
function handleSelect(icon: string): void {
	visible.value = false;
	model.value = icon;
}

/**
 * 清空搜索关键词与已选图标
 *
 * @returns 无内容
 */
function handleClear(): void {
	search.value = "";
	model.value = "";
}
</script>

<template>
	<ElPopover v-model:visible="visible" trigger="click" width="400px">
		<template #reference>
			<Button
				class="w-full"
				:label="model === '' ? '选择图标' : '更换图标'"
				:icon="model === '' ? 'mdi:flag' : model"
			/>
		</template>

		<div class="space-y-2">
			<Input v-model="search" placeholder="搜索图标..." size="small" />

			<div v-if="filteredIcons.length > 0" class="grid-(~ cols-8) max-h-60 gap-1 overflow-y-auto">
				<div
					v-for="icon in filteredIcons"
					:class="[
						'flex-center cursor-pointer rounded-md p-1 transition-colors',
						{
							'bg-blue-50 ring-2 ring-blue-400': icon === model,
							'hover:bg-gray-100': icon !== model,
						},
					]"
					:key="icon"
					:title="icon"
					@click="handleSelect(icon)"
				>
					<Icon :icon="icon" :width="width" :height="height" />
				</div>
			</div>

			<div v-else class="text-(sm neutral-400 center) py-5">未找到匹配的图标</div>

			<div class="flex-center-x border-t-(1 solid neutral-100) justify-end gap-1 pt-2">
				<Button type="primary" size="small" label="清除" @click="handleClear" text />
			</div>
		</div>
	</ElPopover>
</template>
