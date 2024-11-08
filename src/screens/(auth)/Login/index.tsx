"use client";
// lib
import { FC, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import ReCAPTCHA from "react-google-recaptcha";
import Cookies from "js-cookie";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";

// local
import { postAPIUserLogin } from "@/api/responses/(user)";
import { cn, COOKIE_EXPIRED_AT, COOKIE_TOKEN, encryptText, syne } from "@/lib";

// asset
import LogoFullImage from "@/images/logo/logo-full-dark.png";
import BackgroundLoginImage from "@/images/background-login.png";
import { Button, Input } from "@/components/atoms";

// type
interface FormValuesType {
  Username: string;
  Password: string;
}
const SITE_KEY = process.env.NEXT_PUBLIC_SITE_KEY as string;

export const LoginScreen: FC = () => {
  // State
  const [initialValues, setInitialValues] = useState<FormValuesType>({
    Username: "",
    Password: "",
  });
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");

  // Schema untuk validasi
  const validationSchema = Yup.object({
    Username: Yup.string().required("Username is required"),
    Password: Yup.string().required("Password is required"),
  });

  // Formik untuk menangani form

  const form = useFormik<FormValuesType>({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    validateOnChange: true,
    validateOnMount: true,
    onSubmit: async () => {
      try {
        if (token) {
          setIsLoading(true);
          const { data, status } = await postAPIUserLogin({
            CaptchaToken: token,
            Password: form.values.Password,
            Username: form.values.Username,
          });

          if (status === 200) {
            const tokenFromAPI = data.Data.RawToken;
            const expiredAt = data.Data.ExpiredAt;
            // const expiredAt = "2024-11-08T10:46:00.1327207+07:00";

            const encryptedToken = encryptText(tokenFromAPI);
            const encryptedTokenExpired = encryptText(expiredAt);

            Cookies.set(COOKIE_TOKEN, encryptedToken, {
              secure: true,
              httpOnly: false,
              sameSite: "Strict",
            });
            Cookies.set(COOKIE_EXPIRED_AT, encryptedTokenExpired, {
              secure: true,
              httpOnly: false,
              sameSite: "Strict",
            });

            if (redirectTo) {
              router.push(redirectTo);
            } else {
              router.push("/map-interaktif");
            }
          }
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <main className="h-screen w-screen bg-white relative">
      <nav className="pt-7 px-[62px] absolute z-[9999]">
        <div className="relative w-[273px] h-[59px]">
          <Image src={LogoFullImage} alt="logo" layout="fill" />
        </div>
      </nav>
      <div className="w-full h-full relative">
        <div className="relative w-full h-full">
          <Image src={BackgroundLoginImage} alt="bg-login" layout="fill" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white py-12 px-16">
          <h1
            className={cn([
              syne.className,
              "text-[40px] font-medium text-[#111827]",
            ])}
          >
            Login DSS
          </h1>
          <form className="mt-10 min-w-[375px]" onSubmit={form.handleSubmit}>
            <Input
              label="Username"
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              name="Username"
              id="Username"
              containerClassName="text-body-3"
              error={form.touched.Username && Boolean(form.errors.Username)}
              errorMessage={
                form.errors.Username && form.touched.Username
                  ? form.errors.Username
                  : undefined
              }
            />
            <Input
              label="Password"
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              name="Password"
              id="Password"
              containerClassName="text-body-3 mt-6"
              error={form.touched.Password && Boolean(form.errors.Password)}
              errorMessage={
                form.errors.Password && form.touched.Password
                  ? form.errors.Password
                  : undefined
              }
              type="password"
            />
            <div className="my-6">
              <ReCAPTCHA
                onExpired={() => {
                  setToken(null);
                }}
                sitekey={SITE_KEY}
                onChange={(e) => {
                  if (e) {
                    setToken(e);
                  }
                }}
              />
            </div>
            <Button
              type="submit"
              label="Masuk"
              variant="primary-destructive"
              className={cn([
                "w-full justify-center py-4 rounded-lg",
                "hover:bg-accent-surface hover:text-accent",
                "disabled:bg-gray-300 disabled:text-white disabled:cursor-not-allowed",
                isLoading && "cursor-wait",
              ])}
              disabled={!form.isValid || token === null || isLoading}
            />
          </form>
        </div>
      </div>
    </main>
  );
};
