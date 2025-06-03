/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPassword, loginUser } from "@/features/auth/authActions";
import { cn } from "@/lib/utils";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import LOGO from "../../../assets/images/logo.svg";

export default function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isforgotPassword, setIsForgotPassword] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
    try {
      await dispatch(loginUser({ email, password }));
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }
  async function onSubmitForgotPassword(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
    try {
      setShowMessage(true);
      await dispatch(forgotPassword({ email }));
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    setShowMessage(false);
  }, [email]);

  return (
    <div className={cn("flex flex-col  gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="flex mb-2 px-4 text-lg font-semibold tracking-tight justify-center">
            <img src={LOGO} />
          </CardTitle>
          {/* <CardTitle className="text-2xl">DigiSense</CardTitle> */}
          <CardDescription className="text-center">
            Enter your email below to{" "}
            {isforgotPassword ? "reset your password" : "login to your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isforgotPassword ? (
            <form onSubmit={onSubmitForgotPassword}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {showMessage && (
                  <CardDescription className="text-center">
                    If an account exists, a reset link was sent
                  </CardDescription>
                )}
                <Button type="submit" className="w-full">
                  Send Email
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                back to sign in page{" "}
                <Button
                  type="button"
                  variant={"link"}
                  onClick={() => {
                    setIsForgotPassword(false);
                  }}
                  className="text-primary underline h-fit py-0"
                >
                  Sign In
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={onSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center ">
                    <Label htmlFor="password">Password</Label>
                    <Button
                      type="button"
                      variant={"link"}
                      onClick={(e) => {
                        e.preventDefault();
                        setIsForgotPassword(true);
                      }}
                      className="ml-auto !p-0 h-fit inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </Button>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="text-primary underline">
                  Sign up
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
