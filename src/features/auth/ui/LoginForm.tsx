import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Alert, Box } from "@mui/material";
import { useSnackbar } from "notistack";

import { loginApi } from "../api/authApi";
import { useAuthStore } from "../store/useAuthStore";
import { loginSchema, type LoginFormData } from "../schemas/loginSchema";
import { env } from "../../../lib/config/env";

/**
 * Login form with Zod validation
 */
export default function LoginForm() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (data: LoginFormData) => loginApi(data.username, data.password),

    onSuccess: (data) => {
      setAuth(data);
      enqueueSnackbar("Successfully logged in!", { variant: "success" });
      navigate("/products", { replace: true });
    },

    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : "Invalid credentials or server error";

      enqueueSnackbar(message, { variant: "error" });
    },
  });

  // Form submit handler
  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const isLoading = isSubmitting || loginMutation.isPending;

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ width: "100%", maxWidth: 400 }}
      noValidate
    >
      <div className="space-y-4">
        {/* Username Field */}
        <TextField
          {...register("username")}
          fullWidth
          label="Username"
          type="text"
          autoComplete="username"
          disabled={isLoading}
          error={!!errors.username}
          helperText={errors.username?.message}
          placeholder="Enter your username"
        />

        {/* Password Field */}
        <TextField
          {...register("password")}
          fullWidth
          label="Password"
          type="password"
          autoComplete="current-password"
          disabled={isLoading}
          error={!!errors.password}
          helperText={errors.password?.message}
          placeholder="Enter your password"
        />

        {/* Submit Button */}
        <Button
          fullWidth
          type="submit"
          variant="contained"
          disabled={isLoading}
          size="large"
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>

        {/* Development Hint (remove in production) */}
        {env.dev && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Use: <strong>admin</strong> / <strong>123456</strong>
          </Alert>
        )}
      </div>
    </Box>
  );
}
