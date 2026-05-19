import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import jsdoc from 'eslint-plugin-jsdoc';
import unusedImports from "eslint-plugin-unused-imports";

export default [
    {
        files: ["assets/**/*.ts"],
        ignores: ["temp/", "library/", "local/", "build/", "tool/", 'node_modules/**', 'packages/**', '.vscode/**'],

        languageOptions: {
            parser: tsParser,
            ecmaVersion: "latest",
            sourceType: "module",
        },
        plugins: {
            "@typescript-eslint": tsPlugin,
            prettier: prettierPlugin,
            jsdoc: jsdoc,
            "unused-imports": unusedImports,
        },
        rules: {
            "semi": ["error", "always"],
            ...prettierConfig.rules,
            "quotes": ["error", "backtick", { "avoidEscape": true }],

            // 基础 JS 规则
            'no-console': 'off', // 开发阶段允许 console
            'no-unused-vars': 'off', // 关闭原生未使用变量检查（用 TS 版本替代）
            'no-var': "warn", // 禁止使用 var，使用 let/const 替代
            // 字符串：禁止字符串与变量字符串使用+拼接(如"a" + i.toString())，强制使用模板字符串`。静态字符串如'a' + 'b'不会受此限制。
            'prefer-template': 'warn',
            'linebreak-style': 'off',  // 关闭 ESLint 的行尾检查。修复windows上换行符crlf（\r\n）与Prettier 默认使用 lf（\n）不一致导致的报错提示。
            'no-multiple-empty-lines': ['error', { max: 1 }],

            // TS 规则（@typescript-eslint 命名空间）
            // 不允许存在未使用的变量
            '@typescript-eslint/no-unused-vars': 'off',
            // 自动删除未使用的 import / 变量（支持 --fix）
            'unused-imports/no-unused-imports': 'error',
            'unused-imports/no-unused-vars': ['warn', {
                vars: 'all',
                varsIgnorePattern: '^_',
                args: 'none', // 函数参数未使用不警告
                argsIgnorePattern: '^_',
            }],
            // 命名规范
            "@typescript-eslint/naming-convention": [
                "error",
                { "selector": ["class", "interface", "enum", "typeAlias"], "format": ["PascalCase"] },
                { "selector": ["function", "method", "parameter"], "format": ["camelCase"], "leadingUnderscore": "allow" },
                {
                    "selector": "variable",
                    "modifiers": ["destructured"],
                    "format": ["camelCase", "UPPER_CASE", "PascalCase"],
                    "leadingUnderscore": "allow"
                },
                {
                    "selector": "classProperty",
                    "modifiers": ["public"],
                    "format": ["camelCase"],
                    "leadingUnderscore": "allow"
                },
                {
                    "selector": "classProperty",
                    "modifiers": ["private"],
                    "format": ["camelCase"],
                    "leadingUnderscore": "require"
                },
                {
                    "selector": "classProperty",
                    "modifiers": ["protected"],
                    "format": ["camelCase"],
                    "leadingUnderscore": "allow"
                },
                {
                    "selector": "method",
                    "format": ["camelCase"],
                    "leadingUnderscore": "allow",
                    "trailingUnderscore": "allow"
                },
                {
                    "selector": "enumMember",
                    "format": ["UPPER_CASE", "PascalCase"]
                }
            ],
            "jsdoc/require-jsdoc": [
                "error",
                {
                    "publicOnly": true,
                    "require": {
                        "ClassDeclaration": false,
                        "MethodDefinition": false,
                        "FunctionDeclaration": false,
                        "ArrowFunctionExpression": true
                    },
                }
            ],
            "jsdoc/require-description": "error",
            "jsdoc/check-alignment": "error",
            "jsdoc/check-indentation": "error",
            "prettier/prettier": ["error", { "tabWidth": 4, "useTabs": false, "endOfLine": "auto", "trailingComma": "none" }],
            "indent": ["error", 4, {
                "SwitchCase": 1,
                // 避免装饰器字段在 TS AST 下被误判为需要双倍缩进
                "ignoredNodes": ["PropertyDefinition[decorators]"]
            }], // 强制使用4个空格缩进
            "no-tabs": ["error", { "allowIndentationTabs": false }], // 禁止使用Tab，统一为4空格
            "comma-dangle": ["error", {
                arrays: "only-multiline",
                objects: "only-multiline",
                imports: "only-multiline",
                exports: "always-multiline",
                functions: "never"
            }], // 多行结构结尾逗号，函数参数禁止
            "object-curly-spacing": ["error", "always"], // 强制在对象字面量的大括号中使用一致的空格
            "array-bracket-spacing": ["error", "never"], // 禁止在数组括号内使用空格
        },
    },
];