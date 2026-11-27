<script setup lang="tsx">
import type { RoleProps, RoleExpose } from "./types";

import { COLUMN_ROLE } from "./helpers";

const props = defineProps<Omit<RoleProps, "data">>();
const showDetail = ref<boolean>(false);
const currentRole = ref<Role>();

const schema: DescriptionSchema[] = [
	{
		field: COLUMN_ROLE.KEY.NAME,
		label: COLUMN_ROLE.LABEL.NAME,
	},
	{
		field: TABLE_COLUMN.KEY.STATUS,
		label: TABLE_COLUMN.LABEL.STATUS,
		formatter: (_, value) => (
			<ElText type={value ? "success" : "danger"}>{value ? STATUS_TEXT[0] : STATUS_TEXT[1]}</ElText>
		),
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
	<Dialog v-model="showDetail" :title="BUTTON_TEXT.DETAIL">
		<div class="flex-y gap-5">
			<Description :schema="schema" :data="currentRole" />

			<div class="grid-(~ cols-2) gap-5">
				<div class="flex-y gap-2 rounded-lg bg-gray-50 p-5" v-for="(item, index) in props" :key="index">
					<div class="flex-center-x gap-2">
						<Icon :icon="index === COLUMN_ROLE.KEY.MENU ? 'mdi:menu' : 'mdi:shield-lock-outline'" />
						<span class="font-semibold">
							{{ index === COLUMN_ROLE.KEY.MENU ? COLUMN_ROLE.LABEL.MENU : COLUMN_ROLE.LABEL.PERMISSION }}
						</span>
						<ElTag size="small" type="primary">
							{{
								index === COLUMN_ROLE.KEY.MENU
									? (currentRole?.menus.length ?? 0)
									: (currentRole?.permissions.length ?? 0)
							}}
						</ElTag>
					</div>
					<div class="max-h-100 overflow-y-auto">
						<Tree
							:data="item"
							:default-checked-keys="index === COLUMN_ROLE.KEY.MENU ? currentRole?.menus : currentRole?.permissions"
							readonly
						/>
					</div>
				</div>
			</div>
		</div>

		<template #footer>
			<Button :label="BUTTON_TEXT.CLOSE" @click="showDetail = false" />
		</template>
	</Dialog>
</template>
