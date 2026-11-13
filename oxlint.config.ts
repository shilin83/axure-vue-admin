import { defineConfig } from "oxlint";

export default defineConfig({
	plugins: ["oxc", "import", "typescript", "vue"],
	options: {
		typeAware: true,
		typeCheck: true,
	},
	rules: {
		"typescript/explicit-function-return-type": [
			"error",
			{
				allowExpressions: true,
				allowTypedFunctionExpressions: true,
			},
		],
		eqeqeq: ["error", "always"],
	},
});
