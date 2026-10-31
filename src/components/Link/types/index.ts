import type { LinkProps as ElLinkProps } from "element-plus";

interface LinkProps extends Partial<ElLinkProps> {
	icon?: string;
	label?: string;
}

export type { LinkProps };
