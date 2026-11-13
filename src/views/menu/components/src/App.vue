<script setup lang="ts">
import { Read } from "..";

const data = useObservable<Menu[], []>(from(liveQuery(async () => buildTree(await menuTable.toArray()))), {
	initialValue: [],
});
</script>

<template>
	<Layout :active="MENU_KEY.MENU">
		<Read :data="data" />
	</Layout>
</template>
