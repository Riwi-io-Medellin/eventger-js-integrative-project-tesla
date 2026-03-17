/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,html}"
  ],
  theme: {
    extend: {
      colors: {

        main: "#2965EB",
        sec: "#60A5FA",
        primary: "#171F30",
        secondary: "#242D42",
        focus: "#3B82F6",
        grn: "#3DA442",
        beige: "#EBB560",
        secGrn: "#599857",

        background: "#FFFFFF",
        input: "#F8FAFE",
        accent: "#E0F2FE",

        textPrimary: "#1E293B",
        textSecondary: "#64748B",
        textAccent: "#0C4A6E",

        borderSubtle: "#E2E8F0",
        neutral: "#CBD5E1",

        danger: "#EF4444"
    },
  },
},
  plugins: [],
}