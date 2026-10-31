import type { SelectProps as ElSelectProps } from "element-plus";

/** 选项配置 */
interface SelectOption {
	label: string | number;
	value: string | number;
	disabled?: boolean;
}

interface SelectProps extends Partial<ElSelectProps> {
	options: SelectOption[];
}

export type { SelectProps, SelectOption };
