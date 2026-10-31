import { defineConfig } from "oxfmt";

export default defineConfig({
	sortTailwindcss: true,
	sortImports: {
		groups: [
			["side_effect_style", "style"],
			"type-import",
			["value-builtin", "value-external"],
			["value-internal", "value-parent", "value-sibling", "value-index"],
			"unknown",
		],
		order: "asc",
	},
});
