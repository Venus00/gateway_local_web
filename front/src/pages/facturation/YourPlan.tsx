import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Check, X } from "lucide-react";
import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { apiClient } from "@/features/api";
import { useQuery } from "react-query";
import { cn } from "@/lib/utils";

type PlantData = {
  tenantId: number;
  subscriptionPlanId: number;
  name: string;
  cost: number;
  period: string;
  nbDevices: number;
  description: string;
};
const STRIPE_KEY = import.meta.env.VITE_STRIPE_KEY;
export default function YourPlan({ tenantData }: any) {
  const [isMonthly, setIsMonthly] = React.useState(true);
  const handleSwitchChange = () => {
    setIsMonthly(!isMonthly);
    setPriceIndex((p) => (p === 0 ? 1 : 0));
  };
  const [selectedPlan, setSelectedPlan] = React.useState(null);
  const [priceIndex, setPriceIndex] = useState(0);
  const fetchSubscriptionPlan = async () => {
    try {
      console.log("Fetchin plans");

      const response = await apiClient.get("/tenant/subcsriptionPlans");
      const data = response.data
        ?.map((plan) => ({
          ...plan,
          price: JSON.parse(plan.price),
          specs: JSON.parse(plan.specs),
        }))
        .sort((a, b) => (a.id > b.id ? 1 : -1));

      setSelectedPlan(data.filter((p) => p.name === "FREE")[0]);
      return data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.log(error);

      return [];
    }
  };
  const { data: subcsriptionPlans } = useQuery(
    "subcsriptionPlans",
    () => fetchSubscriptionPlan(),
    {
      initialData: [],
    }
  );
  const makePayment = async (data: PlantData) => {
    // console.log(STRIPE_KEY);

    try {
      const stripe = await loadStripe(STRIPE_KEY);
      const session: any = await apiClient.post("stripe", {
        ...data,
      });
      console.log(session.data.id);
      const result = await stripe?.redirectToCheckout({
        sessionId: session.data.id,
      });
      if (result?.error) {
        console.log(result.error.message);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Card className="md:p-6 p-3 space-y-4 ">
      <CardTitle className="text-xl">Your Plan</CardTitle>
      <CardDescription className="text-sm text-muted-foreground">
        The new Digisense plan options are subscription plans designed for
        scaling businesses, providing a cost-effective solution with an
        inclusive device quota and a suite of powerful tools to streamline and
        enhance your IoT operations and billing.
      </CardDescription>
      <CardContent className="flex flex-col p-0">
        <h1 className="font-semibold text-xl">
          Current Plan: {tenantData.licence?.name}{" "}
        </h1>
        <div className="w-full  flex justify-end ">
          <div className="items-center gap-2 flex text-xl">
            <Label htmlFor="name">Monthly</Label>
            <Switch
              id="name"
              className="dark:border-neutral-400"
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="name">Annually (1 month free)</Label>
          </div>
        </div>
        <div className="grid xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 gap-3 mt-6">
          {subcsriptionPlans?.map((plan, index) => {
            const annuallyPrice = plan.price[priceIndex].amount * 11;

            const monthlyPrice = isMonthly
              ? plan.price[priceIndex].amount
              : (annuallyPrice / 12).toFixed(2);

            return (
              <Card
                key={index}
                className={cn(
                  "flex flex-col gap-2 p-4 ",
                  plan.name === tenantData.licence?.name && "bg-primary"
                )}
              >
                <CardTitle className="text-2xl font-semibold">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-sm">
                  {plan.description}
                </CardDescription>
                <CardContent className="flex flex-col  gap-4 p-0 mt-2">
                  <div className="flex flex-col">
                    {plan.price[priceIndex].custom ? (
                      <h1 className="text-3xl font-bold">Custom</h1>
                    ) : (
                      <p className="text-3xl font-bold">
                        {monthlyPrice} {plan.price[priceIndex].currency}{" "}
                        <span className="text-sm text-muted-foreground">
                          /{plan.price[priceIndex].billing_period}
                        </span>
                      </p>
                    )}
                    {!isMonthly && (
                      <span
                        className={`text-sm text-muted-foreground ${
                          plan.price[priceIndex].custom
                            ? "text-transparent"
                            : ""
                        }`}
                      >
                        {plan.price[priceIndex].custom
                          ? "custom plan"
                          : annuallyPrice.toFixed(2) +
                            " " +
                            plan.price[priceIndex].currency +
                            ", billed yearly."}
                      </span>
                    )}
                  </div>

                  <ul className="list-none ">
                    <li className="flex items-center gap-1.5">
                      <Check className="h-4 w-4 text-blue-500" />
                      {plan.specs.device?.title?.toString().slice(2)}
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="h-4 w-4 text-blue-500" />
                      {plan.specs.entity?.title?.toString().slice(2)}
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="h-4 w-4 text-blue-500" />
                      {plan.specs.broker?.title?.toString().slice(2)}
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="h-4 w-4 text-blue-500" />
                      {plan.specs.connection?.title?.toString().slice(2)}
                    </li>
                  </ul>
                  {plan.name !== "FREE" ? (
                    <Button
                      className="text-white"
                      onClick={() => {
                        if (plan.price[priceIndex].custom) return;
                        makePayment({
                          tenantId: tenantData.id,
                          subscriptionPlanId: plan.id,
                          name: plan.name,
                          cost: +plan.price[priceIndex].amount,
                          description: "",
                          nbDevices: 5,
                          period: plan.price[priceIndex].billing_period,
                        });
                      }}
                    >
                      {plan.price[priceIndex].custom
                        ? "Contact us"
                        : "Subscribe"}
                    </Button>
                  ) : (
                    <></>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
