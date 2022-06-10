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
    darkTheme: 'dark',
  },
}
