import * as z from "zod";

export const SignUpValidation = z.object({
  name: z.string().min(2, { message: "Too short" }),
  username: z.string().min(2, { message: "Use longer one" }),
  email: z.string().email(),
  password: z.string().min(8, { message: "Use complex password" }),
});

export const SignInValidation = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: "Use complex password" }),
});

export const PostFormValidation = z.object({
  caption: z.string().min(5).max(2200),
  file: z.custom(),
  location: z.string().min(5).max(100),
  tags: z.string().min(5).max(100),
});
