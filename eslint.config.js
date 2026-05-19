import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["dist", "node_modules", "coverage"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["scripts/**/*.mjs"],
    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly",
      },
    },
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: {
      react,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
      import: importPlugin,
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
    },
    rules: {
      "no-console": "error",
      "prefer-const": "error",
      "no-var": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_"
        }
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports"
        }
      ],
      "react/react-in-jsx-scope": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "import/no-unresolved": "error",
      "import/no-cycle": "error",
      "import/no-duplicates": "error",
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            {
              target: "./src/components",
              from: "./src/data",
              message:
                "components 레이어에서 data 직접 참조 금지. pages에서 data를 읽고 props로 전달하세요."
            },
            {
              target: "./src/components",
              from: "./src/pages",
              message:
                "components 레이어에서 pages 참조 금지. 공통 UI는 페이지를 알면 안 됩니다."
            },
            {
              target: "./src/data",
              from: "./src/components",
              message:
                "data 레이어에서 components 참조 금지. data는 순수 콘텐츠와 설정만 포함해야 합니다."
            },
            {
              target: "./src/data",
              from: "./src/pages",
              message:
                "data 레이어에서 pages 참조 금지. data는 화면 구현에 의존하지 마세요."
            },
            {
              target: "./src/types",
              from: "./src/data",
              message:
                "types 레이어에서 data 참조 금지. 타입은 런타임 데이터에 의존하지 않아야 합니다."
            },
            {
              target: "./src/constants",
              from: "./src/data",
              message:
                "constants 레이어에서 data 참조 금지. 상수는 콘텐츠 데이터에 의존하지 않아야 합니다."
            },
            {
              target: "./src/pages",
              from: "./src/pages",
              message:
                "page 간 직접 참조 금지. 공통 로직은 components 또는 utils로 분리하세요."
            }
          ]
        }
      ]
    }
  }
);
