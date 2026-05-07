export type CloudinarySignaturePayload = {
    timestamp : number,
    signature : string,
    cloudName : string,
    apiKey : string,
    folder : string,
    upload_preset : string,
}