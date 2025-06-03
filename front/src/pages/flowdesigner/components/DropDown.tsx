import { useState } from "react";
import { Copy, Edit, FileText, Pause, Play, RefreshCw, Trash2, Variable, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiClient } from "@/features/api";
import { useSelector } from "react-redux";
import { RootState } from "@/features/auth/store";
import type { IoTCard } from "@/lib/types";
import EditFlowForm from "./EditCard";

interface CardDropdownMenuProps {
  onRefetch?: () => void;
  card: IoTCard;
}

export function CardDropdownMenu({ onRefetch, card }: CardDropdownMenuProps) {
  const navigate = useNavigate();
  const { tenant } = useSelector((state: RootState) => state.auth);
  const [open, setOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleEdit = () => {
    setOpen(false);
    setEditDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await apiClient.delete(`workflow/${card.id}`, {
        data: {
          tenantId: tenant.id,
          schema: `streams_remove/${card.id}`,
        },
      });
      console.log("Workflow deleted successfully");
      onRefetch?.();
    } catch (error) {
      console.error("Failed to delete workflow:", error);
    }
  };

  const handleAction = (action: () => void) => {
    setOpen(false);
    setTimeout(() => action(), 10);
  };

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button className="text-gray-500 hover:bg-gray-100 p-1 rounded-full">
            <MoreVertical size={20} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 z-50 bg-white" sideOffset={5}>
          <DropdownMenuItem
            onClick={() => handleAction(() => navigate(`/variables/${card.id}`))}
            className="text-black"
          >
            <Variable className="mr-2 h-4 w-4" />
            <span>Variables</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleAction(() => console.log(card.stats.paused ? "Resuming" : "Pausing"))}
            className="text-black"
          >
            {card.stats.paused ? (
              <>
                <Play className="mr-2 h-4 w-4" />
                <span>Démarrer</span>
              </>
            ) : (
              <>
                <Pause className="mr-2 h-4 w-4" />
                <span>Pause</span>
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => handleAction(() => window.open(`/view/${card.id}`, "_blank"))}
            className="text-black"
          >
            <FileText className="mr-2 h-4 w-4" />
            <span>Open in new tab</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleEdit} className="text-black">
            <Edit className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleAction(() => console.log("Clone"))}
            className="text-black"
          >
            <Copy className="mr-2 h-4 w-4" />
            <span>Clone</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() =>
              handleAction(() => {
                navigator.clipboard.writeText(JSON.stringify(card));
                console.log("Copied to clipboard");
              })
            }
            className="text-black"
          >
            <Copy className="mr-2 h-4 w-4" />
            <span>Copy to clipboard</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() =>
              handleAction(() => {
                navigator.clipboard.writeText(JSON.stringify(card, null, 2));
                console.log("Copied as formatted JSON");
              })
            }
            className="text-black"
          >
            <Copy className="mr-2 h-4 w-4" />
            <span>Copy as JSON</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleAction(() => console.log("Restart"))}
            className="text-black"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            <span>Restart</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => handleAction(handleDelete)} className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Remove</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-white text-black">
          <DialogHeader>
            <DialogTitle className="text-black font-bold">Edit flow</DialogTitle>
          </DialogHeader>
          <EditFlowForm
            onRefetch={onRefetch}
            card={card}
            onClose={() => setEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}