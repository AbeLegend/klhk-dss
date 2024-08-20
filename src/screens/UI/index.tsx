import { UIColor, UITypography } from "@/components/templates";
import { FC } from "react";

const UI: FC = () => {
  return (
    <main className="flex gap-x-10 flex-wrap">
      <UIColor />
      <UITypography />
    </main>
  );
};

export default UI;
