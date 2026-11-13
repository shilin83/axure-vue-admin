interface DescriptionProps {
	/** 列配置 */
	schema: DescriptionSchema[];
	/** 数据对象 */
	data: any;
	/** 列数 */
	column?: number;
}

interface DescriptionSchema {
	/** 字段名 */
	field: string;
	/** 标签文本 */
	label: string;
	/** 所占列数 */
	span?: number;
	/** 自定义格式化函数：入参为当前数据对象与字段值，返回展示文本 */
	formatter?: (data: any, value: any) => VNode | string;
}

export type { DescriptionProps, DescriptionSchema };
