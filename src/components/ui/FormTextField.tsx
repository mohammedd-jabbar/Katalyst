import { TextField, type TextFieldProps } from "@mui/material";
import { useFormContext, Controller } from "react-hook-form";

type FormTextFieldProps = {
  name: string;
} & Omit<TextFieldProps, "name" | "error" | "helperText">;

export default function FormTextField({ name, ...props }: FormTextFieldProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          {...props}
          error={!!error}
          helperText={error?.message}
        />
      )}
    />
  );
}
