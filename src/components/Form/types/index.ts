import type { FormProps as ElFormProps, RowProps, ColProps } from "element-plus";

interface FormProps extends Partial<ElFormProps> {
	/** 表单数据 */
	model: Recordable;
	/** 表单配置 */
	schema: FormSchema[];
	/** 行属性 */
	rowProps?: RowProps;
}

interface FormSchema {
	/** 唯一标识 */
	field: string;
	/** 标签文本 */
	label?: string;
	/** 组件类型 */
	component?: Component;
	/** 组件属性 */
	componentProps?: InputProps | SwitchProps | SelectProps | TreeSelectProps | CheckboxGroupProps;
	/** 自定义渲染函数 */
	customRender?: () => VNode;
	/** 列属性 */
	colProps?: ColProps;
}

type FormExpose = {
	/** 校验整个表单 */
	validate: () => Promise<boolean>;
	/** 重置表单字段 */
	resetFields: (props?: Optional<Arrayable<string>>) => void;
	/** 清空表单校验 */
	clearValidate: (props?: Optional<Arrayable<string>>) => void;
};

export type { FormProps, FormSchema, FormExpose };
