<script setup lang="ts">
import type { BreadcrumbItem, ChangePassword, LayoutProps } from "./types";

import { zhCn } from "element-plus/es/locales";
import { intersectionBy, isPlainObject } from "es-toolkit";

import { changePassword, confirmLogout, handleLogout } from "./helpers";

const { error, success } = useNotification();
const props = defineProps<LayoutProps>();
const auth = getAuth();
const key = ref<number>(0);
const showDialog = ref<boolean>(false);
const showPassword = ref<boolean>(false);
const formRef = ref<FormExpose>();

const menuList = useObservable<Menu[], []>(
	from(liveQuery(async () => (await menuTable.toArray()).filter((item) => item.deletedAt === undefined))),
	{
		initialValue: [],
	},
);

const allowMenus = computed<Menu[]>(() =>
	auth.roles.includes(1)
		? menuList.value
		: intersectionBy(menuList.value, auth.menus, (item) => (isPlainObject(item) ? item.id : item)),
);

const breadcrumbList = computed<BreadcrumbItem[]>(() => {
	const result: BreadcrumbItem[] = [];

	let matched = menuList.value.find((item) => item.code === props.active);
	while (matched !== undefined) {
		result.push({
			name: matched.name,
		});

		if (matched.parentId === 0) break;

		matched = menuList.value.find((item) => item.id === matched?.parentId);
	}

	return result.reverse();
});

const formModel = reactive<ChangePassword>({
	newPassword: "",
	confirmPassword: "",
});

const formRules = reactive<FormRules<ChangePassword>>({
	newPassword: [
		required(),
		{
			validator: (_: any, value: string, callback: (error?: Error | string) => void) => {
				if (value.length < 6) {
					callback(new Error("密码长度不能小于6位！"));
				} else {
					callback();
				}
			},
		},
	],
	confirmPassword: [
		required(),
		{
			validator: (_: any, value: string, callback: (error?: Error | string) => void) => {
				if (value !== formModel.newPassword) {
					callback(new Error("两次输入的密码不一致！"));
				} else {
					callback();
				}
			},
		},
	],
});

const formSchema = computed<FormSchema[]>(() => [
	{
		field: "newPassword",
		label: "新密码",
		component: COMPONENT_NAME.INPUT,
		componentProps: {
			type: showPassword.value ? "text" : "password",
			showPassword: true,
		},
	},
	{
		field: "confirmPassword",
		label: "确认密码",
		component: COMPONENT_NAME.INPUT,
		componentProps: {
			type: showPassword.value ? "text" : "password",
			showPassword: true,
		},
	},
]);

/**
 * 侧边菜单选中项变更处理，非当前菜单时跳转至目标页面
 *
 * @param index 选中的菜单标识
 *
 * @returns 无内容
 */
function handleSelect(index: string): void {
	if (index !== props.active) {
		key.value++;
		redirectPage(index as RouteKey);
	}
}

/**
 * 提交修改密码表单，校验通过后调用接口更新密码
 *
 * @returns 无内容
 */
async function handleSubmit(): Promise<void> {
	if (formRef.value === undefined) return;
	if (!(await formRef.value.validate())) return;

	try {
		const { code, message } = await changePassword(auth.id, formModel.confirmPassword);
		if (code === HTTP_CODE.NO_CONTENT) {
			useTimeoutFn(() => handleLogout(), DELAY_TIME);
			success(message);
		} else {
			error(message);
		}
	} finally {
		showDialog.value = false;
	}
}

watch(
	() => showDialog.value,
	(bool) => {
		if (!bool) formRef.value?.resetFields();
	},
);

onBeforeMount(async () => {
	if (auth === null) {
		useTimeoutFn(() => handleLogout(), DELAY_TIME);
		error("会话已过期，请重新登录！");
	}
});
</script>

<template>
	<div class="full-screen flex overflow-hidden">
		<aside class="border-r-(1 solid neutral-200) w-50">
			<div class="flex-center h-10">
				<Icon icon="logos:google-workspace" width="160" height="36" />
			</div>
			<ElScrollbar height="calc(100vh - 40px)">
				<ElMenu style="border-right: 0" :key="key" :default-active="props.active" @select="handleSelect" unique-opened>
					<template v-for="item in buildTree<Menu>(allowMenus)">
						<ElSubMenu v-if="item.children !== undefined && item.children.length > 0" :index="item.code">
							<template #title>
								<Icon :icon="item.icon" />
								<span class="ml-2">{{ item.name }}</span>
							</template>
							<template v-for="child in item.children">
								<ElMenuItem :index="child.code">
									<Icon :icon="child.icon" />
									<span class="ml-2">{{ child.name }}</span>
								</ElMenuItem>
							</template>
						</ElSubMenu>
						<ElMenuItem v-else :index="item.code">
							<Icon :icon="item.icon" />
							<span class="ml-2">{{ item.name }}</span>
						</ElMenuItem>
					</template>
				</ElMenu>
			</ElScrollbar>
		</aside>

		<div class="flex-(1 y) min-w-0">
			<header class="flex-center-x border-b-(1 solid neutral-200) h-10 justify-between px-2">
				<ElBreadcrumb separator="/">
					<template v-for="(item, index) in breadcrumbList" :key="index">
						<ElBreadcrumbItem>{{ item.name }}</ElBreadcrumbItem>
					</template>
				</ElBreadcrumb>
				<ElDropdown class="h-full cursor-pointer">
					<div class="flex-center-x gap-1">
						<Icon class="h-5 w-5" :icon="auth.avatar" />
						<span class="text-(sm neutral-600)">{{ auth.name }}</span>
					</div>
					<template #dropdown>
						<ElDropdownMenu>
							<ElDropdownItem @click="showDialog = true">修改密码</ElDropdownItem>
							<ElDropdownItem @click="confirmLogout">退出系统</ElDropdownItem>
						</ElDropdownMenu>
					</template>
				</ElDropdown>
			</header>

			<main class="flex-1 bg-neutral-100">
				<ElScrollbar height="calc(100vh - 80px)">
					<ElConfigProvider :locale="zhCn">
						<slot />
					</ElConfigProvider>
				</ElScrollbar>
			</main>

			<footer class="flex-center text-(sm neutral-600) border-t-(1 solid neutral-200) h-10">
				<span>Copyright MIT © 2026 Axure</span>
			</footer>
		</div>
	</div>

	<Dialog v-if="showDialog" v-model="showDialog" title="修改密码">
		<Form ref="formRef" :schema="formSchema" :model="formModel" :rules="formRules" />

		<template #footer>
			<Button :label="BUTTON_MAP.CANCEL.LABEL" :icon="BUTTON_MAP.CANCEL.ICON" @handle-click="showDialog = false" />
			<Button
				type="primary"
				:label="BUTTON_MAP.CONFIRM.LABEL"
				:icon="BUTTON_MAP.CONFIRM.ICON"
				@handle-click="handleSubmit"
			/>
		</template>
	</Dialog>
</template>

<style scoped>
.el-breadcrumb__item {
	font-weight: 500;
}

:deep(.el-breadcrumb__item + .el-breadcrumb__item .el-breadcrumb__inner) {
	font-weight: 300;
}
</style>
