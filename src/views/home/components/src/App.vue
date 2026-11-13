<script setup lang="ts">
import { Metric, Sale, Rank } from "..";
</script>

<template>
	<Layout :active="MENU_KEY.HOME">
		<div class="grid-(~ rows-[auto_1fr_auto]) h-full gap-5 p-5">
			<Metric />
			<Sale />
			<Rank />
		</div>
	</Layout>
</template>
