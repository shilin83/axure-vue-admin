import type { InputProps as ElInputProps } from "element-plus";

interface InputProps extends Partial<ElInputProps> {
	search?: boolean;
	on?: {
		blur?: (e: FocusEvent) => void;
		focus?: (e: FocusEvent) => void;
	};
	slots?: {
		prefix?: () => VNode;
		suffix?: () => VNode;
	};
}

export type { InputProps };
