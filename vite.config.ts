import Vue from "@vitejs/plugin-vue";
import VueJsx from "@vitejs/plugin-vue-jsx";
import { resolve } from "path";
import UnoCSS from "unocss/vite";
import AutoImport from "unplugin-auto-import/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import { defineConfig } from "vite";
import VueDevTools from "vite-plugin-vue-devtools";

const root = process.cwd();
const entryName = process.env["entry"] ?? "login";
const basePath = pathResolve("src/views");

const allEntries: Record<string, string> = {
	[entryName]: pathResolve(`${basePath}/${entryName}/main.tsx`),
};

function pathResolve(dir: string): string {
	return resolve(root, dir);
}

export default defineConfig({
	appType: "mpa",
	root: `${basePath}`,
	devtools: {
		apply: "serve",
	},
	plugins: [
		VueDevTools(),
		Vue(),
		VueJsx(),
		UnoCSS(),
		AutoImport({
			vueTemplate: true,
			resolvers: [ElementPlusResolver()],
			dts: pathResolve("src/types/auto-imports.d.ts"),
			include: [/\.[t]sx?$/, /\.vue$/],
			imports: [
				"vue",
				{
					dexie: ["liveQuery"],
				},
				{
					"element-plus": ["ElCheckbox", "ElLink", "ElTooltip", "ElText", "ElTag"],
				},
				{
					"@vueuse/rxjs": ["from", "useObservable"],
				},
				{
					from: "element-plus",
					imports: ["FormRules"],
					type: true,
				},
			],
			dirs: [
				pathResolve("src/components/**"),
				pathResolve("src/models/**"),
				pathResolve("src/hooks/**"),
				pathResolve("src/utils/**"),
				pathResolve("src/responses"),
				pathResolve("src/constants"),
			],
		}),
		Components({
			directives: true,
			dirs: [pathResolve("src/components")],
			dts: pathResolve("src/types/components.d.ts"),
			include: [/\.tsx$/, /\.vue$/],
			resolvers: [
				ElementPlusResolver({
					directives: true,
				}),
				{
					type: "directive",
					resolve: (name) => {
						if (name === "Perm") {
							return {
								name: "vPerm",
								from: pathResolve("src/directives"),
							};
						}
						return;
					},
				},
			],
		}),
	],
	resolve: {
		alias: {
			"@": pathResolve("src"),
		},
	},
	build: {
		emptyOutDir: true,
		chunkSizeWarningLimit: 4096,
		rolldownOptions: {
			input: allEntries[entryName],
			output: {
				dir: `${root}/dist`,
				format: "iife",
				entryFileNames: `${entryName}.js`,
				minify: {
					compress: {
						dropConsole: true,
						dropDebugger: true,
					},
				},
			},
		},
	},
	server: {
		open: `${entryName}/`,
	},
});
