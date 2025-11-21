import { AppBar, Box, MenuItem, Typography } from "@mui/material"
import { ROUTES } from "./constants";
import { useLocation, useNavigate } from "react-router";
import { ThemeButton } from "./Components/ThemeButton";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <AppBar position="static">
      <Box display='flex' width={"100%"}>
        {ROUTES.map(route => (
          <MenuItem 
            sx={{width: '100%', display: 'flex', justifyContent: 'center'}} 
            key={route.url} onClick={() => navigate(route.url)} 
            selected={route.url === location.pathname}
            >
              <Typography fontWeight={700}>{route.text}</Typography>
          </MenuItem>
        ))}
        <ThemeButton />
      </Box>
    </AppBar>
  )
}