import { existsSync, rmSync } from "node:fs";
import svelte from "rollup-plugin-svelte";
import sveltePreprocess from "svelte-preprocess";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import postcss from "rollup-plugin-postcss";
import copy from "rollup-plugin-copy";
import replace from "@rollup/plugin-replace";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";

const production = !process.env.ROLLUP_WATCH;
const port = Number(process.env.PORT) || 9011;
const extensions = [".mjs", ".js", ".json", ".node", ".ts", ".svelte"];

// Remove legacy artifacts from older builds (e.g. dist/partials) after template cleanup.
if (existsSync("dist/partials")) {
  rmSync("dist/partials", { recursive: true, force: true });
}

const copyTargets = [
  { src: "public/index.html", dest: "dist" },
  { src: "public/styles.css", dest: "dist" },
];

export default {
  input: "src/main.ts",
  output: {
    file: "dist/org-playground-svelte.js",
    format: "system",
    sourcemap: true,
  },
  plugins: [
    replace({
      preventAssignment: true,
      "process.env.NODE_ENV": JSON.stringify(production ? "production" : "development"),
    }),
    svelte({
      preprocess: sveltePreprocess({ sourceMap: !production, typescript: true }),
      compilerOptions: {
        dev: !production,
      },
    }),
    json(),
    postcss({ inject: true, minimize: production, sourceMap: !production }),
    copy({ targets: copyTargets, copyOnce: true, verbose: false }),
    resolve({ browser: true, dedupe: ["svelte"], extensions }),
    commonjs(),
    typescript({
      tsconfig: "./tsconfig.rollup.json",
      sourceMap: !production,
      inlineSources: !production,
      include: ["src/**/*.ts"],
    }),
    !production &&
      serve({
        contentBase: ["public", "dist"],
        port,
        // Avoid rewriting missing JS bundle requests to index.html; that breaks SystemJS loading.
        historyApiFallback: false,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }),
    !production && livereload({ watch: ["dist", "public"] }),
    production && terser(),
  ],
};
