import { createContext, useState, Dispatch, SetStateAction } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage from "src/screens/Homepage";

export type Theme = "light" | "dark";

export const ThemeContext = createContext<{
  theme: Theme;
  setTheme: Dispatch<SetStateAction<Theme>>;
}>(undefined!);

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
]);

const isBrowserDefaultDark = () =>
  window.matchMedia("(prefers-colors-scheme: dark)").matches;

function App() {
  const getDefaultTheme = () => {
    const localTheme = localStorage.getItem("default-item") as Theme;
    const browserDefault: Theme = isBrowserDefaultDark() ? "dark" : "light";

    return localTheme || browserDefault;
  };
  const [theme, setTheme] = useState<Theme>(getDefaultTheme());
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className={theme}>
        <RouterProvider router={router} />
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
