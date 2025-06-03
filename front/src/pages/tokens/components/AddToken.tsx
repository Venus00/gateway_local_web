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
import { apiClient } from "@/features/api";
import { RootState } from "@/features/auth/store";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { TokenCreateDto } from "../token.dto";
import { Textarea } from "@/components/ui/textarea";
import { useQueryClient } from "react-query";
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
function AddToken() {
  const queryClient = useQueryClient();

  const { tenant, email, id } = useSelector((state: RootState) => state.auth);
  const [newToken, setNewToken] = useState<TokenCreateDto>({
    name: "",
    tenantId: tenant.id ?? 0,
    description: "",
    expiryDate: "day",
    user: {
      id: id ?? 0,
      email: email ?? "",
    },
  });
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(newToken);

    createMachine(newToken);
  };

  const createMachine = async (data: TokenCreateDto) => {
    try {
      await apiClient.post("tokens", {
        ...data,
        tenantId: tenant.id,
      });
      setNewToken({
        name: "",
        tenantId: tenant.id ?? 0,
        description: "",
        expiryDate: "day",
        user: {
          id: id ?? 0,
          email: email ?? "",
        },
      });
      queryClient.invalidateQueries({ queryKey: ["tokens"] });
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div
        className={`flex flex-col transition-all duration-500 ease-in-out   overflow-hidden ${
          open ? "gap-4" : "gap-0"
        }`}
      >
        <Button
          onClick={() => {
            setOpen((prev) => !prev);
            setNewToken({
              name: "",
              tenantId: tenant.id ?? 0,
              description: "",
              expiryDate: "day",
              user: {
                id: id ?? 0,
                email: email ?? "",
              },
            });
          }}
          className="w-fit dark:bg-neutral-800 dark:hover:bg-neutral-700"
          color="red"
          variant="outline"
        >
          {open ? "Close Form" : "Create New Token"}
        </Button>
        <motion.div
          variants={variants}
          initial={false}
          animate={open ? "open" : "closed"}
          className=" bg-white dark:bg-neutral-800  rounded-lg shadow-md overflow-hidden "
        >
          <div className="flex flex-col  !overflow-hidden ">
            <h1 className="font-semibold text-lg">Create New Token</h1>
            <span className="italic">Create a new token</span>
          </div>
          <div className="flex flex-col gap-4 py-4 overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newToken.name}
                  onChange={(e) =>
                    setNewToken({ ...newToken, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newToken.description}
                  onChange={(e) =>
                    setNewToken({ ...newToken, description: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Select
                  name="expiryDate"
                  required
                  onValueChange={(e) =>
                    setNewToken({ ...newToken, expiryDate: e })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="day">day</SelectItem>
                      <SelectItem value="week">week</SelectItem>
                      <SelectItem value="month">month</SelectItem>
                      <SelectItem value="year">year</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit">
                <Plus className="h-4 w-4 mr-2" />
                Add Token
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default AddToken;
