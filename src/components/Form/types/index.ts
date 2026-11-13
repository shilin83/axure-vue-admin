interface FormProps {
	/** 表单配置 */
	schema: FormSchema[];
	/** 表单数据 */
	model: Recordable;
}

interface FormSchema {
	/** 唯一标识 */
	field: string;
	/** 标签文本 */
	label?: string;
	/** 组件类型 */
	component?: Component;
	/** 组件属性 */
	componentProps?: Recordable;
	/** 自定义渲染函数 */
	customRender?: () => VNode;
}

interface FormExpose {
	/** 校验整个表单 */
	validate: () => Promise<boolean>;
	/** 重置表单字段 */
	resetFields: (props?: Optional<Arrayable<string>>) => void;
	/** 清空表单校验 */
	clearValidate: (props?: Optional<Arrayable<string>>) => void;
}

export type { FormProps, FormSchema, FormExpose };
