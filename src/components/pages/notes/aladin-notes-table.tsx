"use client";

import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, ArrowUpDown, Search } from "lucide-react";
import { convertScoreToNote } from "@/lib/quiz-score";

type AladinNote = {
  matiere: string;
  chapitre: string;
  niveau: string;
  note: number;
  nombre_questions: number;
  date: string;
};

interface AladinNotesTableProps {
  notes: AladinNote[];
}

const columnHelper = createColumnHelper<AladinNote>();

export function AladinNotesTable({ notes }: AladinNotesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "date", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo(
    () => [
      columnHelper.accessor("matiere", {
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="hover:bg-transparent px-0"
            >
              Matière
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: (info) => (
          <span className="font-medium">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("chapitre", {
        header: "Chapitre",
        cell: (info) => (
          <span className="text-sm text-muted-foreground">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("niveau", {
        header: "Difficulté",
        cell: (info) => {
          const niveau = info.getValue();
          const variant =
            niveau === "facile"
              ? "default"
              : niveau === "moyen"
                ? "secondary"
                : "destructive";
          return (
            <Badge variant={variant} className="capitalize">
              {niveau}
            </Badge>
          );
        },
      }),
      columnHelper.accessor("note", {
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="hover:bg-transparent px-0"
            >
              Note
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: (info) => {
          const row = info.row.original;
          // Convertir le score (nombre de bonnes réponses) en note sur 20
          const noteSur20 = convertScoreToNote(row.note, row.nombre_questions);
          const colorClass =
            noteSur20 >= 15
              ? "text-green-600 font-bold"
              : noteSur20 >= 10
                ? "text-blue-600 font-semibold"
                : "text-red-600 font-semibold";
          return <span className={colorClass}>{noteSur20.toFixed(1)}/20</span>;
        },
      }),
      columnHelper.accessor("nombre_questions", {
        header: "Questions",
        cell: (info) => (
          <span className="text-sm text-muted-foreground">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("date", {
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="hover:bg-transparent px-0"
            >
              Date
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: (info) => {
          const date = new Date(info.getValue());
          return (
            <span className="text-sm text-muted-foreground">
              {date.toLocaleDateString("fr-FR")}
            </span>
          );
        },
      }),
    ],
    [],
  );

  const table = useReactTable({
    data: notes,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="space-y-4">
      {/* Recherche globale */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Rechercher..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
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
                  Aucun résultat trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} résultat(s) au total
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
            Précédent
          </Button>
          <div className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} sur{" "}
            {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Suivant
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
