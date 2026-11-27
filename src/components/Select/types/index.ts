import type { SelectProps as ElSelectProps } from "element-plus";

interface SelectProps extends Partial<ElSelectProps> {
	options: SelectOption[];
}

interface SelectOption {
	label: string;
	value: string | number;
	disabled?: boolean;
}

export type { SelectProps, SelectOption };
