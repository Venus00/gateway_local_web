import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { registerUser } from "@/features/auth/authActions";
import { toast } from "@/hooks/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { set } from "date-fns";
import LOGO from "../../../assets/images/logo.svg";

const cases = [
  "Monitoring",
  "Data Collection",
  "Data Analysis",
  "Data Visualization",
  "Data Storage",
  "Data Processing",
  "Data Management",
  "Data Integration",
  "Data Sharing",
  "Other",
];

export default function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [casesSelected, setCasesSelected] = useState<string[]>([]);
  const [data, setData] = useState<any>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    tenantName: "",
  });
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Password and Confirm Password do not match",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      const res = await dispatch(registerUser(data));
      if (res.meta.requestStatus === "rejected") return console.log("Error");
      setData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        tenantName: "",
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Error",
        description: "Registration failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="flex mb-2 px-4 text-lg font-semibold tracking-tight justify-center">
            <img src={LOGO} className="w-[70%]" />
          </CardTitle>
          <CardTitle className="text-2xl">Create account</CardTitle>
          <CardDescription>
            Enter your informations to create your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Name"
                  value={data.name}
                  required
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={data.email}
                  required
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tenantName">Workspace Name</Label>
                <Input
                  id="tenantName"
                  placeholder="workspace name"
                  value={data.tenantName}
                  required
                  onChange={(e) =>
                    setData({ ...data, tenantName: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tenantName">Project type</Label>
                <RadioGroup
                  // value={isUrl ? "url" : "lucid"}
                  // onValueChange={(value) => {
                  //   setIsUrl(value === "url");
                  //   if (value === "url") setIcon("");
                  // }}
                  className="flex items-center"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="enterprise" id="enterprise" />
                    <Label htmlFor="enterprise">Enterprise</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="personal" id="personal" />
                    <Label htmlFor="personal">Personal-project</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Application Cases</Label>
                <div className="grid grid-cols-2 gap-2">
                  {cases.map((item) => {
                    return (
                      <div key={item} className="flex items-center space-x-2">
                        <Checkbox
                          value={item}
                          id={item}
                          onClick={() => {
                            setCasesSelected((prev) => {
                              if (prev.includes(item)) {
                                return prev.filter((i) => i !== item);
                              } else {
                                return [...prev, item];
                              }
                            });
                          }}
                        />
                        <Label htmlFor={item}>{item}</Label>
                      </div>
                    );
                  })}
                </div>
                {casesSelected.includes("Other") && (
                  <div className="mt-2 grid gap-2">
                    <Label htmlFor="otherCase">
                      Other case of using the application
                    </Label>
                    <Input
                      id="otherCase"
                      placeholder=""
                      className="x"
                      // value={email}
                      // onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                )}
              </div>
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
                Create account
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to="/" className="">
                Sign In
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
