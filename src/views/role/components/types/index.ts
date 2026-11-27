interface RoleProps {
	data: Role[];
	menus: Menu[];
	permissions: Permission[];
}

type RoleExpose = {
	open: (row?: Role) => void;
};

export type { RoleProps, RoleExpose };
