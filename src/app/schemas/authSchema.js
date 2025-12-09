import { z } from 'zod';

// Define la estructura y reglas de validación
export const loginSchema = z.object({
  email: z.string().email({ message: "Formato de email inválido." }),
  password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres." }),
});

// Define el tipo de dato inferido desde el esquema, útil para TypeScript
//export const LoginSchemaType = z.infer<typeof loginSchema>;