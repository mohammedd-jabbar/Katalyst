/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuthStore } from "../../features/auth/store/useAuthStore";
import { SIDEBAR_WIDTH } from "./DashboardLayout";
import SidebarListItem from "../ui/SidebarListItem";

export default function AppSidebar() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const logout = useAuthStore((s: any) => s.logout);
  const nav = useNavigate();
  const location = useLocation();

  // Close mobile drawer on route change
  React.useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Hard Coded User badge */}
      <Box sx={{ p: 2 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar sx={{ width: 40, height: 40 }}>M</Avatar>

          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography fontSize={11} variant="subtitle2" noWrap>
              Super Admin
            </Typography>
            Mohammed
          </Box>
        </Stack>
      </Box>

      <Divider />

      {/* Nav */}
      <List sx={{ px: 1, py: 1 }}>
        <SidebarListItem
          Icon={Inventory2OutlinedIcon}
          linkTo="products"
          name="Products"
          isSelected
        />
      </List>

      <Box sx={{ flex: 1 }} />

      <Divider />

      {/* Logout */}
      <Box sx={{ p: 1.5 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<LogoutOutlinedIcon />}
          onClick={() => {
            logout();
            nav("/login", { replace: true });
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile top-left menu button (only on small screens) */}
      {!isMdUp && (
        <IconButton
          onClick={() => setMobileOpen(true)}
          sx={{
            position: "fixed",
            top: 12,
            left: 12,
            zIndex: theme.zIndex.appBar + 1,
          }}
          aria-label="open sidebar"
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Mobile Drawer */}
      {!isMdUp && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": { width: SIDEBAR_WIDTH },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Desktop Drawer */}
      {isMdUp && (
        <Drawer
          variant="permanent"
          open
          sx={{
            "& .MuiDrawer-paper": {
              width: SIDEBAR_WIDTH,
              boxSizing: "border-box",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
}
