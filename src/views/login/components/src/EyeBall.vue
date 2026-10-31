<script setup lang="ts">
import type { EyeBallProps, PupilPosition } from "./types";

import { getPupilPosition } from "./helpers";

const props = defineProps<EyeBallProps>();
const eyeRef = useTemplateRef<HTMLDivElement>("eyeRef");
const pupilPosition = computed<PupilPosition>(() => getPupilPosition(eyeRef, props));
</script>

<template>
	<div
		ref="eyeRef"
		class="flex-center overflow-hidden rounded-full transition-all duration-150"
		:style="{
			width: `${size}px`,
			height: isBlinking ? '2px' : `${size}px`,
			backgroundColor: eyeColor,
		}"
	>
		<div
			v-if="!isBlinking"
			:style="{
				width: `${pupilSize}px`,
				height: `${pupilSize}px`,
				backgroundColor: pupilColor,
				transform: `translate(${pupilPosition.mouseX}px, ${pupilPosition.mouseY}px)`,
				transition: 'transform 0.1s ease-in-out',
				borderRadius: '9999px',
			}"
		/>
	</div>
</template>
