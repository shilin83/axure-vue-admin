interface LayoutProps {
	active: string;
}

interface ChangePassword {
	newPassword: string;
	confirmPassword: string;
}

type BreadcrumbItem = Pick<Menu, "name">;

export type { BreadcrumbItem, ChangePassword, LayoutProps };
