<script setup lang="ts">
import { TableData } from "..";

const departmentList = useObservable<Department[], []>(from(liveQuery(async () => await departmentTable.toArray())), {
	initialValue: [],
});

const dataList = computed<Department[]>(() => departmentList.value.filter((item) => item.deletedAt === undefined));
const recycledList = computed<Department[]>(() => departmentList.value.filter((item) => item.deletedAt !== undefined));
</script>

<template>
	<Layout :active="ROUTE_KEY.DEPARTMENT">
		<TableData :data="dataList" :recycled="recycledList" />
	</Layout>
</template>
