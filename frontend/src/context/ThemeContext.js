import React, { createContext, useState, useMemo, useContext, useEffect } from "react";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { useAuth } from "./AuthContext";
import { changeMode } from "../components/endpoints/ManagersRoutes";
import { toast } from "sonner";

const ThemeContext = createContext();

export const ThemeContextProvider = ({ children }) => {
  const { user } = useAuth();

  // Initialize mode based on the user or fallback to "light"
  const [mode, setMode] = useState(user?.user.mode || "light");

  // Keep the mode in sync with the user context
  useEffect(() => {
    if (user?.user?.mode) {
      setMode(user.user.mode);
    }
  }, [user]);

  // Toggle theme and make an API call
  const toggleTheme = async () => {
    const newMode = mode === "light" ? "dark" : "light";

    try {
      const response = await changeMode(user?.user.id, {newMode});
      toast.success(`Theme updated to ${newMode} mode`, {
        description: `Today at ${new Date().toLocaleTimeString().slice(0, 5)}`,
        duration: 3000
      })


      // Update local mode after successful API call
      setMode(newMode);
    } catch (e) {
      console.error("Failed to change theme mode:", e);
    }
  };

  // Memoize theme creation to avoid unnecessary recalculations
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "dark"
            ? {
                primary: {
                  main: "#d4af37", //90caf9
                },
                background: {
                  default: "#121212", // Dark background
                  paper: "#1d1d1d",
                },
                text: { primary: '#fff' }, // Ensure text color is readable
              }
            : {
                primary: {
                  main: "#d4af37", //1976d2
                },
                background: {
                  default: "#ffffff", // Light background
                  paper: "#f5f5f5",
                },
                text: { primary: '#000' }, // Ensure text color is readable
              }),
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                elevation: 0, // Set elevation to 0
              },
            },
          },
        },
      }),
    [mode]
  );
  

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        {/* Ensure global background styles are applied */}
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

// Hook to consume the ThemeContext
export const useThemeContext = () => useContext(ThemeContext);
