import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Network from "./components/Network";
import Integration from "./components/Integration";

export function Settings() {
  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto  p-6">
      <h1 className="text-2xl font-semibold mb-6"> Integrations</h1>
      <Tabs defaultValue="integration" className="">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="integration">MQTT</TabsTrigger>
          <TabsTrigger value="network" disabled>
            LoRaWAN
          </TabsTrigger>
        </TabsList>
        <TabsContent value="integration">
          <Integration />
        </TabsContent>
        {/* <TabsContent value="network">
                    <Network />
                </TabsContent> */}
      </Tabs>
    </main>
  );
}
