import bcrypt from 'bcryptjs';

export function generateRandomString(size: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charsSize = chars.length;

    let randomString = '';

    for (let c = 0; c < size; c++) {
        const index = Math.floor(Math.random() * charsSize);
        randomString += chars[index];
    }

    return randomString;
}

export function textToHash(text: string): string {
    return bcrypt.hashSync(text, 10);
}

export function paginate(limit: number, page: number) {
    const invalidLimit = (limit < 0 || limit > 100);
    const invalidPage = (page <= 0);

    const perPage = invalidLimit ? 50 : Math.floor(limit);
    const page_ = invalidPage ? 0 : Math.floor(page) - 1;

    const offset = perPage * page_;

    return { perPage, offset }
}