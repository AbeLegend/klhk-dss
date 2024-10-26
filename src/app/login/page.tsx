// lib
import React, { FC } from "react";
import { Suspense } from "react";
// local
import { LoginScreen } from "@/screens";

const Login: FC = () => {
  return (
    <Suspense fallback={null}>
      <LoginScreen />
    </Suspense>
  );
};

export default Login;
