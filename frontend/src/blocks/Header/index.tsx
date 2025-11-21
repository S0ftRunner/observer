import { AppBar, Box, MenuItem, Typography } from "@mui/material"
import { ROUTES } from "./constants";
import { useLocation, useNavigate } from "react-router";
import { ThemeButton } from "./Components/ThemeButton";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppBar sx={{padding: '0 16px'}}>
      <Box display='flex' width={"100%"}>
        {ROUTES.map(route => (
          <MenuItem sx={{width: '100%'}} key={route.url} onClick={() => navigate(route.url)} selected={route.url === location.pathname}>
            <Typography>{route.text}</Typography>
          </MenuItem>
        ))}
        <ThemeButton />
      </Box>
    </AppBar>
  )
}