type CaptchaExpose = {
	refresh: () => void;
};

type CaptchaEmits = {
	handleChange: [code: string];
};

interface CaptchaProps {
	width?: number;
	height?: number;
	length?: number;
}

interface EyeProps {
	size?: number;
	pupilSize?: number;
	maxDistance?: number;
	eyeColor?: string;
	pupilColor?: string;
	isBlinking?: boolean;
	forceLookX?: number;
	forceLookY?: number;
}

interface PupilProps {
	size?: number;
	maxDistance?: number;
	pupilColor?: string;
	forceLookX?: number;
	forceLookY?: number;
}

interface PupilPosition {
	mouseX: number;
	mouseY: number;
}

interface AnimatedProps {
	isTyping: boolean;
	showPassword: boolean;
	passwordLength: number;
}

interface CalculatePosition {
	faceX: number;
	faceY: number;
	bodySkew: number;
}

interface LoginForm {
	account: string;
	password: string;
	captcha: string;
	remember: boolean;
}

export type {
	AnimatedProps,
	CalculatePosition,
	CaptchaEmits,
	CaptchaExpose,
	CaptchaProps,
	EyeProps,
	LoginForm,
	PupilPosition,
	PupilProps,
};
