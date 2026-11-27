import type { PupilPosition, PupilProps } from "../types";

import { useEventListener, useMouse } from "@vueuse/core";

const { x, y } = useMouse();
const hasMouseMoved = ref<boolean>(false);

useEventListener(window, "mousemove", () => (hasMouseMoved.value = true), {
	once: true,
});

/**
 * 计算瞳孔位置：根据强制看向方向或鼠标位置计算瞳孔偏移坐标
 *
 * @param pupilRef 瞳孔元素引用
 * @param props 瞳孔属性
 *
 * @returns 瞳孔位置坐标
 */
function getPupilPosition(pupilRef: Ref<Nullable<HTMLDivElement>>, props: PupilProps): PupilPosition {
	const position: PupilPosition = {
		mouseX: 0,
		mouseY: 0,
	};

	if (pupilRef.value === null) return position;
	if (!hasMouseMoved.value) return position;

	if (props.forceLookX !== undefined && props.forceLookY !== undefined) {
		position.mouseX = props.forceLookX;
		position.mouseY = props.forceLookY;

		return position;
	}

	const pupil = pupilRef.value.getBoundingClientRect();
	const pupilCenterX = pupil.left + pupil.width / 2;
	const pupilCenterY = pupil.top + pupil.height / 2;
	const deltaX = x.value - pupilCenterX;
	const deltaY = y.value - pupilCenterY;
	const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), props.maxDistance ?? 0);
	const angle = Math.atan2(deltaY, deltaX);

	position.mouseX = Math.cos(angle) * distance;
	position.mouseY = Math.sin(angle) * distance;

	return position;
}

export { x, y, hasMouseMoved, getPupilPosition };
