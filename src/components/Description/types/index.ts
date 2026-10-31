import type { DescriptionProps as ElDescriptionProps } from "element-plus";

interface DescriptionProps extends Partial<ElDescriptionProps> {
	/** 描述列表项配置数组 */
	items: DescriptionSchema[];
}

interface DescriptionSchema {
	/** 标签文本 */
	label: string;
	/** 展示内容 */
	value: string | number;
	/** 所占列数 */
	span?: number;
}

export type { DescriptionProps, DescriptionSchema };
