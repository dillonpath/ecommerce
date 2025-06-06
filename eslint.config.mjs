import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});


export default [
  // Inherit next.js rules
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Your custom rules
  {
    files: ["**/*.{ts,tsx}"], // Applies only to TypeScript files
    rules: {
      // Disable both base and TS-specific unused-vars rules
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
