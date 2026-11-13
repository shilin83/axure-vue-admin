type DepartmentExpose = {
	open: (row?: Department) => void;
};

interface DepartmentProps {
	data: Department[];
}

export type { DepartmentExpose, DepartmentProps };
