import { IconButton } from "@mui/material";
import { useContext, useState } from "react";
import { ThemeModeContext } from "theme";
import { AnimatePresence, motion } from 'framer-motion';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
export const ThemeButton = () => {
  const [mode, setMode] = useContext(ThemeModeContext);
  const [isDarkMode, setIsDarkMode] = useState('dark' === mode);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    setMode(isDarkMode ? 'light' : 'dark');
  };

  return (
    <IconButton sx={{width: 40}} onClick={toggleTheme}>
      <AnimatePresence initial={false}>
        <>
          <motion.div
            key={isDarkMode ? 'dark-icon' : 'light-icon'}
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: isDarkMode ? -30 : 30, opacity: 0 }}
            exit={{ y: isDarkMode ? 30 : -30, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ position: 'absolute', width: '1em', height: '1em' }}
          >
            {isDarkMode ? <LightModeIcon /> : <DarkModeIcon /> }
          </motion.div>

          <motion.div
            key={isDarkMode ? 'light-icon' : 'dark-icon'}
            initial={{ y: isDarkMode ? 30 : -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ position: 'absolute', width: '1em', height: '1em' }}
          >
            {isDarkMode ? <DarkModeIcon /> : <LightModeIcon /> }
          </motion.div>
        </>
      </AnimatePresence>
    </IconButton>
  );
};
