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

export const formatNumber = (value: any): string => {
  // Cek apakah value dapat dikonversi menjadi angka
  const numberValue = Number(value);

  // Jika value tidak valid sebagai angka, kembalikan input asli
  if (isNaN(numberValue)) return value;

  // Pecah menjadi bagian integer dan desimal, dengan pembulatan 2 desimal
  const [integerPart, decimalPart] = numberValue.toFixed(2).split(".");

  // Format bagian integer dengan pemisah ribuan
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // Jika desimal adalah 0, kembalikan hanya bagian integer
  return decimalPart === "00" ? formattedInteger : `${formattedInteger},${decimalPart}`;
};

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

export const getUrlIdentifier = (url: string): string => {
  if (url.includes("geoportal.menlhk.go.id")) {
    return "klhk-geoportal";
  } else if (url.includes("nfms.menlhk.go.id")) {
    return "klhk-nfms";
  } else {
    return "klhk-sigap";
  }
}

export const removeUrlEndingNumber = (url: string): string => {
  return url.replace(/\/MapServer\/\d+$/, "/MapServer");
}

export const extractMapNumber = (url: string): string | null => {
  const match = url.match(/MapServer\/(\d+)/);
  return match ? match[1] : null;
}

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
