import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RootState } from "@/features/auth/store";
import { useSelector } from "react-redux";
import { EditTenant } from "./EditTenant";
export default function TenantInfo({ fetchedTenant }: any) {
  const { role } = useSelector((state: RootState) => state.auth);
  const tenantData = {
    ...fetchedTenant,
  };

  return (
    <div className="w-full  flex flex-col gap-4 py-4">
      {fetchedTenant && role !== "user" ? (
        <div className="flex flex-col  gap-3 ">
          <EditTenant tenantData={tenantData} />
        </div>
      ) : null}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Image Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Tenant Image</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            {fetchedTenant.image ? (
              <div className="relative  w-full h-64 rounded-md overflow-hidden">
                <img
                  src={fetchedTenant.image}
                  alt={`Image of ${fetchedTenant.id || "tenant"}`}
                  className="object-contain w-full h-full bg-transparent"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center w-full h-64 bg-muted rounded-md ovherflow-hidden">
                <p className="text-muted-foreground truncate">
                  No image available
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Details Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Tenant Details</CardTitle>
            <CardDescription>
              Tenant specifications and information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1 border-b pb-2">
                <dt className="text-sm font-medium text-muted-foreground capitalize">
                  Name
                </dt>
                <dd className="text-lg font-medium">
                  {fetchedTenant.name || "N/A"}
                </dd>
              </div>
              <div className="space-y-1 border-b pb-2">
                {" "}
                <dt className="text-sm font-medium text-muted-foreground capitalize">
                  Company
                </dt>
                <dd className="text-lg font-medium">
                  {fetchedTenant.company || "N/A"}
                </dd>
              </div>
              <div className="space-y-1 border-b pb-2">
                <dt className="text-sm font-medium text-muted-foreground capitalize">
                  Admin
                </dt>
                <dd className="text-lg font-medium">
                  {fetchedTenant.admin?.email || "N/A"}
                </dd>
              </div>
              <div className="space-y-1 border-b pb-2">
                <dt className="text-sm font-medium text-muted-foreground capitalize">
                  Phone
                </dt>
                <dd className="text-lg font-medium">
                  {fetchedTenant.phone || "N/A"}
                </dd>
              </div>
              <div className="space-y-1 border-b pb-2">
                <dt className="text-sm font-medium text-muted-foreground capitalize">
                  Description
                </dt>
                <dd className="text-lg font-medium">
                  {fetchedTenant.description || "N/A"}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
