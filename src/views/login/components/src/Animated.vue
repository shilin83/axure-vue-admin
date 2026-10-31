<script setup lang="ts">
import type { AnimatedProps, CalculatePosition, EyeBallProps, PupilProps } from "./types";

import { EyeBall, Pupil } from "..";
import { x, y, hasMouseMoved } from "./helpers";

const props = defineProps<AnimatedProps>();
const isLookingAtEachOther = ref<boolean>(false);
const isPurplePeeking = ref<boolean>(false);
const isPurpleBlinking = ref<boolean>(false);
const isBlackBlinking = ref<boolean>(false);
const purpleRef = useTemplateRef<HTMLDivElement>("purpleRef");
const blackRef = useTemplateRef<HTMLDivElement>("blackRef");
const orangeRef = useTemplateRef<HTMLDivElement>("orangeRef");
const yellowRef = useTemplateRef<HTMLDivElement>("yellowRef");
const purplePos = computed<CalculatePosition>(() => calculatePosition(purpleRef));
const blackPos = computed<CalculatePosition>(() => calculatePosition(blackRef));
const orangePos = computed<CalculatePosition>(() => calculatePosition(orangeRef));
const yellowPos = computed<CalculatePosition>(() => calculatePosition(yellowRef));
const isHidingPassword = computed<boolean>(() => props.passwordLength > 0 && !props.showPassword);

const purpleEyeBall = computed<EyeBallProps>(() => {
	let forceLookX: Optional<number>, forceLookY: Optional<number>;

	if (props.passwordLength > 0 && props.showPassword) {
		forceLookX = isPurplePeeking.value ? 4 : -4;
		forceLookY = isPurplePeeking.value ? 5 : -4;
	} else {
		forceLookX = isLookingAtEachOther.value ? 3 : undefined;
		forceLookY = isLookingAtEachOther.value ? 4 : undefined;
	}

	return {
		forceLookX,
		forceLookY,
		size: 18,
		pupilSize: 7,
		maxDistance: 5,
		eyeColor: "white",
		pupilColor: "#2D2D2D",
		isBlinking: isPurpleBlinking.value,
	};
});

const blackEyeBall = computed<EyeBallProps>(() => {
	let forceLookX: Optional<number>, forceLookY: Optional<number>;

	if (props.passwordLength > 0 && props.showPassword) {
		forceLookX = -4;
		forceLookY = -4;
	} else {
		forceLookX = isLookingAtEachOther.value ? 0 : undefined;
		forceLookY = isLookingAtEachOther.value ? -4 : undefined;
	}

	return {
		forceLookX,
		forceLookY,
		size: 16,
		pupilSize: 6,
		maxDistance: 4,
		eyeColor: "white",
		pupilColor: "#2D2D2D",
		isBlinking: isBlackBlinking.value,
	};
});

const pupilObject = computed<PupilProps>(() => {
	let forceLookX: Optional<number>, forceLookY: Optional<number>;

	if (props.passwordLength > 0 && props.showPassword) {
		forceLookX = -5;
		forceLookY = -4;
	} else {
		forceLookX = undefined;
		forceLookY = undefined;
	}

	return {
		forceLookX,
		forceLookY,
		size: 12,
		maxDistance: 5,
		pupilColor: "#2D2D2D",
	};
});

/**
 * 计算位置：根据鼠标位置与元素中心点的偏移计算脸部位移与身体倾斜角度
 *
 * @param ref 元素引用
 *
 * @returns 位置计算结果
 */
function calculatePosition(ref: Ref<Nullable<HTMLDivElement>>): CalculatePosition {
	let position: CalculatePosition = {
		faceX: 0,
		faceY: 0,
		bodySkew: 0,
	};

	if (ref.value === null) return position;
	if (!hasMouseMoved.value) return position;

	const rect = ref.value.getBoundingClientRect();
	const centerX = rect.left + rect.width / 2;
	const centerY = rect.top + rect.height / 3;
	const deltaX = x.value - centerX;
	const deltaY = y.value - centerY;

	position.faceX = Math.max(-15, Math.min(15, deltaX / 20));
	position.faceY = Math.max(-10, Math.min(10, deltaY / 30));
	position.bodySkew = Math.max(-6, Math.min(6, -deltaX / 120));

	return position;
}

onMounted(() => {
	const getRandomBlinkInterval = (): number => Math.random() * 3000 + 2000;

	const scheduleBlink = (): void => {
		useTimeoutFn(() => {
			isPurpleBlinking.value = true;
			isBlackBlinking.value = true;

			useTimeoutFn(() => {
				isPurpleBlinking.value = false;
				isBlackBlinking.value = false;

				scheduleBlink();
			}, 200);
		}, getRandomBlinkInterval());
	};

	scheduleBlink();
});
</script>

