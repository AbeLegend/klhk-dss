"use client";
// lib
import { FC, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import ReCAPTCHA from "react-google-recaptcha";
import Cookies from "js-cookie";
// import Image from "next/image";

// local
import { postAPIUserLogin } from "@/api/responses/(user)";
import { cn, COOKIE_TOKEN, encryptText } from "@/lib";
import { Input, SVGIcon } from "@/components/atoms";
// asset
import IlustrationSVG from "@/icons/ilustration-dummy.svg";
// import LogoFullImage from "@/images/logo/logo-full.png";

// type
interface FormValuesType {
  Username: string;
  Password: string;
}
const SITE_KEY = process.env.NEXT_PUBLIC_SITE_KEY as string;

export const LoginScreen: FC = () => {
  // useState
  const [initialValues, setInitialValues] = useState<FormValuesType>({
    Username: "",
    Password: "",
  });
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // schema
  const validationSchema = Yup.object({
    Username: Yup.string().required("Username is required"),
    Password: Yup.string().required("Password is required"),
  });

  // form
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
            // console.log(data.Data)

            // Enkripsi token
            const encryptedToken = encryptText(tokenFromAPI);

            // Simpan token yang telah dienkripsi di cookie
            Cookies.set(COOKIE_TOKEN, encryptedToken, {
              secure: true, // Set agar cookie hanya digunakan pada koneksi HTTPS
              httpOnly: false, // Pada client side, httpOnly tidak bisa digunakan, harus diatur di server
              sameSite: "Strict", // Set SameSite untuk menghindari CSRF
              // expires: 7, // Token berlaku selama 7 hari
            });

            // Arahkan pengguna ke halaman dashboard atau home
            window.location.href = "/dashboard";
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
    <main className="grid grid-cols-12 h-screen bg-white">
      <div className="col-span-6 flex flex-col justify-center relative">
        {/* <div className="absolute top-0 left-0">
          <div className="relative h-[59px] w-[302px] bg-black">
            <Image src={LogoFullImage} alt="logo" layout="fill" />
          </div>
        </div> */}
        <div>
          <SVGIcon
            Component={IlustrationSVG}
            width={600}
            height={300}
            className="mx-auto"
          />
        </div>
        {/* <h1 className="text-center font-medium">DSS KLHK</h1> */}
      </div>
      <div className="col-span-6 flex items-center">
        <form onSubmit={form.handleSubmit} className="w-2/3 mx-auto">
          <div className="mb-8">
            <h3 className="text-heading-5 font-bold mb-2">
              Welcome Back to DSS KLHK!
            </h3>
            <p className="text-body-3 font-medium">Login to your account</p>
          </div>
          <Input
            label="Username"
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            name="Username"
            id="Username"
            className="text-body-3"
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
            className="text-body-3"
            error={form.touched.Password && Boolean(form.errors.Password)}
            errorMessage={
              form.errors.Password && form.touched.Password
                ? form.errors.Password
                : undefined
            }
            type="password"
          />
          <div className="my-5">
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
          <button
            type="submit"
            disabled={!form.isValid || token === null || isLoading}
            className={cn([
              "bg-primary text-white px-2 py-2 rounded-md w-full",
              "hover:bg-primary-hover",
              "disabled:bg-primary-surface disabled:text-gray-500 disabled:cursor-not-allowed",
              isLoading && "cursor-wait",
            ])}
          >
            Login
          </button>
        </form>
      </div>
    </main>
  );
};