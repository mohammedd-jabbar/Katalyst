import { Box, Card, CardContent, Typography } from "@mui/material";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        p: 2,
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 450 }}>
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Katalyst Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to manage your products
            </Typography>
          </Box>

          {/* Form */}
          <LoginForm />
        </CardContent>
      </Card>
    </Box>
  );
}
