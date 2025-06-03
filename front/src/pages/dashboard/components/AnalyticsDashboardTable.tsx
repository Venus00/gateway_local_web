import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { columns } from "./ColumnsTable";
import { DashboardDto } from "../dashboard.dto";
import { useLanguage } from "@/context/language-context";

interface PropsTaype {
  dashboards: DashboardDto[];
  handleNavigate: (id: number) => void;
}

function AnalyticsDashboardTable({ dashboards, handleNavigate }: PropsTaype) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<any>([]);
  const { t, isArabic } = useLanguage();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const table = useReactTable<any>({
    data: dashboards,
    columns: columns(t, isArabic, handleNavigate),
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      globalFilter,
      columnVisibility,
      rowSelection,
    },
  });
  return (
    <div className="">
      <div className="flex items-center py-4">
        <Input
          placeholder={
            isArabic
              ? "..." + t("table.filter") + " " + t("nav.dashboard")
              : t("table.filter") + " " + t("nav.dashboard") + "..."
          }
          onChange={(e) => table.setGlobalFilter(String(e.target.value))}
          className="max-w-sm ml-1 border dark:border-neutral-400"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              {t("table.columns")}
              <ChevronDownIcon className=" h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className=""
                    dir={isArabic ? "rtl" : "ltr"}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {t(`table.column.${column.id}`)}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md  overflow-y-auto ">
        <Table className="border" dir={isArabic ? "rtl" : "ltr"}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                dir={isArabic ? "rtl" : "ltr"}
                key={headerGroup.id}
                className="dark:border-b-neutral-400"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      dir={isArabic ? "rtl" : "ltr"}
                      key={header.id}
                      className=""
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  dir={isArabic ? "rtl" : "ltr"}
                  key={row.id}
                  className="dark:border-b-neutral-400"
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {t("table.noResult")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} {t("table.rowsSelected")}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {t("table.previous")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {t("table.next")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsDashboardTable;
