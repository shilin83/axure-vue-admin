import type { CheckboxGroupProps as ElCheckboxGroupProps } from "element-plus";

interface CheckboxGroupProps extends Partial<ElCheckboxGroupProps> {
	options: CheckboxOption[];
}

interface CheckboxOption {
	label: string;
	value: number;
}

export type { CheckboxGroupProps, CheckboxOption };
