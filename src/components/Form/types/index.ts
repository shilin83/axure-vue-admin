import type { FormProps as ElFormProps } from "element-plus";

interface FormExpose {
	/** 校验整个表单 */
	validate: () => Promise<boolean>;
	/** 重置表单字段值 */
	resetFields: (props?: Optional<string | string[]>) => void;
	/** 清空表单项校验提示 */
	clearValidate: (props?: Optional<string | string[]>) => void;
}

interface FormSchema {
	/** 唯一标识 */
	field: string;
	/** 标签文本 */
	label?: string;
	/** 组件类型 */
	component?: Component;
	/** 组件属性 */
	componentProps?: InputProps | SelectProps | SwitchProps | TreeSelectProps | CheckboxProps;

	/** 表单项渲染函数 */
	customRender?: () => VNode;
}

interface FormProps extends ElFormProps {
	/** 表单配置 */
	schema: FormSchema[];
	/** 表单数据 */
	model: Recordable;
}

export type { FormExpose, FormSchema, FormProps };
