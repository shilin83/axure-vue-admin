/** 复选框选项 */
interface CheckboxOption {
	/** 选项显示文本 */
	label: string;
	/** 选项值：多选必填，单选可省略 */
	value: string | number;
	/** 是否禁用该选项 */
	disabled?: boolean;
}

/** 复选框属性 */
interface CheckboxProps {
	label?: string;
	max?: number;
	options?: CheckboxOption[];
}

export type { CheckboxOption, CheckboxProps };
