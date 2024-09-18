"use client";
// lib
import { FC, useState } from "react";
// local
import { TextArea } from "@/components/atoms";

export const UITextArea: FC = () => {
  const [text, setText] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };
  return (
    <section>
      <TextArea
        label="Tes"
        // error={true}
        // errorMessage="error msg"
        description={"Desription"}
        placeholder="Placeholder"
        counter={true}
        maxLength={256}
        value={text}
        onChange={handleChange}
      />
    </section>
  );
};
