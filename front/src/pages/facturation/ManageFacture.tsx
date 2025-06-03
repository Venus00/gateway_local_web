import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SquareArrowOutUpRight } from "lucide-react";
export default function ManageFacture({ tenantData }: any) {
  return (
    <Card className="p-3 md:p-6 space-y-4 ">
      <CardTitle className="text-xl flex justify-between items-center ">
        <span>Gérer la facturation</span>
        <span className="text-primary cursor-pointer text-sm">Mise à jour</span>
      </CardTitle>
      <CardDescription className="text-sm text-muted-foreground"></CardDescription>
      <CardContent className="md:grid md:grid-cols-3   flex flex-col even:  p-0  space-y-1 [&>*]:py-0.5">
        <h1 className="text-muted-foreground font-medium">
          Nom de facturation
        </h1>
        <span className="col-span-2">{tenantData.name}</span>

        <h1 className="text-muted-foreground font-medium">
          Adresse de facturation
        </h1>
        <span className="col-span-2">Aucune adresse définie</span>
        <h1 className="text-muted-foreground font-medium">ID fiscal</h1>
        <span className="col-span-2">Non defini</span>
        <h1 className=" text-muted-foreground font-medium">
          Moyens de paiement
        </h1>
        <p className="col-span-2 ">
          Nous utilisons Stripe pour gérer la facturation. Vous pouvez modifier
          vos coordonnées de facturation et consulter les factures précédentes
          en cliquant sur le bouton à droite.
        </p>
      </CardContent>
      <CardFooter className="flex justify-end  p-0">
        <Button className="w-fit items-center text-white">
          <SquareArrowOutUpRight className="mr-2 h-4 w-4" />
          Gérer la facturation
        </Button>
      </CardFooter>
    </Card>
  );
}
