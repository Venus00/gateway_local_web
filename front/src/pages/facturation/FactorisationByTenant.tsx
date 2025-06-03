import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/features/api";
import { RootState } from "@/features/auth/store";
import { toast } from "@/hooks/use-toast";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TenantEditDto } from "../tenant/utils/tenant.dto";
import { updateTenantInfo } from "@/features/auth/authSlice";
export default function FactorisationByTenant({ tenantData }: any) {
  const { id } = useSelector((state: RootState) => state.auth);

  const [newTenant, setNewTenant] = useState<TenantEditDto>({
    id: tenantData?.id,
    name: tenantData?.name,
    company: tenantData?.company,
    description: tenantData?.description,
    phone: tenantData?.phone,
    adminId: `${id}` || "",
    image: tenantData.image,
    licenceId: tenantData.licenceId,
  });
  useEffect(() => {
    setNewTenant({
      id: tenantData?.id,
      name: tenantData?.name,
      company: tenantData?.company,
      description: tenantData?.description,
      phone: tenantData?.phone,
      adminId: `${id}` || "",
      image: tenantData.image,
      licenceId: tenantData.licenceId,
    });
  }, [tenantData, id]);
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
    console.log(newTenant);

    editTenant(newTenant);
  };
  return (
    <Card className="p-6 space-y-3 ">
      <CardTitle className="text-xl">Facturation par organisation</CardTitle>
      <CardDescription className="text-sm text-muted-foreground"></CardDescription>
      <CardContent className="flex flex-col p-0">
        <form onSubmit={handleSubmit} className="flex w-full  items-end gap-3">
          <div className="w-full">
            <Label htmlFor="name">Nom d'affichage de l'organisation</Label>
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
          <div className="flex items-center gap-3">
            <Button className="w-fit text-white" type="submit">
              Save Change
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
