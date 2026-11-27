<script setup lang="ts">
import type { EyeProps, PupilPosition } from "./types";

import { getPupilPosition } from "./helpers";

const props = defineProps<EyeProps>();
const eyeRef = useTemplateRef<HTMLDivElement>("eyeRef");
const pupilPosition = computed<PupilPosition>(() => getPupilPosition(eyeRef, props));
</script>

<template>
	<div
		ref="eyeRef"
		class="flex-center overflow-hidden rounded-full transition-all duration-150"
		:style="{
			width: `${props.size}px`,
			height: props.isBlinking ? '2px' : `${props.size}px`,
			backgroundColor: props.eyeColor,
		}"
	>
		<div
			v-if="!props.isBlinking"
			:style="{
				width: `${props.pupilSize}px`,
				height: `${props.pupilSize}px`,
				backgroundColor: props.pupilColor,
				transform: `translate(${pupilPosition.mouseX}px, ${pupilPosition.mouseY}px)`,
				transition: 'transform 0.1s ease-in-out',
				borderRadius: '9999px',
			}"
		/>
	</div>
</template>
