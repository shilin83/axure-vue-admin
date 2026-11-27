import "virtual:uno.css";

import type { CaptchaExpose } from "./components/types";

import { useTimeoutFn } from "@vueuse/core";
import { flatMap, intersectionWith, uniq } from "es-toolkit/array";

import Animated from "./components/Animated.vue";
import Captcha from "./components/Captcha.vue";

interface LoginForm {
	account: string;
	password: string;
	captcha: string;
	remember: boolean;
}

const App = defineComponent(
	() => {
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
				customRender: () => <Icon icon="logos:google-workspace" width="360" height="36" />,
			},
			{
				field: "account",
				component: COMPONENT_NAME.INPUT,
				componentProps: {
					placeholder: DEFAULT_USER.ACCOUNT,
					on: {
						blur: () => (isTyping.value = false),
						focus: () => (isTyping.value = true),
					},
					slots: {
						prefix: () => <Icon icon="mdi:account-outline" />,
					},
				},
			},
			{
				field: "password",
				component: COMPONENT_NAME.INPUT,
				componentProps: {
					placeholder: DEFAULT_USER.PASSWORD,
					type: showPassword.value ? "text" : "password",
					slots: {
						prefix: () => <Icon icon="mdi:lock-outline" />,
						suffix: () => (
							<Icon
								class="ml-1 cursor-pointer"
								icon={model.password.length > 0 ? (showPassword.value ? "mdi:eye-outline" : "mdi:eye-off-outline") : ""}
								onClick={() => (showPassword.value = !showPassword.value)}
							/>
						),
					},
				},
			},
			{
				field: "captcha",
				customRender: () => (
					<div class="flex-center-x w-full justify-between gap-1">
						<Input
							v-model={model.captcha}
							slots={{
								prefix: () => <Icon icon="mdi:shield-check-outline" />,
							}}
						/>
						<Captcha ref={captchaRef} onChange={(code) => (captchaCode.value = code)} />
					</div>
				),
			},
			{
				field: "remember",
				customRender: () => (
					<div class="flex-center-x w-full justify-between gap-1">
						<ElCheckbox v-model={model.remember}>记住我</ElCheckbox>
						<ElTooltip content="请联系管理员" placement="left">
							<ElLink type="primary" underline="never">
								忘记密码
							</ElLink>
						</ElTooltip>
					</div>
				),
			},
			{
				field: "submit",
				customRender: () => (
					<Button class="w-full" type="primary" label="登 录" loading={isLoading.value} onClick={handleSubmit} />
				),
			},
			{
				field: "reset",
				customRender: () => (
					<Button class="w-full" label="重置数据库" loading={isLoading.value} onClick={handleReset} />
				),
			},
		]);

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

		/**
		 * 重置数据库
		 *
		 * @returns 无内容
		 */
		function handleReset(): void {
			isLoading.value = true;
			info("数据库已重置！");

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

		onBeforeMount(async () => {
			const auth = getAuth();
			if (auth === null) {
				try {
					await initDexie();
				} catch (e) {
					if (e instanceof Error) warning(`${e.message}，请重置数据库！`);
				}
			} else if (auth.remember) {
				redirectPage(MENU_KEY.HOME);
			}
		});

		return () => (
			<div class="full-screen bg-gray flex overflow-hidden">
				<div class="flex-center lt-lg:hidden w-1/2">
					<Animated
						isTyping={isTyping.value}
						showPassword={showPassword.value}
						passwordLength={model.password.length}
					/>
				</div>

				<div class="flex-(1 center) lg:bg-white">
					<div class="flex-y w-100 rounded-lg bg-white p-5">
						<Form ref={formRef} schema={schema.value} model={model} rules={rules} size="large" />
					</div>
				</div>
			</div>
		);
	},
	{
		name: firstUpper(MENU_KEY.LOGIN),
	},
);

/**
 * 用户登录
 *
 * @param account 账号
 * @param password 密码
 * @param remember 是否记住登录状态
 *
 * @returns 登录结果响应，包含用户、角色、菜单及权限信息
 */
async function handleLogin(account: string, password: string, remember: boolean): Promise<ResponseApi<Auth>> {
	const result = responseData<Auth>();

	try {
		const user = await userTable.get({
			account,
			password,
		});

		if (user === undefined) {
			result.code = HTTP_CODE.UNAUTHORIZED;
			result.message = "账号或密码错误！";
		} else {
			const roles = await roleTable.where(TABLE_COLUMN.KEY.ID).anyOf(user.roles).toArray();
			const menus = await menuTable.toArray();
			const permissions = await permissionTable.toArray();

			result.message = "登录成功！页面自动跳转...";
			result.data = {
				remember,
				id: user.id,
				name: user.name,
				avatar: user.avatar,
				roles: user.roles,
				menus: intersectionWith(menus, uniq(flatMap(roles, (role) => role.menus)), (obj, id) => obj.id === id).map(
					(item) => item.code,
				),
				permissions: intersectionWith(
					permissions,
					uniq(flatMap(roles, (role) => role.permissions)),
					(obj, id) => obj.id === id,
				).map((item) => item.code),
			};
		}
	} catch {
		result.code = HTTP_CODE.SERVER_ERROR;
		result.message = RESPONSE_MESSAGE.SERVER_ERROR;
	}

	return result;
}

createApp(App).mount(createRoot());
