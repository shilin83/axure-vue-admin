interface ChangePassword {
	newPassword: string;
	confirmPassword: string;
}

interface LayoutProps {
	active: string;
}

type BreadcrumbItem = Pick<Menu, "name">;

export type { BreadcrumbItem, ChangePassword, LayoutProps };
