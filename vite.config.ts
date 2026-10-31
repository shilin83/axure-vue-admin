import Vue from "@vitejs/plugin-vue";
import VueJSX from "@vitejs/plugin-vue-jsx";
import { resolve } from "path";
import UnoCSS from "unocss/vite";
import AutoImport from "unplugin-auto-import/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import { defineConfig } from "vite";
import vueDevTools from "vite-plugin-vue-devtools";

const root = process.cwd();
const entryName = process.env["entry"] ?? "login";
const pathResolve = (dir: string): string => resolve(root, dir);
const basePath = pathResolve("src/views");

const allEntries: Record<string, string> = {
	[entryName]: pathResolve(`${basePath}/${entryName}/main.ts`),
};

export default defineConfig({
	root: `${basePath}`,
	plugins: [
		vueDevTools(),
		Vue(),
		VueJSX(),
		UnoCSS(),
		AutoImport({
			vueTemplate: true,
			resolvers: [ElementPlusResolver()],
			dts: pathResolve("src/types/auto-imports.d.ts"),
			imports: [
				"vue",
				{
					dayjs: [["default", "dayjs"]],
				},
				{
					dexie: ["liveQuery"],
				},
				{
					rxjs: ["Subject", "debounceTime", "distinctUntilChanged"],
				},
				{
					"@iconify/vue": ["Icon"],
				},
				{
					"@vueuse/core": ["useTimeoutFn"],
				},
				{
					"@vueuse/rxjs": ["from", "useObservable"],
				},
				{
					from: "element-plus",
					imports: ["FormRules", "FormItemRule"],
					type: true,
				},
			],
			dirs: [
				pathResolve("src/components/**"),
				pathResolve("src/apis/**"),
				pathResolve("src/constants"),
				pathResolve("src/models"),
				pathResolve("src/utils"),
				{
					glob: pathResolve("src/hooks/**"),
					types: false,
				},
			],
		}),
		Components({
			directives: true,
			dirs: [pathResolve("src/components")],
			dts: pathResolve("src/types/components.d.ts"),
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
				(name) => {
					if (name === "Icon")
						return {
							name,
							from: "@iconify/vue",
						};
					return;
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
