// utils/normalizeString.ts
const slug = require('slug')

export const normalizeString = (s: string, options?: any): string => {
    return slug(s, options || { replacement: ' ', charmap: { '@': '@', '-': '-' } });
};
