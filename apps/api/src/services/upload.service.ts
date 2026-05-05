import { SignaturePayload } from "../types/signature.type"

type GenerateSignaturePayload = {
    params : {
        timestamp : number,
        upload_preset : string,
    }
}

export const generateCloudinarySignature = (payload : GenerateSignaturePayload) : SignaturePayload => {

}