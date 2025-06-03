import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
export default function DangerZone({ tenantData }: any) {
  return (
    <Card className="md:p-6 p-3 space-y-4 ">
      <CardTitle className="text-xl">Zone de danger</CardTitle>
      <CardDescription className="text-sm text-muted-foreground"></CardDescription>
      <CardContent className="flex flex-col gap-3 p-0 ">
        <h1 className="font-semibold">Annuler tous les abonnements</h1>
        <p className=" text-muted-foreground">
          Cette action supprimera tous les abonnements de tous les espaces de
          travail de cette organisation. Il n'est pas possible de revenir en
          arrière. Soyez sûr de vous.
        </p>
      </CardContent>
      <CardFooter className="flex justify-end  p-0">
        <Button
          variant={"destructive"}
          className="w-fit items-center bg-red-200 text-red-500 hover:bg-red-300 rounded-lg"
        >
          Annuler tous les abonnements
        </Button>
      </CardFooter>
    </Card>
  );
}
