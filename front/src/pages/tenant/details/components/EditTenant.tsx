/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { motion } from "framer-motion";
import { Save, X } from "lucide-react";
import { useRef, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchUsers } from "../../utils/actions";
import { TenantEditDto } from "../../utils/tenant.dto";

const variants = {
  open: {
    height: "auto",
    opacity: 1,
    padding: "1rem",
    borderWidth: "1px",
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.2,
      staggerDirection: 1,
    },
  },
  closed: {
    height: 0,
    borderWidth: "0px",
    // opacity: 0,
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

export function EditTenant({ tenantData }: any) {
  const { tenant, id, role } = useSelector((state: RootState) => state.auth);
  const queryClient = useQueryClient();
  const [openForm, setOpenForm] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>(
    tenantData.image
  );
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef: any = useRef(null);
  const [newTenant, setNewTenant] = useState<TenantEditDto>({
    id: tenantData?.id,
    name: tenantData?.name,
    company: tenantData?.company,
    description: tenantData?.description,
    phone: tenantData?.phone,
    adminId: `${id}` || "",
    image: tenantData.image,
    licenceId: tenantData.licenceId,
    // subscriptionPlanId: tenantData.licence.subscriptionPlanId,
  });

  const { data: users } = useQuery("users", () => fetchUsers(tenant.id), {
    initialData: [],
  });

  const dispatch = useDispatch();
  const editTenant = async (data: TenantEditDto) => {
    try {
      await apiClient.put("tenant", data);
      toast({
        title: "Success",
        description: "Tenant Edited Successfully",
        variant: "default",
      });
      dispatch(updateTenantInfo(newTenant));
      queryClient.invalidateQueries({ queryKey: ["tenant", "tenant_details"] });
      setOpenForm(false);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to Edit Tenant",
        variant: "destructive",
      });
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    editTenant(newTenant);
  };
  // useEffect(() => {
  //   setImageUrl(tenantData.image);
  // }, [tenantData]);

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

  return (
    <div
      className={`flex flex-col  transition-all duration-500 ease-in-out   overflow-hidden ${
        openForm ? "gap-4" : "gap-0"
      }`}
    >
      {" "}
      <div className="flex items-start justify-between">
        <Button
          onClick={() => {
            setOpenForm((prev) => !prev);
          }}
          className="w-fit dark:bg-neutral-800 dark:hover:bg-neutral-700"
          color="red"
          variant="outline"
        >
          {openForm ? "Close Form" : "Edit Tenant"}
        </Button>
        <div className="flex items-center gap-3">
          {role !== "user" && (
            <Link to={`/facturation`}>
              <Badge className="flex items-center gap-2 rounded-lg bg-blue-400 hover:bg-blue-500 text-white">
                Upgrade Plan
              </Badge>
            </Link>
          )}
          <Badge className="flex items-center gap-2 rounded-lg dark:text-white">
            {tenantData.licence?.name}
          </Badge>
        </div>
      </div>
      <motion.div
        variants={variants}
        initial={false}
        animate={openForm ? "open" : "closed"}
        className={` bg-white dark:bg-neutral-800  rounded-lg shadow-md overflow-hidden ${
          openForm ? "" : ""
        }`}
      >
        <div className="flex flex-col  !overflow-hidden p-2">
          <h1 className="font-semibold text-lg">Edit Tenant</h1>
          {/* <span className="italic">Create a new tenant</span> */}
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
                      ref={fileInputRef}
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
              <div className="  space-y-4">
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
      </motion.div>
    </div>
  );
}
