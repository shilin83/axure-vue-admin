type Trigger = string | string[];

const DEFAULT_TRIGGER = ["blur", "change"];

/**
 * 生成必填项校验规则
 *
 * @param message 自定义校验失败提示信息，默认为"该项为必填项"
 * @param trigger 触发校验的事件，默认 ["blur", "change"]
 *
 * @returns 必填项校验规则
 */
function required(message?: string, trigger?: Trigger): FormItemRule {
	return {
		required: true,
		message: message ?? "该项为必填项",
		trigger: trigger ?? DEFAULT_TRIGGER,
	};
}

/**
 * 生成数组必选项校验规则，要求至少选择一项
 *
 * @param message 自定义校验失败提示信息，默认为"请至少选择一项"
 * @param trigger 触发校验的事件，默认 ["blur", "change"]
 *
 * @returns 数组必选项校验规则
 */
function array(message?: string, trigger?: Trigger): FormItemRule {
	return {
		required: true,
		type: "array",
		message: message ?? "请至少选择一项",
		trigger: trigger ?? DEFAULT_TRIGGER,
	};
}

/**
 * 生成中文校验规则
 *
 * @param message 自定义校验失败提示信息
 * @param trigger 触发校验的事件，默认 ["blur", "change"]
 *
 * @returns 中文校验规则
 */
function chinese(message?: string, trigger?: Trigger): FormItemRule {
	return {
		validator: (_: any, value: string, callback: (error?: Error | string) => void) => {
			if (!/^[\u4e00-\u9fa5]+$/.test(value) || value.length < 2) {
				callback(new Error(message ?? "只能输入中文，且长度不能少于 2 个字符"));
				return;
			}

			callback();
		},
		trigger: trigger ?? DEFAULT_TRIGGER,
	};
}

/**
 * 生成英文数字组合校验规则，要求以英文字母开头、仅含英文字母与数字
 *
 * @param message 自定义校验失败提示信息，默认为"仅支持英文字母和数字，且不能以数字开头"
 * @param trigger 触发校验的事件，默认 ["blur", "change"]
 *
 * @returns 英文数字组合校验规则
 */
function alphanumeric(message?: string, trigger?: Trigger): FormItemRule {
	return {
		validator: (_: any, value: string, callback: (error?: Error | string) => void) => {
			if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(value)) {
				callback(new Error(message ?? "仅支持英文字母和数字，且不能以数字开头"));
				return;
			}

			callback();
		},
		trigger: trigger ?? DEFAULT_TRIGGER,
	};
}

/**
 * 生成手机号校验规则，要求为 11 位数字
 *
 * @param message 自定义校验失败提示信息，默认为"手机号需为11位数字"
 * @param trigger 触发校验的事件，默认 ["blur", "change"]
 *
 * @returns 手机号校验规则
 */
function phone139(message?: string, trigger?: Trigger): FormItemRule {
	return {
		validator: (_: any, value: string, callback: (error?: Error | string) => void) => {
			if (!/^139\d{8}$/.test(value)) {
				callback(new Error(message ?? "手机号需以139开头且为11位数字"));
				return;
			}

			callback();
		},
		trigger: trigger ?? DEFAULT_TRIGGER,
	};
}

export { required, array, chinese, alphanumeric, phone139 };
