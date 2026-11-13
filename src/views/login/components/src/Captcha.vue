<script setup lang="ts">
import type { CaptchaEmits, CaptchaProps, CaptchaExpose } from "./types";

const emit = defineEmits<CaptchaEmits>();
const canvasRef = useTemplateRef<HTMLCanvasElement>("canvasRef");

const props = withDefaults(defineProps<CaptchaProps>(), {
	width: 120,
	height: 40,
	length: 4,
});

/**
 * 生成随机颜色
 *
 * @param min RGB 分量最小值
 * @param max RGB 分量最大值
 *
 * @returns RGB 颜色字符串
 */
function randomColor(min: number, max: number): string {
	const r = Math.floor(Math.random() * (max - min) + min);
	const g = Math.floor(Math.random() * (max - min) + min);
	const b = Math.floor(Math.random() * (max - min) + min);

	return `rgb(${r},${g},${b})`;
}

/**
 * 生成随机验证码：从排除易混淆字符的字符集中随机生成指定长度的验证码
 *
 * @returns 随机验证码字符串
 */
function randomCode(): string {
	let code = "";

	const chars = "ABCDEFHJKMNPRSTWXYZabcdefhjkmnprstwxyz2345678";

	for (let i = 0; i < props.length; i++) {
		code += chars[Math.floor(Math.random() * chars.length)];
	}

	return code;
}

/**
 * 绘制验证码：在画布上绘制背景、旋转字符、干扰线与干扰点，并通过事件抛出验证码
 *
 * @returns 无内容
 */
function drawCaptcha(): void {
	const canvas = canvasRef.value;
	if (canvas === null) return;

	const ctx = canvas.getContext("2d");
	if (ctx === null) return;

	ctx.fillStyle = randomColor(180, 240);
	ctx.clearRect(0, 0, props.width, props.height);
	ctx.fillRect(0, 0, props.width, props.height);

	const code = randomCode();
	emit("handleChange", code);

	for (let i = 0; i < props.length; i++) {
		const fontSize = Math.floor(Math.random() * (props.height * 0.5)) + props.height * 0.5;
		const deg = (Math.random() * 30 * Math.PI) / 180;

		ctx.font = `${fontSize}px Arial`;
		ctx.textBaseline = "middle";
		ctx.textAlign = "center";
		ctx.fillStyle = randomColor(50, 160);
		ctx.save();

		const x = (props.width / 4) * i + props.width / 8;
		const y = props.height / 2;

		ctx.translate(x, y);
		ctx.rotate(Math.random() > 0.5 ? deg : -deg);
		ctx.fillText(code[i] as string, 0, 0);
		ctx.restore();
	}

	for (let i = 0; i < props.length * 2; i++) {
		ctx.beginPath();
		ctx.moveTo(Math.random() * props.width, Math.random() * props.height);
		ctx.lineTo(Math.random() * props.width, Math.random() * props.height);
		ctx.strokeStyle = randomColor(40, 180);
		ctx.stroke();
	}

	for (let i = 0; i < props.length * 5; i++) {
		ctx.beginPath();
		ctx.arc(Math.random() * props.width, Math.random() * props.height, 1, 0, 2 * Math.PI);
		ctx.fillStyle = randomColor(0, 255);
		ctx.fill();
	}
}

defineExpose<CaptchaExpose>({
	refresh: drawCaptcha,
});

onMounted(drawCaptcha);
</script>

<template>
	<canvas ref="canvasRef" class="cursor-pointer" :width="width" :height="height" @click="drawCaptcha" />
</template>
