import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { RootState } from "@/features/auth/store";
import { apiClient } from "@/features/api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CardDropdownMenu } from "./components/DropDown";
import {
  CreditCard,
  Cpu,
  Plus,
  Loader2,
  BookPlus,
  Megaphone,
  Search,
  X,
  Upload,
  UploadCloud,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast"; 
import type { IoTCard } from "@/lib/types";

export default function Flows() {
  const { tenant } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [cards, setCards] = useState<IoTCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groups, setGroups] = useState<Record<string, IoTCard[]>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importCode, setImportCode] = useState(""); 

  const fetchData = async () => {
    try {
      console.log("Fetching data...");
      setLoading(true);
      const response = await apiClient.get("workflow", {
        params: {
          tenantId: tenant.id,
        },
      });
      const data = response.data;
      console.log("Données récupérées:", data);

      const transformedData: IoTCard[] = data.map((item: any) => ({
        id: item.id || "",
        title: item.name || "Sans titre",
        subtitle: item.subtitle || item.reference || "",
        iconType: item.icon || "chip",
        size: item.size || 0,
        color: item.color || "#E8483F",
        url: item.url || "",
        reference: item.reference || "",
        readme: item.readme || "",
        group: item.group || "Default",
        stats: {
          paused: item.stats?.paused || false,
          messages: item.stats?.messages || 0,
          pending: item.stats?.pending || 0,
          memory: item.stats?.memory || 0,
          minutes: item.stats?.minutes || 0,
          errors: item.stats?.errors || 0,
          mm: item.stats?.mm || 0,
        },
        createdAt: new Date(item.dtcreated || Date.now()),
        errors: item.errors || false,
        version: item.version || "",
        createdBy: item.author || "",
      }));
      console.log(transformedData);
      setCards(transformedData);

      const groupedCards: Record<string, IoTCard[]> = {};
      transformedData.forEach((card) => {
        const group = card.group || "Default";
        if (!groupedCards[group]) {
          groupedCards[group] = [];
        }
        groupedCards[group].push(card);
      });
      setGroups(groupedCards);

      setLoading(false);
    } catch (err) {
      console.error("Erreur lors de la récupération des données:", err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCardClick = (cardId: string) => {
    navigate(`/editor/${cardId}`);
  };

  const handleCreateFlow = () => {
    navigate("/create-flow");
  };

  const handleImportFlow = async () => {
    if (!importCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter flow code to import.",
        variant: "destructive",
      });
      return;
    }
    console.log("Importing flow with code:", importCode);

    try {
      await apiClient.post(
        "workflow/import",
        {
          schema: "clipboard_import",
          data: {
            data: importCode
          }
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast({
        title: "Success",
        description: "Flow imported successfully",
      });
      setImportDialogOpen(false);
      setImportCode("");
      fetchData();
    } catch (error) {
      console.error("Failed to import flow:", error);
      toast({
        title: "Error",
        description: "Failed to import flow stream. Please check your flow code format.",
        variant: "destructive",
      });
    }
  };

  const getCardIcon = (iconType: string) => {
    switch (iconType) {
      case "card":
        return <CreditCard className="h-12 w-12 text-gray-700" />;
      case "chip":
        return <Cpu className="h-12 w-12 text-gray-700" />;
      case "fa fa-bullhorn":
        return <Megaphone className="h-12 w-12 text-red-500" />;
      default:
        return <BookPlus className="h-12 w-12 text-gray-700" />;
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("fr-FR").format(num);
  };

  const formatMemory = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const filteredGroups = useMemo(() => {
    if (!searchTerm) return groups;

    const result: Record<string, IoTCard[]> = {};
    Object.entries(groups).forEach(([groupName, groupCards]) => {
      const filteredCards = groupCards.filter(
        (card) =>
          card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.reference.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filteredCards.length > 0) {
        result[groupName] = filteredCards;
      }
    });
    return result;
  }, [groups, searchTerm]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
          <p className="mt-2 text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Erreur</h2>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={fetchData}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-neutral-900 min-h-screen p-4">
      <div className="flex items-center justify-between p-2 bg-white dark:bg-neutral-800 border-b dark:border-neutral-700 mb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center text-primary font-medium">
            <span className="text-primary mr-1">●</span>
            FlowStream
          </div>
          <div className="ml-4 flex gap-2">
            <button className="p-1 text-gray-700 dark:text-neutral-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </button>
            <button className="p-1 text-gray-700 dark:text-neutral-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="9" y1="21" x2="9" y2="9"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="flex-grow mx-8 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher un flux..."
              className="w-full pl-10 pr-4 py-2 text-black rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <X
                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600"
                onClick={() => setSearchTerm("")}
              />
            )}
          </div>
        </div>

        {/* Popover for FlowStream actions */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded hover:bg-orange-700 transition-colors"
            >
              <Plus size={16} className="text-white" />
              FlowStream
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2">
            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start text-black hover:bg-gray-100 px-3 py-2"
                onClick={handleCreateFlow}
              >
                <Plus size={16} className="mr-3" />
                Create new flow
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-black hover:bg-gray-100 px-3 py-2"
                onClick={() => setImportDialogOpen(true)}
              >
                <Upload size={16} className="mr-3" />
                Import flow stream
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Import Flow Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="sm:max-w-[700px] bg-white text-black">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <UploadCloud className="h-5 w-5 text-blue-500" />
              Import Flow Stream
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="flowCode" className="text-sm font-medium text-gray-700">
                Flow Code
              </label>
              <p className="text-xs text-gray-500">
                Paste your exported flow stream code below. This should be the complete flow configuration including nodes, connections, and settings.
              </p>
              <Textarea
                id="flowCode"
                placeholder={`{
  "name": "My Flow",
  "nodes": [
    {
      "id": "node1",
      "type": "input",
      "data": { ... }
    }
  ],
  "connections": [ ... ],
  "settings": { ... }
}`}
                className="min-h-[300px] font-mono text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                value={importCode}
                onChange={(e) => setImportCode(e.target.value)}
              />
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <div className="flex items-start gap-2">
                <div className="text-blue-500 mt-0.5">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Tip:</p>
                  <p>You can export flow code from any existing flow using the export option in the flow editor menu.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setImportDialogOpen(false);
                setImportCode("");
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleImportFlow} 
              disabled={!importCode.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import Flow
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="container mx-auto">
        {Object.keys(filteredGroups).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              Aucun flux trouvé. Cliquez sur "FlowStream" pour créer ou importer votre premier flux.
            </p>
          </div>
        ) : (
          Object.entries(filteredGroups).map(([groupName, groupCards]) => (
            <div key={groupName} className="mb-6">
              {groupName !== "Default" && (
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-medium">{groupName}</h2>
                  <span className="text-gray-500">{groupCards.length}</span>
                </div>
              )}
              <div className="flex flex-wrap gap-4">
                {groupCards.map((card) => (
                  <div
                    key={card.id}
                    className="w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1rem)]"
                  >
                    <Card className="h-full flex flex-col shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-neutral-800 relative rounded-lg border dark:border-neutral-700 dark:hover:shadow-primary/30">
                      <div className="relative p-6 border-b dark:border-neutral-700 flex justify-center items-center h-22">
                        <div className="flex justify-center items-center w-full h-20">
                          {getCardIcon(card.iconType)}
                        </div>
                        <div className="absolute top-2 right-2 z-10">
                          <CardDropdownMenu onRefetch={fetchData} card={card} />
                        </div>
                      </div>

                      <div
                        className="p-4 mt-2 border-b dark:border-neutral-700 cursor-pointer"
                        onClick={() => handleCardClick(card.id)}
                      >
                        <div className="font-bold text-gray-900 dark:text-white">{card.title}</div>
                        <div className="text-gray-500 dark:text-neutral-400">{card.subtitle}</div>
                        <div className="text-gray-500 dark:text-neutral-400 text-sm">{card.size} KB</div>
                      </div>

                      <div
                        className="flex-grow p-4 text-sm cursor-pointer"
                        onClick={() => handleCardClick(card.id)}
                      >
                        <div className="grid grid-cols-2 gap-y-2">
                          <div className="text-gray-500 dark:text-neutral-400">Memory</div>
                          <div className="text-right font-medium text-gray-900 dark:text-white">
                            {formatMemory(card.stats.memory)}
                          </div>

                          <div className="text-gray-500 dark:text-neutral-400">Messages</div>
                          <div className="text-right font-medium text-gray-900 dark:text-white">
                            {formatNumber(card.stats.messages)}
                          </div>

                          <div className="text-gray-500 dark:text-neutral-400">Pending</div>
                          <div className="text-right font-medium text-gray-900 dark:text-white">
                            {formatNumber(card.stats.pending)}
                          </div>

                          <div className="text-gray-500 dark:text-neutral-400">Per minute</div>
                          <div className="text-right font-medium text-gray-900 dark:text-white">
                            {formatNumber(card.stats.minutes)}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}