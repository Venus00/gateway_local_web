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
import { updateTenantInfo } from "@/features/auth/authSlice";
import { RootState } from "@/features/auth/store";
import { toast } from "@/hooks/use-toast";
import { resizeImage } from "@/lib/image-utils";
import { Save, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { UpdateUserDto } from "./user.dto";
import { useLanguage } from "@/context/language-context";
import BreadCrumb from "@/components/breadcrumb";

export default function UserEditForm() {
  //   const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { tenant } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const { t } = useLanguage();
  console.log("location", location);
  const [imageUrl, setImageUrl] = useState<string | undefined>(
    location.state?.image
  );
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef: any = useRef(null);
  //   const device = location.state;
  const [newUser, setNewUser] = useState<UpdateUserDto>({
    id: location.state?.id,
    tenantId: location.state?.tenantId,
    tenantName: location.state?.tenantName,
    name: location.state?.name,
    email: location.state?.email,
    password: "",
    confirmpassword: "",
    role: location.state?.role,
    isActive: location.state?.isActive,
    isVerified: location.state?.isVerified,
    image: location.state?.image,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    editDevice(newUser);
  };
  const editDevice = async (data: UpdateUserDto) => {
    try {
      await apiClient.put("users/update", data);
      toast({
        title: "Success",
        description: "User Edited Successfully",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate("/settings/users");
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to Edit User",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {}, [newUser]);
  console.log(newUser);
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
  const breadcrumb = [
    { url: "/settings/users", name: t("nav.Users") },
    // { url: "/devicetype", name: t("nav.profile") },
    // { url: "/dashboards", name: linkName },
  ];
  return (
    <main
      className={`flex-1 overflow-x-hidden container mx-auto   overflow-y-auto p-6   `}
    >
      <BreadCrumb links={breadcrumb} pageTitle={t("breadcrumb.edit")} />
      <div className=" bg-white dark:bg-neutral-800 rounded-lg  overflow-hidden p-4">
        <h1 className="text-2xl font-semibold mb-6">Edit User</h1>
        <div className="flex flex-col gap-4 py-4 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4 p-2 ">
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
                    <p className="text-xs text-blue-500">Processing image...</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Max size: 300x300px (larger images will be resized)
                  </p>
                </div>
                {imageUrl && (
                  <div className="relative">
                    <Avatar className="size-20 border-2 border-primary">
                      <AvatarImage
                        src={imageUrl}
                        alt="User avatar"
                        className="object-contain"
                      />
                      <AvatarFallback className="font-bold"></AvatarFallback>
                    </Avatar>
                    <Button
                      className="absolute top-0 right-0 translate-x-1 p-0.5 rounded-full h-fit w-fit flex items-center"
                      variant={"outline"}
                      onClick={() => {
                        setImageUrl(undefined);
                        setNewUser({ ...newUser, image: "" });
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
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
            <div className="flex items-center gap-3">
              <Button className="w-fit mt-8 text-white" type="submit">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
