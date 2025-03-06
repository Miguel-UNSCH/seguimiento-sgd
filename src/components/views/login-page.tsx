"use client";

import { useEffect, useState } from "react";
import { Mail, Lock, Eye, EyeOff, OctagonAlert } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "../theme/theme-toogle";
import Image from "next/image";
import { signInSchema } from "@/utils/zod/schemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Alert, AlertDescription } from "../ui/alert";

type SignInFormValues = z.infer<typeof signInSchema>;

export default function LoginPage({
  onSubmit,
  serverError,
  status,
}: {
  onSubmit: (values: SignInFormValues) => void;
  serverError?: string;
  status?: number;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showServerError, setShowServerError] = useState(!!serverError);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleSubmit = async (values: SignInFormValues) => {
    setIsSubmitting(true);
    await onSubmit(values);
    setIsSubmitting(false);
    setShowServerError(true);
  };

  useEffect(() => {
    const subscription = form.watch(() => {
      if (showServerError) {
        setShowServerError(false);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, showServerError]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden bg-background">
      <div className="relative w-full max-w-6xl flex items-center justify-center">
        <div className="absolute left-0 top-0 w-72 h-72 rounded-full opacity-50 -translate-x-1/2 -translate-y-1/4 bg-[#F49BA1]"></div>
        <div className="absolute right-0 bottom-0 w-96 h-96 rounded-full opacity-50 translate-x-1/3 translate-y-1/4 bg-[#F49BA1]"></div>
        <div className="rounded-lg shadow-lg w-full max-w-md z-10 p-8 bg-card">
          <div className="flex justify-between mb-6">
            <div className="flex items-center">
              <Image
                src={"/images/logo.png"}
                width={30}
                height={30}
                alt="Logo"
              />
              <span className="ml-2 text-2xl font-bold text-foreground">
                GORE Ayacucho
              </span>
            </div>
            <ThemeToggle />
          </div>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-2 text-foreground">
              Seguimiento de documentos SGD
            </h1>
            <p className="text-sm text-muted-foreground">
              Módulo de seguimiento de documentos del SGD.
            </p>
          </div>

          {showServerError && (
            <Alert
              variant={status === 200 ? "default" : "destructive"}
              className="mb-6 text-red-400"
            >
              <AlertDescription
                className={`flex items-center gap-4 ${
                  status === 200 ? "text-green-400" : ""
                }`}
              >
                <OctagonAlert />
                <span>{serverError}</span>
              </AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 top-4 h-fit flex items-center pl-3 pointer-events-none text-muted-foreground">
                    <Mail size={18} />
                  </div>
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            placeholder="87654321"
                            {...field}
                            className="pl-10 h-12 bg-input text-foreground"
                          />
                        </FormControl>
                        <FormMessage className="text-end text-destructive" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 top-4 h-fit flex items-center pl-3 pointer-events-none text-muted-foreground">
                    <Lock size={18} />
                  </div>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="**************"
                            className="pl-10 pr-10 h-12 bg-input text-foreground"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-end text-destructive" />
                      </FormItem>
                    )}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 top-4 h-fit flex items-center pr-3 text-muted-foreground hover:cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-10 font-semibold bg-primary text-primary-foreground hover:cursor-pointer hover:bg-primary/70"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
