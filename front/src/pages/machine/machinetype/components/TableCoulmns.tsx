import { Button } from "@/components/ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowLeftCircle, ArrowRightCircle, ChevronDownIcon, ChevronUpIcon, FilePenLine, Trash2 } from "lucide-react";
import { Link as LinkRef } from "react-router-dom";
import { MachineTypeDto } from "../machineTypedto";
import { useState } from "react";

const TagDisplay = ({ tags, type }:any) => {
  const [expanded, setExpanded] = useState(false);
  const MAX_VISIBLE_TAGS = 3;
  
  if (!tags || tags.length === 0) {
    return (
      <span className={`inline-flex items-center ${
        type === "input" 
          ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300" 
          : "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"
      } text-xs px-2 py-1 rounded-md border`}>
        N/A
      </span>
    );
  }
  
  const tagsArray = typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : tags;
  const hasMoreTags = tagsArray.length > MAX_VISIBLE_TAGS;
  const visibleTags = expanded ? tagsArray : tagsArray.slice(0, MAX_VISIBLE_TAGS);
  
  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap gap-1">
        {visibleTags.map((tag:any, index:any) => (
          <span 
            key={`tag-${index}`}
            className={`inline-flex items-center ${
              type === "input" 
                ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300" 
                : "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"
            } text-xs px-2 py-1 rounded-md border`}
          >
            {tag}
          </span>
        ))}
      </div>
      
      {hasMoreTags && (
        <Button 
          variant="ghost" 
          size="sm" 
          className={`mt-1 h-6 px-2 text-xs ${
            type === "input"
              ? "text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300"
              : "text-red-700 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
          }`}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>
              <span>show less</span>
              <ChevronUpIcon className="ml-1 h-3 w-3" />
            </>
          ) : (
            <>
              <span>show more ({tagsArray.length - MAX_VISIBLE_TAGS})</span>
              <ChevronDownIcon className="ml-1 h-3 w-3" />
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export const columns = (
  handleDelete: (arg0: string) => void
): ColumnDef<MachineTypeDto>[] => [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <CaretSortIcon className=" h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <CaretSortIcon className=" h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "input",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center"
        >
          <ArrowLeftCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-500 mr-1" />
          Inputs
          <CaretSortIcon className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const input = row.getValue("input");
      return <TagDisplay tags={input} type="input" />;
    },
  },
  {
    accessorKey: "output",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center"
        >
          <ArrowRightCircle className="h-4 w-4 text-red-600 dark:text-red-400 mr-1" />
          Outputs
          <CaretSortIcon className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const output = row.getValue("output");
      return <TagDisplay tags={output} type="output" />;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: () => {
      return <Button variant="ghost">Actions</Button>;
    },
    cell: ({ row }) => {
      const item = {
        id: row.original.id,
        name: row.original.name,
        input: row.original.input,
        output: row.original.output,
      };
      return (
        <div className="flex gap-3">
          <LinkRef
            state={item}
            to={{
              pathname: `/machineType/edit/${item.id}`,
            }}
          >
            <Button className="p-2 hover:bg-blue-500 rounded-full">
              <FilePenLine className="h-4 w-4" />
            </Button>
          </LinkRef>
          <Button
            className="p-2 hover:bg-red-500 rounded-full"
            onClick={() => handleDelete(item.name)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];