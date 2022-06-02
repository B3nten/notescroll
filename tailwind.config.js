// function withOpacityValue(variable) {
//   return ({ opacityValue }) => {
//     if (opacityValue === undefined) {
//       return `hsl(var(${variable}))`
//     }
//     return `hsl(var(${variable}) / ${opacityValue})`
//   }
// }

module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'heading': 'var(--heading-font)',
        'body': 'var(--body-font)'
      },
      colors: {

      },
    },
  },

  plugins: [require("daisyui")],

  daisyui: {
    base: true,
    darkTheme:'default',
    themes: [
      {
        default: {
          primary: "#ef9995",
          "primary-content": "#282425",
          secondary: "#a4cbb4",
          "secondary-content": "#282425",
          accent: "#ebdc99",
          "accent-content": "#282425",
          neutral: "#7d7259",
          "neutral-content": "#e4d8b4",
          "base-100": "#e4d8b4",
          "base-200": "#d2c59d",
          "base-300": "#c6b386",
          "base-content": "#282425",
          "info": "#2563eb",
          "success": "#16a34a",
          "warning": "#d97706",
          "error": "#dc2626",
          "--rounded-box": "0.4rem",
          "--rounded-btn": "0.4rem",
          "--rounded-badge": "0.4rem",
        },
      },
      'dark',
      'lemonade',
      'autumn',
      'retro',
    ],
  },
}
