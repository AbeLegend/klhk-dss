import CryptoJS from "crypto-js";

const PUBLIC_ENCRYPT_KEY = process.env.NEXT_PUBLIC_ENCRYPT_KEY as string;

export const encryptText = (value: string): string => {
  const text = CryptoJS.AES.encrypt(
    value,
    PUBLIC_ENCRYPT_KEY
  ).toString();
  return text;
}
export const decryptText = (value: string): string => {
  const dec = CryptoJS.AES.decrypt(value, PUBLIC_ENCRYPT_KEY);
  var text = dec.toString(CryptoJS.enc.Utf8);
  return text;
}