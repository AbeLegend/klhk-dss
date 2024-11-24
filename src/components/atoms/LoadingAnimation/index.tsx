// lib
import { FC } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
// local
export const LoadingAnimation: FC = () => {
  return (
    <AiOutlineLoading3Quarters className="animate-spin text-4xl text-gray-400 text-center" />
  );
};
