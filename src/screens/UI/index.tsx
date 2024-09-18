import {
  UIBoxShadow,
  UIColor,
  UIInput,
  UITextArea,
  UITypography,
} from "@/components/templates";
import { FC } from "react";

const UI: FC = () => {
  return (
    <main className="flex gap-x-10 flex-wrap">
      <UIColor />
      <UITypography />
      <UIBoxShadow />
      <UIInput />
      <UITextArea />
    </main>
  );
};

export default UI;
