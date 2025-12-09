import { z } from 'zod';

// Define la estructura y reglas de validación
export const plato = z.object({
    name: z.string().min(4, { message: "Minimo 4 letras." })
        .max(40, { message: "Maximo 40 letras" }),

    description: z.string().min(4, { message: "Minimo 4 letras." })
        .max(200, { message: "Maximo 40 letras" }),
    
    price: z.string({message: "El dato debe ser numero"}),

    
    categoryId: z.string({message: "Debes seleccionar una categoria"}),
});

// Define el tipo de dato inferido desde el esquema, útil para TypeScript
//export const LoginSchemaType = z.infer<typeof loginSchema>;