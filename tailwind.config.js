/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

const generateColorClass = (variable) => {
  return ({ opacityValue }) =>
    opacityValue
      ? `rgba(var(--${variable}), ${opacityValue})`
      : `rgb(var(--${variable}))`;
};

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {
      textShadow: {
        sm: "0 1px 2px var(--tw-shadow-color)",
        DEFAULT: "0 2px 4px var(--tw-shadow-color)",
        lg: "0 8px 16px var(--tw-shadow-color)",
      },
      colors: {
        body: {
          950: generateColorClass("body-950"),
          940: generateColorClass("body-940"), //nav color
          900: generateColorClass("body-900"),
          800: generateColorClass("body-800"),
          700: generateColorClass("body-700"),
          600: generateColorClass("body-600"),
          500: generateColorClass("body-500"),
          400: generateColorClass("body-400"),
          300: generateColorClass("body-300"),
          200: generateColorClass("body-200"),
          100: generateColorClass("body-100"),
          50: generateColorClass("body-50"),
        },

        primary: {
          950: generateColorClass("primary-950"),
          900: generateColorClass("primary-900"),
          800: generateColorClass("primary-800"),
          700: generateColorClass("primary-700"),
          600: generateColorClass("primary-600"),
          500: generateColorClass("primary-500"),
          400: generateColorClass("primary-400"),
          300: generateColorClass("primary-300"),
          200: generateColorClass("primary-200"),
          100: generateColorClass("primary-100"),
          50: generateColorClass("primary-50"),
        },

        error: generateColorClass("error"),

        "select-bg": generateColorClass("select-bg"),
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          '"Noto Sans"',
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
      },
    },
    screens: {
      xs: "360px",
      ms: "460px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    fontSize: {
      "2xs": ["0.625rem", { lineHeight: "0.75rem" }],
      xs: ["0.75rem", { lineHeight: "1rem" }],
      sm: ["0.875rem", { lineHeight: "1.25rem" }],
      base: ["1rem", { lineHeight: "1.5rem" }],
      lg: ["1.125rem", { lineHeight: "1.75rem" }],
      xl: ["1.25rem", { lineHeight: "1.75rem" }],
      "2xl": ["1.5rem", { lineHeight: "2rem" }],
      "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
      "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
      "5xl": ["3rem", { lineHeight: "1" }],
      "6xl": ["3.75rem", { lineHeight: "1" }],
      "7xl": ["4.5rem", { lineHeight: "1" }],
      "8xl": ["6rem", { lineHeight: "1" }],
      "9xl": ["8rem", { lineHeight: "1" }],
    },
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          "text-shadow": (value) => ({
            textShadow: value,
          }),
        },
        { values: theme("textShadow") },
      );
    }),
    // require('@tailwindcss/forms')
  ],
};
