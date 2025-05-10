const THEME_KEY = "weatherAppTheme";

export const getCurrentTheme = () => {
  return localStorage.getItem(THEME_KEY) || "light";
};

export default function ColorTheme(isDark) {
  // Set theme in localStorage
  localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");

  // Apply theme to document
  document.documentElement.setAttribute(
    "data-theme",
    isDark ? "dark" : "light"
  );

  // Add/remove dark overlay class
  if (isDark) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
}
