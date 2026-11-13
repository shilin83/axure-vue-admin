<script setup lang="ts">
import type { RoleExpose, RoleProps } from "./types";

import { COLUMN_ROLE } from "./helpers";

const { menus, permissions } = defineProps<Omit<RoleProps, "data">>();
const showDetail = ref<boolean>(false);
const currentRole = ref<Role>();

const schema: DescriptionSchema[] = [
	{
		field: TABLE_COLUMN.KEY.NAME,
		label: TABLE_COLUMN.LABEL.NAME,
	},
	{
		field: TABLE_COLUMN.KEY.STATUS,
		label: TABLE_COLUMN.LABEL.STATUS,
		formatter: (_data, value) => (value ? STATUS_TEXT.ENABLED : STATUS_TEXT.DISABLED),
	},
	{
		field: TABLE_COLUMN.KEY.CREATED_AT,
		label: TABLE_COLUMN.LABEL.CREATED_AT,
		span: 2,
	},
	{
		field: TABLE_COLUMN.KEY.UPDATED_AT,
		label: TABLE_COLUMN.LABEL.UPDATED_AT,
		span: 2,
	},
];

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
			<Description :schema="schema" :data="currentRole" />

			<div class="grid grid-cols-2 gap-5">
				<div class="flex-y gap-2 rounded-lg bg-gray-50 p-4">
					<div class="flex-center-x gap-2">
						<Icon icon="mdi:menu" />
						<span class="font-semibold">{{ COLUMN_ROLE.LABEL.MENU }}</span>
						<ElTag size="small" type="primary">{{ currentRole?.menus.length ?? 0 }}</ElTag>
					</div>
					<div class="max-h-72 overflow-y-auto">
						<Tree :data="menus" :default-checked-keys="currentRole?.menus" readonly />
					</div>
				</div>

				<div class="flex-y gap-2 rounded-lg bg-gray-50 p-4">
					<div class="flex-center-x gap-2">
						<Icon icon="mdi:shield-lock-outline" />
						<span class="font-semibold">{{ COLUMN_ROLE.LABEL.PERMISSION }}</span>
						<ElTag size="small" type="primary">{{ currentRole?.permissions.length ?? 0 }}</ElTag>
					</div>
					<div class="max-h-72 overflow-y-auto">
						<Tree :data="permissions" :default-checked-keys="currentRole?.permissions" readonly />
					</div>
				</div>
			</div>
		</div>

		<template #footer>
			<Button :label="BUTTON_MAP.CLOSE.LABEL" :icon="BUTTON_MAP.CLOSE.ICON" @click="showDetail = false" />
		</template>
	</Dialog>
</template>
