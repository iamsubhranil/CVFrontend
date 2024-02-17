/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    backgroundImage: {
      background: "url('https://unsplash.com/photos/0tKc9vaYUAw/download')",
    },
    extend: {
      fontFamily: {
        sans: ["Nunito Sans", "sans-serif"]
      }
    },
  },
  plugins: [],
  safelist: [
    "mb-8",
    "bg-background",
    "bg-fixed",
    "bg-cover",
    "container",
    "mx-auto",
    "mb-8",
    "text-3xl",
    "font-bold",
    "text-slate-200",
    "bg-frosted-glass",
    "w-max",
    "p-3",
    "rounded-lg",
    "shadow-2xl",
    "grid",
    "grid-cols-1",
    "gap-8",
    "sm:grid-cols-2",
    "lg:grid-cols-3",
    "lg:grid-cols-4",
    "bg-frosted-glass",
    "rounded-lg",
    "p-8",
    "shadow-2xl",
    "flex",
    "flex-col",
    "ml-6",
    "list-disc",
    "mb-4",
    "text-xl",
    "font-bold",
    "text-slate-200",
    "text-gray-200",
    "rounded-lg",
    "mb-4",
  ],
};
