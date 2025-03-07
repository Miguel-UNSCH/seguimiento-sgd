"use client";
import { signInSchema } from "@/utils/zod/schemas";
import { useState, useEffect } from "react";
import { z } from "zod";
import { loginAction } from "@/actions/auth-action";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import LoginPage from "@/components/views/login-page";

type ApiResponse = {
  message?: string;
  status?: number;
  success?: boolean;
};

function LoginContainer() {
  const { status } = useSession();
  const [resApi, setResApi] = useState<ApiResponse | undefined>(undefined);
  const router = useRouter();
  const [callbackUrl, setCallbackUrl] = useState("/seguimiento");

  useEffect(() => {
    const callbackUrlParam = new URLSearchParams(window.location.search).get("callbackUrl");
    setCallbackUrl(callbackUrlParam === "/" ? "/seguimiento" : callbackUrlParam || "/seguimiento");
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      router.push(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    const res = await loginAction(values);
    setResApi(res);

    if (res.success) {
      setResApi({ status: 200, message: "Login correcto, redirigiendo ..." });
      setTimeout(() => {
        router.push(callbackUrl);
      }, 1000);
    }
  };

  if (status === "authenticated") {
    return (
      <div className="flex-col gap-4 w-full h-screen flex items-center justify-center">
        <div className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full">
          <div className="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full"></div>
        </div>
      </div>
    );
  }

  return <LoginPage onSubmit={onSubmit} serverError={resApi?.message} status={resApi?.status} />;
}

export default LoginContainer;