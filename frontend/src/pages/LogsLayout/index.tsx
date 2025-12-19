import { Box } from "@mui/material";
import { Outlet } from "react-router";

export const LogsLayout = () => {
  return (
    <Box>
      <Outlet />
    </Box>
  );
};