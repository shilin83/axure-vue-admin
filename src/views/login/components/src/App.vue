<script setup lang="ts">
import type { LoginForm, CaptchaExpose } from "./types";

import { useTimeoutFn } from "@vueuse/core";

import { Animated, Captcha } from "..";
import { handleLogin } from "./helpers";

const { error, success } = useMessage();
const { info, warning } = useNotification();
const isLoading = ref<boolean>(false);
const isTyping = ref<boolean>(false);
const showPassword = ref<boolean>(false);
const captchaCode = ref<string>("");
const captchaRef = ref<CaptchaExpose>();
const formRef = ref<FormExpose>();

const model = reactive<LoginForm>({
	account: "",
	password: "",
	captcha: "",
	remember: false,
});

const rules: FormRules<LoginForm> = {
	account: [required()],
	password: [required()],
	captcha: [required()],
};

const schema = computed<FormSchema[]>(() => [
	{
		field: "icon",
		customRender: () =>
			h(Icon, {
				icon: "logos:google-workspace",
				width: 360,
				height: 36,
			}),
	},
	{
		field: "account",
		component: Input,
		componentProps: {
			placeholder: ADMIN_USERNAME,
			prefixIcon: h(Icon, {
				icon: "mdi:account-outline",
			}),
			onBlur: () => (isTyping.value = false),
			onFocus: () => (isTyping.value = true),
		},
	},
	{
		field: "password",
		component: Input,
		componentProps: {
			placeholder: DEFAULT_PASSWORD,
			type: showPassword.value ? "text" : "password",
			slots: {
				prefix: h(Icon, {
					icon: "mdi:lock-outline",
				}),
				suffix: h(Icon, {
					class: "ml-1 cursor-pointer",
					icon: model.password.length > 0 ? (showPassword.value ? "mdi:eye-outline" : "mdi:eye-off-outline") : "",
					onClick: () => (showPassword.value = !showPassword.value),
				}),
			},
		},
	},
	{
		field: "captcha",
		customRender: () =>
			h(
				"div",
				{
					class: "w-full flex-center-x gap-2",
				},
				[
					h(Input, {
						modelValue: model.captcha,
						"onUpdate:modelValue": (value) => (model.captcha = value as string),
						prefixIcon: h(Icon, {
							icon: "mdi:shield-key-outline",
						}),
					}),
					h(Captcha, {
						ref: captchaRef,
						onHandleChange: (code) => (captchaCode.value = code),
					}),
				],
			),
	},
	{
		field: "remember",
		customRender: () =>
			h(
				"div",
				{
					class: "w-full flex-center-x justify-between",
				},
				[
					h(ElCheckbox, {
						modelValue: model.remember,
						"onUpdate:modelValue": (value) => (model.remember = value as boolean),
						label: "记住我",
					}),
					h(
						ElTooltip,
						{
							content: "请联系管理员",
							placement: "left",
						},
						() =>
							h(
								ElLink,
								{
									type: "primary",
									underline: "never",
								},
								() => "忘记密码",
							),
					),
				],
			),
	},
	{
		field: "submit",
		customRender: () =>
			h(Button, {
				class: "w-full",
				type: "primary",
				label: "登 录",
				loading: isLoading.value,
				onClick: handleSubmit,
			}),
	},
	{
		field: "reset",
		customRender: () =>
			h(Button, {
				class: "w-full",
				label: "重置数据",
				loading: isLoading.value,
				onClick: handleReset,
			}),
	},
]);

/**
 * 重置数据
 *
 * @returns 无内容
 */
function handleReset(): void {
	isLoading.value = true;
	info("数据已重置！");

	useTimeoutFn(
		() =>
			deleteDexie().then(() => {
				removeAuth();
				isLoading.value = false;
				window.location.reload();
			}),
		DELAY_TIME,
	);
}

/**
 * 提交登录
 *
 * @returns 无内容
 */
async function handleSubmit(): Promise<void> {
	if (formRef.value === undefined) return;
	if (!(await formRef.value.validate())) return;

	try {
		isLoading.value = true;

		const { account, password, captcha, remember } = model;
		if (captcha.toLowerCase() !== captchaCode.value.toLowerCase()) {
			error("验证码错误！");
			return;
		}

		const { code, data, message } = await handleLogin(account, password, remember);
		if (code === HTTP_CODE.UNAUTHORIZED) {
			error(message);
			return;
		}

		useTimeoutFn(() => {
			setAuth(data);
			redirectPage(MENU_KEY.HOME);
		}, DELAY_TIME);
		success(message);
	} finally {
		useTimeoutFn(() => {
			isLoading.value = false;
			captchaRef.value?.refresh();
			formRef.value?.resetFields();
		}, DELAY_TIME);
	}
}

onBeforeMount(async () => {
	const auth = getAuth();
	if (auth === null) {
		try {
			await initDexie();
		} catch (e) {
			if (e instanceof Error) warning(`${e.message}，请重置数据！`);
		}
	} else if (auth.remember) redirectPage(MENU_KEY.HOME);
});
</script>

<template>
	<div class="full-screen bg-gray flex overflow-hidden">
		<div class="flex-center lt-lg:hidden w-1/2">
			<Animated :is-typing="isTyping" :show-password="showPassword" :password-length="model.password.length" />
		</div>

		<div class="flex-(1 center) lg:bg-white">
			<div class="flex-y w-100 rounded-lg bg-white p-5">
				<Form ref="formRef" size="large" :schema="schema" :model="model" :rules="rules" />
			</div>
		</div>
	</div>
</template>
