// No need for use but i am keeping it for the future
export const checkFilter = (body: object, filter: string) => {
    if (Object.keys(body).length > 1) {
        throw new Error(`We expected 1 or none argument but we got ${Object.keys(body).length}`);
    } else if (Object.keys(body).length !== 0 && !filter) {
        throw new Error(`Your request body is wrong! We expected filter but we got ${Object.keys(body)[0]}`);
    }
}