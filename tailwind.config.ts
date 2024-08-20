import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/screens/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "rgb(var(--color-primary-default) / <alpha-value>)",
          surface: "rgb(var(--color-primary-surface) / <alpha-value>)",
          border: "rgb(var(--color-primary-border) / <alpha-value>)",
          hover: "rgb(var(--color-primary-hover) / <alpha-value>)",
          pressed: "rgb(var(--color-primary-pressed) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--color-accent-default) / <alpha-value>)",
          surface: "rgb(var(--color-accent-surface) / <alpha-value>)",
          border: "rgb(var(--color-accent-border) / <alpha-value>)",
          hover: "rgb(var(--color-accent-hover) / <alpha-value>)",
          pressed: "rgb(var(--color-accent-pressed) / <alpha-value>)",
        },
        gray: {
          50: "rgb(var(--color-gray-50) / <alpha-value>)",
          100: "rgb(var(--color-gray-100) / <alpha-value>)",
          200: "rgb(var(--color-gray-200) / <alpha-value>)",
          300: "rgb(var(--color-gray-300) / <alpha-value>)",
          400: "rgb(var(--color-gray-400) / <alpha-value>)",
          500: "rgb(var(--color-gray-500) / <alpha-value>)",
          600: "rgb(var(--color-gray-600) / <alpha-value>)",
          700: "rgb(var(--color-gray-700) / <alpha-value>)",
          800: "rgb(var(--color-gray-800) / <alpha-value>)",
          900: "rgb(var(--color-gray-900) / <alpha-value>)",
        },
        success: {
          50: "rgb(var(--color-success-50) / <alpha-value>)",
          100: "rgb(var(--color-success-100) / <alpha-value>)",
          200: "rgb(var(--color-success-200) / <alpha-value>)",
          300: "rgb(var(--color-success-300) / <alpha-value>)",
          400: "rgb(var(--color-success-400) / <alpha-value>)",
          500: "rgb(var(--color-success-500) / <alpha-value>)",
          600: "rgb(var(--color-success-600) / <alpha-value>)",
          700: "rgb(var(--color-success-700) / <alpha-value>)",
          800: "rgb(var(--color-success-800) / <alpha-value>)",
          900: "rgb(var(--color-success-900) / <alpha-value>)",
        },
        warning: {
          50: "rgb(var(--color-warning-50) / <alpha-value>)",
          100: "rgb(var(--color-warning-100) / <alpha-value>)",
          200: "rgb(var(--color-warning-200) / <alpha-value>)",
          300: "rgb(var(--color-warning-300) / <alpha-value>)",
          400: "rgb(var(--color-warning-400) / <alpha-value>)",
          500: "rgb(var(--color-warning-500) / <alpha-value>)",
          600: "rgb(var(--color-warning-600) / <alpha-value>)",
          700: "rgb(var(--color-warning-700) / <alpha-value>)",
          800: "rgb(var(--color-warning-800) / <alpha-value>)",
          900: "rgb(var(--color-warning-900) / <alpha-value>)",
        },
        error: {
          50: "rgb(var(--color-error-50) / <alpha-value>)",
          100: "rgb(var(--color-error-100) / <alpha-value>)",
          200: "rgb(var(--color-error-200) / <alpha-value>)",
          300: "rgb(var(--color-error-300) / <alpha-value>)",
          400: "rgb(var(--color-error-400) / <alpha-value>)",
          500: "rgb(var(--color-error-500) / <alpha-value>)",
          600: "rgb(var(--color-error-600) / <alpha-value>)",
          700: "rgb(var(--color-error-700) / <alpha-value>)",
          800: "rgb(var(--color-error-800) / <alpha-value>)",
          900: "rgb(var(--color-error-900) / <alpha-value>)",
        },
      },
    },
  },
  plugins: [
    plugin(function ({ addBase }) {
      addBase({
        ":root": {
          // PRIMARY
          "--color-primary-default": "11 61 11",
          "--color-primary-surface": "233 251 233",
          "--color-primary-border": "212 247 212",
          "--color-primary-hover": "23 130 23",
          "--color-primary-pressed": "8 43 8",
          // END PRIMARY

          // ACCENT
          "--color-accent-default": "241 177 19",
          "--color-accent-surface": "254 247 231",
          "--color-accent-border": "252 239 207",
          "--color-accent-hover": "246 207 111",
          "--color-accent-pressed": "197 144 12",
          // END ACCENT

          // GRAY COLOR
          "--color-gray-50": "249 250 251",
          "--color-gray-100": "243 244 246",
          "--color-gray-200": "229 231 235",
          "--color-gray-300": "209 213 219",
          "--color-gray-400": "156 163 175",
          "--color-gray-500": "107 114 128",
          "--color-gray-600": "75 85 99",
          "--color-gray-700": "55 65 81",
          "--color-gray-800": "31 41 55",
          "--color-gray-900": "17 24 39",
          // END GRAY COLOR

          // SUCCESS COLOR
          "--color-success-50": "232 245 233",
          "--color-success-100": "200 230 201",
          "--color-success-200": "165 214 167",
          "--color-success-300": "129 199 132",
          "--color-success-400": "102 187 106",
          "--color-success-500": "76 175 80",
          "--color-success-600": "67 160 71",
          "--color-success-700": "56 142 60",
          "--color-success-800": "46 125 50",
          "--color-success-900": "27 94 32",
          // END SUCCESS COLOR

          // WARNING COLOR
          "--color-warning-50": "255 248 225",
          "--color-warning-100": "255 236 179",
          "--color-warning-200": "255 224 130",
          "--color-warning-300": "255 213 79",
          "--color-warning-400": "255 202 40",
          "--color-warning-500": "255 193 7",
          "--color-warning-600": "255 179 0",
          "--color-warning-700": "255 160 0",
          "--color-warning-800": "255 143 0",
          "--color-warning-900": "255 111 0",
          // END WARNING COLOR

          // ERROR COLOR
          "--color-error-50": "252 228 236",
          "--color-error-100": "248 187 208",
          "--color-error-200": "244 143 177",
          "--color-error-300": "240 98 146",
          "--color-error-400": "236 64 122",
          "--color-error-500": "233 30 99",
          "--color-error-600": "216 27 96",
          "--color-error-700": "194 24 91",
          "--color-error-800": "173 20 87",
          "--color-error-900": "136 14 79",
          // END ERROR COLOR
        },
      });
    }),
  ],
};
export default config;
