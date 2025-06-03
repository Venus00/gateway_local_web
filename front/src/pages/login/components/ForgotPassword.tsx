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
import { registerUser, resetPassword } from "@/features/auth/authActions";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LOGO from "../../../assets/images/logo.svg";

export default function ForgotPassword({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

  const [data, setData] = useState<any>({
    token,
    password: "",
    confirmPassword: "",
  });
  useEffect(() => {
    if (!token) {
      console.error("Token not found in URL");
      // Redirect or show an error
    } else {
      console.log("Token extracted:", token);
      // Call your API to validate the token
    }
  }, [token]);
  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    if (data.password !== data.confirmPassword) {
      toast({
        title: "Error",
        description: "Password and Confirm Password do not match",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      const res = await dispatch(resetPassword(data));
      console.log(res);

      if (res.meta.requestStatus === "rejected") return navigate("/");
      navigate("/");

      setData({
        token: "",
        password: "",
        confirmPassword: "",
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Error",
        description: "Password reset failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-11 min-h-svh w-full items-center justify-center p-6 md:p-10 dark:bg-black ">
      <div className="w-full max-w-lg">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card>
            <CardHeader>
              <CardTitle className="flex mb-2 px-4 text-lg font-semibold tracking-tight justify-center">
                <img src={LOGO} className="w-[70%]" />
              </CardTitle>

              <CardDescription className="text-center">
                Enter new password to your account
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={onSubmit}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={data.password}
                      placeholder="********"
                      required
                      onChange={(e) =>
                        setData({ ...data, password: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="Confirm password">Confirm Password</Label>
                    </div>
                    <Input
                      id="Confirm password"
                      type="password"
                      value={data.confirmPassword}
                      placeholder="********"
                      required
                      onChange={(e) =>
                        setData({ ...data, confirmPassword: e.target.value })
                      }
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Change Password
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  back to sign in page?{" "}
                  <Link to="/" className="">
                    Sign In
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
