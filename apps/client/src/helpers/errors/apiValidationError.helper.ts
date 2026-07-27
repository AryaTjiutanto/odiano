import { type ValidationError } from "@odiano/shared";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

export const handleApiValidationError = <T extends FieldValues>(errors : ValidationError[] | null, setError : UseFormSetError<T>) => {
    if (errors) {
        Object.entries(errors).forEach(([ , field]) => {
            setError(field.path as Path<T>, {
                type: "server",
                message: field.message
            })
        })
    }
}