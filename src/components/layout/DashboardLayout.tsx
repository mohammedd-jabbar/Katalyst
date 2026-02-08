import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import AppSidebar from "./Sidebar";

export const SIDEBAR_WIDTH = 280;

export default function DashboardLayout() {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex" }}>
      <AppSidebar />

      <Box
        component="main"
        sx={{
          flex: 1,
          p: 2.4,
          marginLeft: 4.5,
          // On desktop, leave space for the permanent drawer
          ml: { md: `${SIDEBAR_WIDTH}px` },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
