import CheckboxGroup from "@/components/CheckboxGroup/CheckboxGroup.vue";
import Input from "@/components/Input/Input.vue";
import Select from "@/components/Select/Select.vue";
import Switch from "@/components/Switch/Switch.vue";
import TreeSelect from "@/components/TreeSelect/TreeSelect.vue";

const COMPONENT_NAME = {
	INPUT: Input,
	SELECT: Select,
	SWITCH: Switch,
	TREE_SELECT: TreeSelect,
	CHECKBOX_GROUP: CheckboxGroup,
} as const;

export { COMPONENT_NAME };
