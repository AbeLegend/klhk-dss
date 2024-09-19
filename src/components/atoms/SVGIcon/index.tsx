import { FC } from "react";

interface SVGIconProps {
  Component: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  width?: number;
  height?: number;
  className?: string;
}

export const SVGIcon: FC<SVGIconProps> = ({
  Component,
  width = 24,
  height = 24,
  className = "",
}) => {
  return <Component width={width} height={height} className={className} />;
};
