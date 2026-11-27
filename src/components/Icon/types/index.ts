import type { IconProps as IconifyIconProps } from "@iconify/vue";

interface IconProps extends Partial<IconifyIconProps> {
	icon: string;
}

type IconEmits = {
	click: [];
};

export type { IconProps, IconEmits };
