// lib
import React, { FC } from "react";
import Skeleton, { SkeletonProps } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const SkeletonLoading: FC<SkeletonProps> = ({ ...rest }) => {
  return <Skeleton {...rest} />;
};
