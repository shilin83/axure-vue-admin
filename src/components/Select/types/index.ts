interface SelectProps {
	options: SelectOption[];
}

interface SelectOption {
	label: string;
	value: string | number;
	disabled?: boolean;
}

export type { SelectProps, SelectOption };
