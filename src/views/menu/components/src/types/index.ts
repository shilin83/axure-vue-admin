interface MenuProps {
	data: Menu[];
}

type MenuExpose = {
	open: (row?: Menu) => void;
};

export type { MenuProps, MenuExpose };