<template>
	<div class="relative h-100 w-115">
		<div
			ref="purpleRef"
			class="rounded-t-2 origin-bottom-center absolute bottom-0 left-[70px] z-1 w-45 bg-[#6C3FF5] transition-all duration-700 ease-in-out"
			:style="{
				height: isTyping || isHidingPassword ? '440px' : '400px',
				transform:
					passwordLength > 0 && showPassword
						? 'skewX(0deg)'
						: isTyping || isHidingPassword
							? `skewX(${purplePos.bodySkew - 12}deg) translateX(40px)`
							: `skewX(${purplePos.bodySkew}deg)`,
			}"
		>
			<div
				class="absolute flex gap-8 transition-all duration-700 ease-in-out"
				:style="{
					left:
						passwordLength > 0 && showPassword ? '20px' : isLookingAtEachOther ? '55px' : `${purplePos.faceX + 45}px`,
					top:
						passwordLength > 0 && showPassword ? '35px' : isLookingAtEachOther ? '65px' : `${purplePos.faceY + 40}px`,
				}"
			>
				<EyeBall v-bind="purpleEyeBall" />
				<EyeBall v-bind="purpleEyeBall" />
			</div>
		</div>

		<div
			ref="blackRef"
			class="origin-bottom-center rounded-t-2 absolute bottom-0 left-60 z-2 h-[310px] w-30 bg-[#2D2D2D] transition-all duration-700 ease-in-out"
			:style="{
				transform:
					passwordLength > 0 && showPassword
						? 'skewX(0deg)'
						: isLookingAtEachOther
							? `skewX(${blackPos.bodySkew * 1.5 + 10}deg) translateX(20px)`
							: isTyping || isHidingPassword
								? `skewX(${blackPos.bodySkew * 1.5}deg)`
								: `skewX(${blackPos.bodySkew}deg)`,
			}"
		>
			<div
				class="absolute flex gap-6 transition-all duration-700 ease-in-out"
				:style="{
					left:
						passwordLength > 0 && showPassword ? '10px' : isLookingAtEachOther ? '32px' : `${blackPos.faceX + 26}px`,
					top: passwordLength > 0 && showPassword ? '28px' : isLookingAtEachOther ? '12px' : `${blackPos.faceY + 32}px`,
				}"
			>
				<EyeBall v-bind="blackEyeBall" />
				<EyeBall v-bind="blackEyeBall" />
			</div>
		</div>

		<div
			ref="orangeRef"
			class="rounded-t-30 origin-bottom-center absolute bottom-0 left-0 z-3 h-50 w-60 bg-[#FF9B6B] transition-all duration-700 ease-in-out"
			:style="{
				transform: passwordLength > 0 && showPassword ? 'skewX(0deg)' : `skewX(${orangePos.bodySkew}deg)`,
			}"
		>
			<div
				class="absolute flex gap-8 transition-all duration-200 ease-out"
				:style="{
					left: passwordLength > 0 && showPassword ? '50px' : `${orangePos.faceX + 82}px`,
					top: passwordLength > 0 && showPassword ? '85px' : `${orangePos.faceY + 90}px`,
				}"
			>
				<Pupil v-bind="pupilObject" />
				<Pupil v-bind="pupilObject" />
			</div>
		</div>

		<div
			ref="yellowRef"
			class="origin-bottom-center absolute bottom-0 left-[310px] z-4 h-[230px] w-[140px] rounded-t-[70px] bg-[#E8D754] transition-all duration-700 ease-in-out"
			:style="{
				transform: passwordLength > 0 && showPassword ? 'skewX(0deg)' : `skewX(${yellowPos.bodySkew}deg)`,
			}"
		>
			<div
				class="absolute flex gap-6 transition-all duration-200 ease-out"
				:style="{
					left: passwordLength > 0 && showPassword ? '20px' : `${yellowPos.faceX + 52}px`,
					top: passwordLength > 0 && showPassword ? '35px' : `${yellowPos.faceY + 40}px`,
				}"
			>
				<Pupil v-bind="pupilObject" />
				<Pupil v-bind="pupilObject" />
			</div>
			<div
				class="absolute h-1 w-20 rounded-full bg-[#2D2D2D] transition-all duration-200 ease-out"
				:style="{
					left: passwordLength > 0 && showPassword ? '10px' : `${yellowPos.faceX + 40}px`,
					top: passwordLength > 0 && showPassword ? '88px' : `${yellowPos.faceY + 88}px`,
				}"
			/>
		</div>
	</div>
</template>
