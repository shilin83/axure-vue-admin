<script setup lang="ts">
import type { IconPickerProps } from "./types";

const props = defineProps<IconPickerProps>();
const model = defineModel<string>();
const search = ref<string>("");
const visible = ref<boolean>(false);

const filteredIcons = computed<string[]>(() => {
	if (search.value === "") return props.icons;

	return props.icons.filter((name) => name.toLowerCase().includes(search.value.toLowerCase()));
});

/**
 * 选择图标并关闭弹层，将选中值写入 v-model
 *
 * @param icon 选中的图标标识
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
	<Popover v-model="visible">
		<template #reference>
			<Button
				class="w-full"
				:label="model === '' ? '选择图标' : '更换图标'"
				:icon="model === '' ? 'mdi:flag' : model"
			/>
		</template>

		<div class="space-y-1">
			<Input v-model="search" placeholder="搜索图标..." size="small" />
			<div v-if="filteredIcons.length > 0" class="grid-(~ cols-8) max-h-60 gap-1 overflow-y-auto">
				<div
					v-for="icon in filteredIcons"
					:key="icon"
					class="flex-center cursor-pointer rounded-md p-1 transition-colors"
					:class="{
						'bg-blue-50 ring-2 ring-blue-400': icon === model,
						'hover:bg-gray-100': icon !== model,
					}"
					:title="icon"
					@click="handleSelect(icon)"
				>
					<Icon :icon="icon" width="20" height="20" />
				</div>
			</div>
			<div v-else class="text-(sm neutral-400 center) py-4">未找到匹配的图标</div>
			<div class="flex-center-x border-t-(1 solid neutral-100) justify-end gap-1 pt-2">
				<Button type="primary" size="small" label="清除" @handle-click="handleClear" text />
			</div>
		</div>
	</Popover>
</template>
