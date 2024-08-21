import { FC } from "react";

export const UIBoxShadow: FC = () => {
  return (
    <section className="py-10 px-3 border m-5 w-fit h-fit">
      <div className="flex flex-col gap-10">
        <div className="flex gap-x-5">
          <div className="w-24 h-32 rounded-2xl shadow-xsmall" />
          <div className="w-24 h-32 rounded-2xl shadow-small" />
          <div className="w-24 h-32 rounded-2xl shadow-medium" />
          <div className="w-24 h-32 rounded-2xl shadow-lg" />
          <div className="w-24 h-32 rounded-2xl shadow-xlarge" />
          <div className="w-24 h-32 rounded-2xl shadow-xxlarge" />
        </div>
        <div className="flex gap-x-5">
          <div className="w-24 h-32 rounded-2xl shadow-focus-primary" />
          <div className="w-24 h-32 rounded-2xl shadow-focus-gray" />
          <div className="w-24 h-32 rounded-2xl shadow-focus-primary-light" />
          <div className="w-24 h-32 rounded-2xl shadow-focus-success" />
          <div className="w-24 h-32 rounded-2xl shadow-focus-warning" />
          <div className="w-24 h-32 rounded-2xl shadow-focus-error" />
        </div>
      </div>
    </section>
  );
};
