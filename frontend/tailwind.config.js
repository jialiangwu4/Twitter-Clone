import daisyui from "daisyui";
import themes from "daisyui/src/theming/themes";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      "light",
      {
        dark: {
          ...themes["dark"],
          primary: "gray",
          secondary: "#636C78",
        },
      },
      "dim",
    ],
  },
};
