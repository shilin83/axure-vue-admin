import type { DescriptionProps as ElDescriptionProps } from "element-plus";

interface DescriptionProps extends Partial<ElDescriptionProps> {
	/** 列配置 */
	schema: DescriptionSchema[];
	/** 数据对象 */
	data: any;
}

interface DescriptionSchema {
	/** 字段名 */
	field: string;
	/** 标签文本 */
	label: string;
	/** 所占列数 */
	span?: number;
	/** 自定义格式化函数 */
	formatter?: (data: any, value: any) => VNode;
}

export type { DescriptionProps, DescriptionSchema };
