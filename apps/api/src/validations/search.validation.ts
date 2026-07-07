import z from "zod";

export const searchQuerySchema = z.object({
    q : z.string().max(50, {message : `Maximum 50 characters`})
        .regex(/^[A-Za-z0-9_#]+$/, {message : "Invalid format"})

})