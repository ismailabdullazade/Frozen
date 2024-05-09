export function searchParams (string) {
    const items = string.replace("?", "").split("&");
    const obj = {};

    items.forEach(str => {
        const couple = str.split("=");
        obj[couple[0]] = couple[1];
    });

    return obj;
}