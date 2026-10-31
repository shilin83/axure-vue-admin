<script setup lang="ts">
import { TableData } from "..";

const permissionList = useObservable<Permission[], []>(
	from(liveQuery(async () => buildTree<Permission>(await permissionTable.toArray()))),
	{
		initialValue: [],
	},
);
</script>

<template>
	<Layout :active="ROUTE_KEY.PERMISSION">
		<TableData :data="permissionList" />
	</Layout>
</template>
