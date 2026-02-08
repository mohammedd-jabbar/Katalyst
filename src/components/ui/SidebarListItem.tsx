import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { NavLink } from "react-router-dom";
import type React from "react";

type TSidebarListItem = {
  name: string;
  linkTo: string;
  isSelected?: boolean;
  Icon: React.ElementType;
};
export default function SidebarListItem({
  name,
  Icon,
  linkTo,
  isSelected,
}: TSidebarListItem) {
  return (
    <ListItemButton
      component={NavLink}
      to={`/${linkTo}`}
      // MUI + NavLink "active" styling
      sx={{
        borderRadius: 2,
        "&.active": {
          bgcolor: isSelected ? "action.selected" : "action",
        },
      }}
    >
      <ListItemIcon sx={{ minWidth: 40 }}>
        <Icon />
      </ListItemIcon>
      <ListItemText primary={name} />
    </ListItemButton>
  );
}
