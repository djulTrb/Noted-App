/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "selector",
  mode: "aot",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        monofont: "monofont",

        sourceSans_bl: "sourceSans_bl",
        sourceSans_bold: "sourceSans_bold",
        sourceSans_reg: "sourceSans_reg",
        sourceSans_li: "sourceSans_li",

        lora_bold: "lora_bold",
        lora_sb: "lora_sb",
        lora_reg: "lora_reg",
        lora_med: "lora_med",

        purity: "Purity",
      },
      screens: {
        xxxs: "320px",
        xxs: "420px",
        xs: "520px",
        md_to_lg: "850px",
      },
      keyframes: {
        spining: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(-360deg)" },
        },

        moveLeft: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-90%)" },
        },
      },
      animation: {
        spining: "spining 12s linear infinite",
        spining2: "spining 20s linear infinite",
        leftMove: "moveLeft  ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
