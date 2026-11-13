type BreadcrumbItem = Pick<Menu, "name">;

interface ChangePassword {
	newPassword: string;
	confirmPassword: string;
}
interface LayoutProps {
	active: string;
}

export type { BreadcrumbItem, ChangePassword, LayoutProps };
