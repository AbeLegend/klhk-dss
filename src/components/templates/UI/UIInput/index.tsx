import { Input } from "@/components/atoms";
import { FC } from "react";

export const UIInput: FC = () => {
  return (
    <section>
      <Input
        label="Tes"
        error={true}
        errorMessage="error msg"
        description={""}
        placeholder="Placeholder"
      />
    </section>
  );
};
