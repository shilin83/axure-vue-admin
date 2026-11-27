import type { DialogProps as ElDialogProps } from "element-plus";

interface DialogProps extends Partial<ElDialogProps> {
	height?: string;
}

type DialogEmits = {
	submit: [];
};

export type { DialogProps, DialogEmits };
