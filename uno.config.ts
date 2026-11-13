import { defineConfig, presetWind4, transformerVariantGroup } from "unocss";

export default defineConfig({
	content: {
		pipeline: {
			exclude: ["node_modules", "dist"],
		},
	},
	presets: [presetWind4()],
	rules: [
		[
			"full-screen",
			[
				["width", "100vw"],
				["height", "100vh"],
			],
		],
	],
	shortcuts: [
		{
			"flex-center": "flex justify-center items-center",
			"flex-center-x": "flex items-center",
			"flex-center-y": "flex justify-center",
			"flex-y": "flex flex-col",
		},
	],
	transformers: [transformerVariantGroup()],
});
