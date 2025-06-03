/* eslint-disable @typescript-eslint/no-unused-vars */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { apiClient } from "@/features/api";
import { RootState } from "@/features/auth/store";
import { toast } from "@/hooks/use-toast";
import { resizeImage } from "@/lib/image-utils";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { CreateUserDto } from "./user.dto";

const variants = {
  open: {
    height: "auto",
    opacity: 1,
    padding: "1rem",
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.2,
      staggerDirection: 1,
    },
  },
  closed: {
    height: 0,
    // opacity: 0,
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};
export function UserCreateForm() {
  const { tenant } = useSelector((state: RootState) => state.auth);
  const [openForm, setOpenForm] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [newUser, setNewUser] = useState<CreateUserDto>({
    tenantId: tenant.id,
    tenantName: tenant.name,
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
    role: "user",
    isActive: true,
    isVerified: false,
    image: "",
  });
  const queryClient = useQueryClient();

  const createUser = async () => {
    try {
      await apiClient.post("/users/newUser", newUser);
      toast({
        title: "Success",
        description: "User Created Successfully",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setOpenForm(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to Create User",
        variant: "destructive",
      });
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newUser.password !== newUser.confirmpassword) {
      toast({
        title: "Error",
        description: "Password and Confirm Password do not match",
        variant: "destructive",
      });
      return;
    }
    createUser();
  };
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsProcessing(true);
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Créer une URL pour l'aperçu
        const imageUrl = URL.createObjectURL(file);
        setImageUrl(imageUrl);

        // Redimensionner l'image
        const resizedBase64 = await resizeImage(file);
        setNewUser({ ...newUser, image: resizedBase64 });
      } catch (err) {
        console.error("Error processing image:", err);
        toast({
          title: "Error",
          description: "Error processing image. Please try a smaller file.",
          variant: "destructive",
        });
        setImageUrl(undefined);
        setNewUser({ ...newUser, image: "" });
      }
    } else {
      setImageUrl(undefined);
      setNewUser({ ...newUser, image: "" });
    }
    setIsProcessing(false);
  };
  return (
    <div
      className={`flex flex-col  transition-all duration-500 ease-in-out   overflow-hidden ${
        openForm ? "gap-4" : "gap-0"
      }`}
    >
      <Button
        onClick={() => {
          setOpenForm((prev) => !prev);
          setNewUser({
            tenantId: tenant.id,
            tenantName: tenant.name,
            name: "",
            email: "",
            password: "",
            role: "user",
            isActive: true,
            isVerified: false,
            image: "",
            confirmpassword: "",
          });
          setImageUrl(undefined);
        }}
        className="w-fit dark:bg-neutral-800 dark:hover:bg-neutral-700"
        color="red"
        variant="outline"
      >
        {openForm ? "Close Form" : "Create User"}
      </Button>
      <motion.div
        variants={variants}
        initial={false}
        animate={openForm ? "open" : "closed"}
        className=" bg-white dark:bg-neutral-800 rounded-lg  shadow-md overflow-hidden "
      >
        <div className="flex flex-col  !overflow-hidden p-2">
          <h1 className="font-semibold text-lg">Create User</h1>
          <span className="italic">Create a new user</span>
        </div>
        <div className="flex flex-col gap-4 py-4 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4 p-2 ">
            <div className="grid-cols-2 grid gap-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-1">
                    <Label className="space-x-2">
                      <span>Image</span>
                      <span className="text-xs opacity-60">{"(Optional)"}</span>
                    </Label>
                    <Input
                      type="file"
                      name="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={isProcessing}
                    />
                    {isProcessing && (
                      <p className="text-xs text-blue-500">
                        Processing image...
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Max size: 300x300px (larger images will be resized)
                    </p>
                  </div>
                  {imageUrl && (
                    <Avatar className="size-20 border-2 border-primary">
                      <AvatarImage src={imageUrl} alt="User avatar" />
                      <AvatarFallback className="font-bold"></AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Name"
                    value={newUser?.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                    className="dark:border-neutral-400"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={newUser.email}
                    required
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUser.password}
                    placeholder="********"
                    required
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="confirmpassword">Confirm Password</Label>
                  <Input
                    id="confirmpassword"
                    type="password"
                    value={newUser.confirmpassword}
                    placeholder="********"
                    required
                    onChange={(e) =>
                      setNewUser({
                        ...newUser,
                        confirmpassword: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select
                    name="role"
                    value={newUser.role}
                    onValueChange={(e) => {
                      setNewUser({ ...newUser, role: e });
                    }}
                  >
                    <SelectTrigger className="dark:border-neutral-400">
                      <SelectValue placeholder="Select Admin" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-neutral-800 border dark:border-neutral-300">
                      <SelectGroup>
                        <SelectItem
                          value={"admin"}
                          className="dark:hover:bg-neutral-700"
                        >
                          Admin
                        </SelectItem>
                        <SelectItem
                          value={"user"}
                          className="dark:hover:bg-neutral-700"
                        >
                          User
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                className="w-fit mt-8"
                type="submit"
                // disabled={selectedPlan?.name !== "FREE"}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
