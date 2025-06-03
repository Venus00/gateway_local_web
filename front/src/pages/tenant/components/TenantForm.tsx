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
import { fetchUsers } from "../utils/actions";
import { TenantCreateDto } from "../utils/tenant.dto";

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

// export const PlanCard = ({ plan }: any) => (
//   <div className="border-2 border-primary rounded-xl p-3 flex flex-col gap-3">
//     <h3 className="flex items-center gap-2">{plan?.name}</h3>
//     <ul className="gap-2">
//       <li>Entities: {plan.specs.entities}</li>
//       <li>Devices: {plan.specs.devices}</li>
//       <li>Brokers: {plan.specs.brokers}</li>
//       <li>Users: {plan.specs.users}</li>
//       <li>Retention: {plan.specs.retention}</li>
//       <li className="flex items-center gap-1">
//         {plan.specs.features.map((f: string) => (
//           <Badge key={f} className="text-white rounded-lg">
//             {f}
//           </Badge>
//         ))}
//       </li>
//     </ul>
//   </div>
// );
export function TenantForm() {
  const { tenant } = useSelector((state: RootState) => state.auth);
  const [openForm, setOpenForm] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [newTenant, setNewTenant] = useState<TenantCreateDto>({
    name: "",
    company: "",
    phone: "",
    description: "",
    adminId: undefined,
    image: "",
  });
  const queryClient = useQueryClient();

  const { data: users } = useQuery("users", () => fetchUsers(tenant.id), {
    initialData: [],
  });

  const createTenant = async () => {
    try {
      await apiClient.post("/tenant", newTenant);
      toast({
        title: "Success",
        description: "Tenant Created Successfully",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["tenant"] });
      setOpenForm(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to Create Tenant",
        variant: "destructive",
      });
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    createTenant();
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
      <Button
        onClick={() => {
          setOpenForm((prev) => !prev);
          setNewTenant({
            name: "",
            company: "",
            phone: "",
            description: "",
            adminId: undefined,
            image: "",
          });
          setImageUrl(undefined);
        }}
        className="w-fit dark:bg-neutral-800 dark:hover:bg-neutral-700"
        color="red"
        variant="outline"
      >
        {openForm ? "Close Form" : "Create Tenant"}
      </Button>
      <motion.div
        variants={variants}
        initial={false}
        animate={openForm ? "open" : "closed"}
        className=" bg-white dark:bg-neutral-800 rounded-lg  shadow-md overflow-hidden "
      >
        <div className="flex flex-col  !overflow-hidden p-2">
          <h1 className="font-semibold text-lg">Create Tenant</h1>
          <span className="italic">Create a new tenant</span>
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
                  <Label htmlFor="name">Tenant Name</Label>
                  <Input
                    id="name"
                    placeholder="Name"
                    value={newTenant?.name}
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
                    value={newTenant.adminId}
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

                {/* <div className="flex flex-col  gap-3">
                  <Label className="">Starter Plan</Label>
                  <div className="flex  flex-row gap-3  items-center">
                    {subcsriptionPlans?.map((plan) => {
                      return (
                        <Card
                          key={plan?.name}
                          className={cn("w-full relative  cursor-pointer", {
                            "border-primary border-2 text-black bg-green-50 ":
                              selectedPlan?.name === plan?.name,
                            "dark:bg-neutral-900":
                              selectedPlan?.name !== plan?.name,
                          })}
                          onClick={() => {
                            setNewTenant({
                              ...newTenant,
                              subscriptionPlanId: `${plan.id}`,
                            });
                            setSelectedPlan(plan);
                          }}
                        >
                          {selectedPlan?.name === plan?.name && (
                            <CircleCheck className="absolute top-2 fill-primary border-primary text-white right-3" />
                          )}
                          <CardHeader className="p-3">
                            <Icon name={plan.icon} />
                          </CardHeader>
                          <CardContent className="flex flex-col gap-2">
                            <span>{plan?.name}</span>
                            <p
                              className={cn("text-sm  text-gray-300", {
                                "dark:text-gray-400":
                                  selectedPlan?.name === plan?.name,
                              })}
                            >
                              {plan.description}
                            </p>
                          </CardContent>
                          <CardDescription></CardDescription>
                        </Card>
                      );
                    })}
                  </div>
                  {selectedPlan && <PlanCard plan={selectedPlan} />}
                  {selectedPlan?.name !== "FREE" && (
                    <Link to={"/"} target="_blank">
                      <Button
                        className="w-fit rounded-lg text-white"
                        type="button"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Proceed to payement
                      </Button>
                    </Link>
                  )}
                </div> */}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                className="w-fit mt-8"
                type="submit"
                // disabled={selectedPlan?.name !== "FREE"}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Tenant
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
