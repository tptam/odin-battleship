import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  { languageOptions: { globals: globals.browser } },
  { ignores: ["webpack.config.js, babel.config.js"] },
  pluginJs.configs.recommended,
];
