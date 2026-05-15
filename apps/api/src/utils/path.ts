export const removeTemp = (path : string) => {
    return path.replace(/^temp\//, "");
}