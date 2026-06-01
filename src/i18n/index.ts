import de from './de';
import en from './en';

export const translations = { de, en };
export type Language = keyof typeof translations;
