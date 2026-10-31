<script setup lang="ts">
import type { RoleProps, RoleExpose } from "./types";

import { buildDescription, COLUMN_ROLE } from "./helpers";

const props = defineProps<Omit<RoleProps, "data" | "recycled">>();
const showDetail = ref<boolean>(false);
const currentRole = ref<Role>();

defineExpose<RoleExpose>({
	open: (row?: Role) => {
		showDetail.value = true;
		currentRole.value = row;
	},
});
</script>

<template>
	<Dialog v-if="showDetail" v-model="showDetail" :title="BUTTON_MAP.DETAIL.LABEL">
		<div class="flex-y gap-5">
			<Description :items="buildDescription(currentRole)" />

			<div class="grid-(~ cols-2) gap-5">
				<div class="flex-y gap-2 rounded-lg bg-gray-50 p-5">
					<div class="flex-center-x gap-2">
						<Icon icon="mdi:menu" />
						<span class="font-semibold">{{ COLUMN_ROLE.LABEL.MENU }}</span>
						<Tag type="primary" size="small" :text="currentRole?.menus.length ?? 0" />
					</div>
					<div class="max-h-75 overflow-y-auto">
						<Tree :data="props.menus" :default-checked-keys="currentRole?.menus" readonly />
					</div>
				</div>

				<div class="flex-y gap-2 rounded-lg bg-gray-50 p-5">
					<div class="flex-center-x gap-2">
						<Icon icon="mdi:shield-lock-outline" />
						<span class="font-semibold">{{ COLUMN_ROLE.LABEL.PERMISSION }}</span>
						<Tag type="primary" size="small" :text="currentRole?.permissions.length ?? 0" />
					</div>
					<div class="max-h-75 overflow-y-auto">
						<Tree :data="props.permissions" :default-checked-keys="currentRole?.permissions" readonly />
					</div>
				</div>
			</div>
		</div>

		<template #footer>
			<Button :label="BUTTON_MAP.CLOSE.LABEL" :icon="BUTTON_MAP.CLOSE.ICON" @handle-click="showDetail = false" />
		</template>
	</Dialog>
</template>
