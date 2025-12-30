import { z } from 'zod';

// Define la estructura y reglas de validación
export const contorno = z.object({
    name: z.string().min(4, { message: "Minimo 4 letras." })
        .max(40, { message: "Maximo 40 letras" }),

    price: z.string({ message: "El dato debe ser numero" }),

});

// Define el tipo de dato inferido desde el esquema, útil para TypeScript
//export const ContornoSchemaType = z.infer<typeof contorno>;