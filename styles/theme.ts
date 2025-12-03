export const lightTheme = {
  // Backgrounds
  background: "#f5f7fa",
  cardBackground: "#ffffff",
  inputBackground: "#ffffff",
  
  // Text
  textPrimary: "#2d3748",
  textSecondary: "#718096",
  textMuted: "#a0aec0",
  
  // Borders
  border: "#e2e8f0",
  borderLight: "#edf2f7",
  
  // Accents
  primary: "#667eea",
  primaryHover: "#5a67d8",
  gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  
  // Status colors
  success: "#48bb78",
  warning: "#ed8936",
  error: "#f56565",
  
  // Shadows
  shadow: "0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 20px rgba(0, 0, 0, 0.03)",
  shadowHover: "0 6px 20px rgba(102, 126, 234, 0.25)",
};

export const darkTheme = {
  // Backgrounds
  background: "#1a202c",
  cardBackground: "#2d3748",
  inputBackground: "#374151",
  
  // Text
  textPrimary: "#f7fafc",
  textSecondary: "#cbd5e0",
  textMuted: "#a0aec0",
  
  // Borders
  border: "#4a5568",
  borderLight: "#374151",
  
  // Accents
  primary: "#7c3aed",
  primaryHover: "#6d28d9",
  gradient: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
  
  // Status colors
  success: "#48bb78",
  warning: "#ed8936",
  error: "#f56565",
  
  // Shadows
  shadow: "0 4px 6px rgba(0, 0, 0, 0.3), 0 10px 20px rgba(0, 0, 0, 0.2)",
  shadowHover: "0 6px 20px rgba(124, 58, 237, 0.4)",
};

export type Theme = typeof lightTheme;
