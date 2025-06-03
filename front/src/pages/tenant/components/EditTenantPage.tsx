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
import { TenantEditDto } from "../utils/tenant.dto";
import { fetchUsers } from "../utils/actions";
import { useLanguage } from "@/context/language-context";
import BreadCrumb from "@/components/breadcrumb";

export default function EditTenantPage() {
  //   const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  const { tenant } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const [imageUrl, setImageUrl] = useState<string | undefined>(
    location.state?.image
  );
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef: any = useRef(null);
  //   const device = location.state;
  const [newTenant, setNewTenant] = useState<TenantEditDto>({
    id: location.state?.id,
    name: location.state?.name,
    company: location.state?.company,
    description: location.state?.description,
    phone: location.state?.phone,
    adminId: location.state?.adminId,
    image: location.state?.image,
    licenceId: location.state?.licenceId,
  });

  const { data: users } = useQuery("users", () => fetchUsers(tenant.id), {
    initialData: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    editDevice(newTenant);
  };
  const editDevice = async (data: TenantEditDto) => {
    try {
      await apiClient.put("tenant", data);
      toast({
        title: "Success",
        description: "Tenant Edited Successfully",
        variant: "default",
      });
      dispatch(updateTenantInfo(newTenant));
      queryClient.invalidateQueries({ queryKey: ["tenant"] });
      navigate("/tenant");
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to Edit Tenant",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {}, [newTenant]);
  console.log(newTenant);
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
        setNewTenant({ ...newTenant, image: resizedBase64 });
      } catch (err) {
        console.error("Error processing image:", err);
        toast({
          title: "Error",
          description: "Error processing image. Please try a smaller file.",
          variant: "destructive",
        });
        setImageUrl(undefined);

        setNewTenant({ ...newTenant, image: "" });
      }
    } else {
      setImageUrl(undefined);

      setNewTenant({ ...newTenant, image: "" });
    }
    setIsProcessing(false);
  };
  const breadcrumb = [
    { url: "/tenant", name: t("nav.tenant") },
    // { url: "/devicetype", name: t("nav.profile") },
    // { url: "/dashboards", name: linkName },
  ];
  return (
    <main
      className={`flex-1 overflow-x-hidden container mx-auto p-6  overflow-y-auto    `}
    >
      <BreadCrumb links={breadcrumb} pageTitle={t("breadcrumb.edit")} />
      <div className=" bg-white dark:bg-neutral-800 rounded-lg  overflow-hidden p-4">
        <h1 className="text-2xl font-semibold mb-6">Edit Tenant</h1>
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
                          setNewTenant({ ...newTenant, image: "" });
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
                  <Label htmlFor="name">Tenant Name</Label>
                  <Input
                    id="name"
                    placeholder="Name"
                    value={newTenant.name}
                    onChange={(e) =>
                      setNewTenant({ ...newTenant, name: e.target.value })
                    }
                    className="dark:border-neutral-400"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="company">Tenant Company</Label>
                  <Input
                    id="company"
                    placeholder="Company"
                    value={newTenant.company}
                    onChange={(e) =>
                      setNewTenant({ ...newTenant, company: e.target.value })
                    }
                    className="dark:border-neutral-400"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Tenant Phone</Label>
                  <Input
                    id="phone"
                    placeholder="+212"
                    type="number"
                    value={newTenant.phone}
                    onChange={(e) =>
                      setNewTenant({ ...newTenant, phone: e.target.value })
                    }
                    className="dark:border-neutral-400"
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="">
                    Description
                  </Label>
                  <Textarea
                    name="description"
                    placeholder="Enter product description"
                    className="dark:border-neutral-400"
                    value={newTenant.description}
                    onChange={(e) =>
                      setNewTenant({
                        ...newTenant,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="admin">Admin</Label>
                  <Select
                    name="admin"
                    value={newTenant.adminId?.toString()}
                    onValueChange={(e) => {
                      setNewTenant({ ...newTenant, adminId: e });
                    }}
                  >
                    <SelectTrigger className="dark:border-neutral-400">
                      <SelectValue placeholder="Select Admin" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-neutral-800 border dark:border-neutral-300">
                      <SelectGroup>
                        {users
                          ? users.map(
                              (
                                user: { id: number; email: string },
                                key: number
                              ) => {
                                return (
                                  <SelectItem
                                    key={key}
                                    value={user.id.toString()}
                                    className="dark:hover:bg-neutral-700"
                                  >
                                    {user.email}
                                  </SelectItem>
                                );
                              }
                            )
                          : null}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button className="w-fit mt-8 text-white" type="submit">
                <Save className="h-4 w-4 mr-2" />
                Save Change
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
