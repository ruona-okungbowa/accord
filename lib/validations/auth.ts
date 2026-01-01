import * as z from "zod";

export const SignupFormSchema = z
  .object({
    firstName: z
      .string()
      .min(1, { error: "First name is required" })
      .min(2, { error: "First name muse be at least 2 characters long." })
      .trim(),
    lastName: z
      .string()
      .min(1, { error: "Last name is required" })
      .min(2, { error: "Last name muse be at least 2 characters long." })
      .trim(),
    email: z.email({ error: "Please enter a valid email." }).trim(),
    password: z
      .string()
      .min(8, { error: "Password must be at least 8 characters long" })
      .regex(/[a-zA-Z]/, { error: "Contain at least one letter." })
      .regex(/[0-9]/, { error: "Contain at least one number" })
      .trim(),
    confirmPassword: z
      .string()
      .min(1, { error: "Please enter your password confirmation" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const LoginFormSchema = z.object({
  email: z.email({ error: "Please enter a valid email" }).trim(),
  password: z.string().min(1, { error: "Password is required" }),
});

export type SignUpFormData = z.infer<typeof SignupFormSchema>;
export type LoginFormData = z.infer<typeof LoginFormSchema>;
