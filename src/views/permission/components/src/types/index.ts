type PermissionExpose = {
	open: (row?: Permission) => void;
};

interface PermissionProps {
	data: Permission[];
}

export type { PermissionExpose, PermissionProps };
