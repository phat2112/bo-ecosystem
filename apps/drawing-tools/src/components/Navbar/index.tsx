import { useContext, useState } from "react";
import { BsSun, BsMoon } from "react-icons/bs";
import { MdComputer } from "react-icons/md";

import { Theme, ThemeContext } from "../../App";

import "./index.scss";

const themeDropdown = [
  { label: "Light", code: "light" },
  { label: "Dark", code: "dark" },
  { label: "System", code: "system" },
];

const getThemeIcon = (code: Theme | "system") => {
  let iconRendered: React.ReactNode | null = null;
  switch (code) {
    case "dark": {
      iconRendered = <BsMoon />;
      break;
    }
    case "light": {
      iconRendered = <BsSun />;
      break;
    }

    case "system": {
      iconRendered = <MdComputer />;
      break;
    }
  }

  return iconRendered;
};

const Navbar = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const [showDropdown, setShowDropdown] = useState(false);

  const onChangeTheme = (code: Theme | "system") => {
    let newCode = code;

    if (newCode === "system") {
      newCode = window.matchMedia("(prefers-colors-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    localStorage.setItem("default_theme", newCode);
    setTheme(newCode);
    setShowDropdown(false);
  };

  return (
    <div className="navbar__wrapper">
      <h3>Online Drawing</h3>

      <button className="navbar__theme" onClick={() => setShowDropdown(true)}>
        {getThemeIcon(theme)}
      </button>

      {showDropdown && (
        <div className="navbar__dropdown">
          {themeDropdown.map((theme) => (
            <div
              onClick={() => onChangeTheme(theme.code as Theme)}
              className="navbar__dropdown__item"
            >
              {getThemeIcon(theme.code as Theme)} {theme.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Navbar;
