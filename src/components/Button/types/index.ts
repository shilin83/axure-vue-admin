import type { ButtonProps as ElButtonProps } from "element-plus";

interface ButtonProps extends Partial<ElButtonProps> {
	icon?: string;
	label?: string;
}

type ButtonEmits = {
	handleClick: [e: MouseEvent];
};

export type { ButtonProps, ButtonEmits };
