type MenuExpose = {
	open: (row?: Menu) => void;
};

interface MenuProps {
	data: Menu[];
}

export type { MenuExpose, MenuProps };
