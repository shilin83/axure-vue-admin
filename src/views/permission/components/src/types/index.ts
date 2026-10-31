interface PermissionProps {
	data: Permission[];
}

type PermissionExpose = {
	open: (row?: Permission) => void;
};

export type { PermissionProps, PermissionExpose };
