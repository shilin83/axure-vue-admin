<script setup lang="ts">
import type { PupilPosition, PupilProps } from "./types";

import { getPupilPosition } from "./helpers";

const props = defineProps<PupilProps>();
const pupilRef = useTemplateRef<HTMLDivElement>("pupilRef");
const pupilPosition = computed<PupilPosition>(() => getPupilPosition(pupilRef, props));
</script>

<template>
	<div
		ref="pupilRef"
		:style="{
			width: `${size}px`,
			height: `${size}px`,
			backgroundColor: pupilColor,
			transform: `translate(${pupilPosition.mouseX}px, ${pupilPosition.mouseY}px)`,
			transition: 'transform 0.1s ease-out',
			borderRadius: '9999px',
		}"
	/>
</template>
