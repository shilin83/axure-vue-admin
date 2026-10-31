import type { TagProps as ElTagProps } from "element-plus";

interface TagProps extends Partial<ElTagProps> {
	/** 标签文本 */
	text: string | number;
}

export type { TagProps };
