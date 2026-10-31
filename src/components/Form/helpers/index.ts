import Checkbox from "@/components/Checkbox/Checkbox.vue";
import Input from "@/components/Input/Input.vue";
import Select from "@/components/Select/Select.vue";
import Switch from "@/components/Switch/Switch.vue";
import TreeSelect from "@/components/TreeSelect/TreeSelect.vue";

/** 组件名称 */
const COMPONENT_NAME = {
	INPUT: Input,
	SELECT: Select,
	SWITCH: Switch,
	CHECKBOX: Checkbox,
	TREE_SELECT: TreeSelect,
} as const;

export { COMPONENT_NAME };
