<script setup lang="tsx">
import type { LoginForm, CaptchaExpose } from "./types";

import { Animated, Captcha } from "..";
import { handleLogin } from "./helpers";

const { info, warning } = useNotification();
const { error, success } = useMessage();
const isLoading = ref<boolean>(false);
const isTyping = ref<boolean>(false);
const showPassword = ref<boolean>(false);
const captchaCode = ref<string>("");
const captchaRef = ref<CaptchaExpose>();
const formRef = ref<FormExpose>();

const formModel = reactive<LoginForm>({
	username: "",
	password: "",
	captcha: "",
	remember: false,
});

const formRules = reactive<FormRules<LoginForm>>({
	username: [required()],
	password: [required()],
	captcha: [required()],
});

const formSchema = computed<FormSchema[]>(() => [
	{
		field: "icon",
		customRender: () => <Icon icon="logos:google-workspace" width="360" height="36" />,
	},
	{
		field: "username",
		component: COMPONENT_NAME.INPUT,
		componentProps: {
			placeholder: ADMIN_USERNAME,
			prefixIcon: () => <Icon icon="mdi:account-outline" />,
			on: {
				blur: () => (isTyping.value = false),
				focus: () => (isTyping.value = true),
			},
		} as InputProps,
	},
	{
		field: "password",
		component: COMPONENT_NAME.INPUT,
		componentProps: {
			placeholder: DEFAULT_PASSWORD,
			type: showPassword.value ? "text" : "password",
			slots: {
				prefix: () => <Icon icon="mdi:lock-outline" />,
				suffix: () => (
					<span class="ml-1 cursor-pointer" onClick={() => (showPassword.value = !showPassword.value)}>
						<Icon
							icon={
								formModel.password.length > 0 ? (showPassword.value ? "mdi:eye-off-outline" : "mdi:eye-outline") : ""
							}
						/>
					</span>
				),
			},
		} as InputProps,
	},
	{
		field: "captcha",
		customRender: () => (
			<div class="flex-center-x w-full gap-2">
				<Input v-model={formModel.captcha} prefix-icon={() => <Icon icon="mdi:shield-key-outline" />} />
				<Captcha ref={captchaRef} onHandleChange={(code) => (captchaCode.value = code)} />
			</div>
		),
	},
	{
		field: "remember",
		customRender: () => (
			<div class="flex-center-x w-full justify-between">
				<Checkbox v-model={formModel.remember} label="记住我" />
				<Tooltip content="请联系管理员" placement="left">
					<Link type="primary" underline="never" label="忘记密码" />
				</Tooltip>
			</div>
		),
	},
	{
		field: "submit",
		customRender: () => (
			<Button class="w-full" type="primary" label="登 录" loading={isLoading.value} onHandleClick={handleSubmit} />
		),
	},
	{
		field: "reset",
		customRender: () => (
			<Button class="w-full" label="重置数据" loading={isLoading.value} onHandleClick={handleReset} />
		),
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
			resetDexie().then(() => {
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

		const { username, password, captcha, remember } = formModel;
		if (captcha.toLowerCase() !== captchaCode.value.toLowerCase()) {
			error("验证码错误！");
			return;
		}

		const { code, data, message } = await handleLogin(username, password, remember);
		if (code === HTTP_CODE.UNAUTHORIZED) {
			formRef.value.resetFields();
			error(message);
			return;
		}
		success(message);

		useTimeoutFn(() => {
			setAuth(data);
			redirectPage(ROUTE_KEY.HOME);
		}, DELAY_TIME);
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
	} else if (auth.remember) redirectPage(ROUTE_KEY.HOME);
});
</script>

<template>
	<div class="full-screen bg-gray flex overflow-hidden">
		<div class="flex-center lt-lg:hidden w-1/2">
			<Animated :is-typing="isTyping" :show-password="showPassword" :password-length="formModel.password.length" />
		</div>

		<div class="flex-(1 center) lg:bg-white">
			<div class="flex-y w-100 rounded-lg bg-white p-5">
				<Form ref="formRef" size="large" :schema="formSchema" :model="formModel" :rules="formRules" />
			</div>
		</div>
	</div>
</template>
