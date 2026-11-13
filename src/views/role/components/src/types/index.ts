type RoleExpose = {
	open: (row?: Role) => void;
};

interface RoleProps {
	data: Role[];
	menus: Menu[];
	permissions: Permission[];
}

export type { RoleExpose, RoleProps };
