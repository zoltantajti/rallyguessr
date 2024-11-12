export const imageToB64 = (image) => {
    const reader = new FileReader();
    reader.onloadend = () => {
        return reader.result;
    };
    reader.readAsDataURL(image);
}