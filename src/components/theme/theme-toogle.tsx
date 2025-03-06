"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // useEffect para establecer que el componente está montado solo en el cliente
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Mientras no esté montado (en SSR), renderizamos un placeholder o un estado por defecto
  if (!mounted) {
    return (
      <button className="p-2 rounded-full transition-all hover:cursor-pointer">
        <Sun size={26} className="rounded-full text-text-main" /> {/* Estado por defecto */}
      </button>
    );
  }

  // Una vez montado, renderizamos según el tema actual
  return (
    <button onClick={toggleTheme} className="p-2 rounded-full transition-all hover:cursor-pointer">
      {theme === "dark" ? (
        <Sun size={26} className="rounded-full text-text-main" />
      ) : (
        <Moon size={26} className="rounded-full text-text-main" />
      )}
    </button>
  );
}