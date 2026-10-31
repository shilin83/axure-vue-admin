interface DepartmentProps {
	data: Department[];
	recycled: Department[];
}

type DepartmentExpose = {
	open: (row?: Department) => void;
};

export type { DepartmentProps, DepartmentExpose };
