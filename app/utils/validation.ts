import type { ZodError } from "zod";
import { z } from "zod";

interface InputFields {
  name?: string;
  email?: string;
  password?: string;
  password_confirm?: string;
}

export const SignUpValidator = z.object({
  name: z
    .string()
    .min(6, "O nome deve ter no minimo 6 caracteres")
    .max(10, "O nome deve ter no maximo 10 caracteres"),
  email: z.string().email("Formato de email incorreto"),
  password: z.string().max(15, "A senha deve ter no maximo 15 caracteres"),
  password_confirm: z
    .string()
    .max(15, "A confirmação de senha deve ter no maximo 15 caracteres"),
});

export const SignInValidator = z.object({
  email: z.string().email("Formato de email incorreto"),
  password: z.string().max(15, "A senha deve ter no maximo 15 caracteres"),
});

export const FormValidator = <T extends z.ZodTypeAny>(
  schema: T,
  input: InputFields
): z.infer<T> => {
  return schema.parse(input);
};
export const FormValidatorErrors = (error: ZodError) => {
  return error.issues.reduce((acc, issue) => {
    //@ts-ignore
    acc[issue.path[0]] = issue.message;
    return acc;
  }, {});
};
