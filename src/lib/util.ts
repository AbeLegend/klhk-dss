// lib
import { twMerge } from "tailwind-merge";
import { clsx, ClassValue } from "clsx";
import dayjs from 'dayjs';
import 'dayjs/locale/id';


dayjs.locale('id');

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error(err);
  }
};

export const formatDate = (date: string | Date, format: string) => {
  return dayjs(date).format(format);
};

export const formatNumber = (value: number): string => {
  if (isNaN(value)) return "0";

  const [integerPart, decimalPart] = value.toFixed(2).split(".");

  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  if (Number(decimalPart) === 0) {
    return formattedInteger;
  }

  return `${formattedInteger},${decimalPart}`;
}
export const generateUniqueColors = (count: number): string[] => {
  const colors: string[] = [];
  const usedColors = new Set<string>();

  // Fungsi untuk menghasilkan warna acak dalam format HEX
  const getRandomColor = (): string => {
    let color;
    do {
      // Menghasilkan warna acak dalam format HEX
      color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;
    } while (usedColors.has(color)); // Pastikan warna belum digunakan
    usedColors.add(color);
    return color;
  };

  // Menghasilkan warna unik sebanyak 'count'
  for (let i = 0; i < count; i++) {
    colors.push(getRandomColor());
  }

  return colors;
}


export const getPathFromUrl = (fullUrl: string): string => {
  const url = new URL(fullUrl);
  return url.pathname;
}

export const extractMapNumber = (url: string): string | null => {
  const match = url.match(/MapServer\/(\d+)/);
  return match ? match[1] : null;
}