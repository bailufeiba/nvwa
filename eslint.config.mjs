import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";

export default [
    {
        ignores: ["library/**", "temp/**", "profiles/**", "settings/**", "node_modules/**"],
    },
    {
        files: ["**/*.ts"],
        languageOptions: {
            parser: tsParser,
            ecmaVersion: "latest",
            sourceType: "module",
        },
        plugins: {
            "@typescript-eslint": tsPlugin,
            "simple-import-sort": simpleImportSort,
            "unused-imports": unusedImports,
        },
        rules: {
            "no-multiple-empty-lines": [
                "warn",
                {
                    max: 1,
                    maxEOF: 0,
                    maxBOF: 0,
                },
            ],
            "no-unused-vars": "warn",
            "@typescript-eslint/no-unused-vars": "warn",
            "simple-import-sort/imports": "warn",
            "simple-import-sort/exports": "warn",
            "unused-imports/no-unused-imports": "warn",
            "unused-imports/no-unused-vars": [
                "warn",
                {
                    vars: "all",
                    varsIgnorePattern: "^_",
                    args: "after-used",
                    argsIgnorePattern: "^_",
                },
            ],
        },
    },
];
