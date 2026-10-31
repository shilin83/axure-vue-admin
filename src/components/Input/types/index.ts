import type { InputProps as ElInputProps } from "element-plus";

/** 输入框属性 */
interface InputProps extends Partial<ElInputProps> {
	on?: {
		blur?: (event: FocusEvent) => void;
		focus?: (event: FocusEvent) => void;
	};
	slots?: {
		prefix?: () => VNode;
		suffix?: () => VNode;
		append?: () => VNode;
		prepend?: () => VNode;
	};
}

export type { InputProps };
