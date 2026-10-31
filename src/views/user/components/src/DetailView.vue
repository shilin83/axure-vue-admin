<script setup lang="ts">
import type { UserExpose, UserProps } from "./types";

import { buildDescription, COLUMN_USER } from "./helpers";

const props = defineProps<Omit<UserProps, "data" | "recycled">>();
const showDetail = ref<boolean>(false);
const currentUser = ref<User>();

defineExpose<UserExpose>({
	open: (row?: User) => {
		showDetail.value = true;
		currentUser.value = row;
	},
});
</script>

<template>
	<Dialog v-if="showDetail" v-model="showDetail" :title="BUTTON_MAP.DETAIL.LABEL">
		<div class="flex-y gap-5">
			<Description :items="buildDescription(currentUser)" />

			<div class="flex-y gap-2 rounded-lg bg-gray-50 p-4">
				<div class="flex-center-x gap-2">
					<Icon icon="mdi:account-group" />
					<span class="font-semibold">{{ COLUMN_USER.LABEL.ROLE }}</span>
					<Tag type="primary" size="small" :text="currentUser?.roles.length ?? 0" />
				</div>
				<div class="max-h-75 overflow-y-auto">
					<Tree :data="props.roles" :defaultCheckedKeys="currentUser?.roles" readonly />
				</div>
			</div>
		</div>

		<template #footer>
			<Button :label="BUTTON_MAP.CLOSE.LABEL" :icon="BUTTON_MAP.CLOSE.ICON" @handle-click="showDetail = false" />
		</template>
	</Dialog>
</template>
