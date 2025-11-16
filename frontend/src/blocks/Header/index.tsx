import { Nullable } from "@/types"
import { AppBar, Link, Menu, MenuItem } from "@mui/material"
import { useState } from "react"
import { ROUTES } from "./constants";

export const Header = () => {
  const [anchorElNav, setAnchorElNav] = useState<Nullable<boolean>>(true);
  return (
    <AppBar position='static'>
      <Menu id="menu-appbar" open={Boolean(anchorElNav)} >
        {ROUTES.map(route => (
          <MenuItem key={route.url}>
            <Link href={route.url}>{route.text}</Link>
          </MenuItem>
        ))}
      </Menu>
    </AppBar>
  )
}