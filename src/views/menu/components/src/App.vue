<script setup lang="ts">
import { TableData } from "..";

const menuList = useObservable<Menu[], []>(from(liveQuery(async () => buildTree<Menu>(await menuTable.toArray()))), {
	initialValue: [],
});
</script>

<template>
	<Layout :active="ROUTE_KEY.MENU">
		<TableData :data="menuList" />
	</Layout>
</template>
