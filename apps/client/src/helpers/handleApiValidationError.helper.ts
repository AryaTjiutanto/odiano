import { type ValidationError } from "@connect/shared";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

export const handleApiValidationError = <T extends FieldValues>(errors : ValidationError[] | null, setError : UseFormSetError<T>) => {
    if (errors) {
        Object.entries(errors).forEach(([index, field]) => {
            setError(field.path as Path<T>, {
                type: "server",
                message: field.message
            })
        })
    }
}