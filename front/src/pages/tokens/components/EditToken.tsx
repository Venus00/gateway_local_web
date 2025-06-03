import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiClient } from "@/features/api";
import { RootState } from "@/features/auth/store";
import { toast } from "@/hooks/use-toast";
import { Save } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "react-query";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { TokenEditDto } from "../token.dto";
export default function EditToken() {
  //   const { id } = useParams();
  const { tenant } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();
  const [token, setToken] = useState<TokenEditDto>({
    id: location.state.id,
    name: location.state.name,
    description: location.state.description,
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    editToken(token);
  };
  const editToken = async (data: TokenEditDto) => {
    try {
      await apiClient.put(`tokens`, data);
      toast({
        title: "Success",
        description: "Token Updated Successfully",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["tokens"] });
      navigate("/tokens");
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to update Token",
        variant: "destructive",
      });
    }
  };

  return (
    <main
      className={`flex-1 overflow-x-hidden container mx-auto py-4  overflow-y-auto    `}
    >
      <div className=" bg-white dark:bg-neutral-800 rounded-lg  overflow-hidden p-4">
        <h1 className="text-2xl font-semibold mb-6">Edit Machine</h1>
        <div className="flex flex-col gap-4 py-4 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={token.name}
                onChange={(e) => setToken({ ...token, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={token.description}
                onChange={(e) =>
                  setToken({ ...token, description: e.target.value })
                }
                required
              />
            </div>

            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
