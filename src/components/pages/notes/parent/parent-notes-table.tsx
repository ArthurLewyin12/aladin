"use client";

import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, ArrowUpDown, Eye } from "lucide-react";
import { NoteClasse } from "@/services/controllers/types/common";
import { NoteDetailsModal } from "../note-details-modal";

interface ParentNotesTableProps {
  notes: NoteClasse[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
  };
  page: number;
  setPage: (page: number) => void;
}

export function ParentNotesTable({
  notes,
  pagination,
  page,
  setPage,
}: ParentNotesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "date_evaluation", desc: true },
  ]);
  const [selectedNote, setSelectedNote] = useState<NoteClasse | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const columns: ColumnDef<NoteClasse>[] = useMemo(
    () => [
      {
        accessorKey: "matiere",
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
        cell: ({ row }) => (
          <span className="font-medium">
            {row.original.matiere?.libelle || "N/A"}
          </span>
        ),
      },
      {
        accessorKey: "note",
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
        cell: ({ row }) => {
          const note = parseFloat(row.getValue("note"));
          const colorClass =
            note >= 15
              ? "text-green-600 font-bold"
              : note >= 10
                ? "text-blue-600 font-semibold"
                : "text-red-600 font-semibold";
          return <span className={colorClass}>{note.toFixed(1)}/20</span>;
        },
      },
      {
        accessorKey: "type_evaluation",
        header: "Type",
        cell: ({ row }) => (
          <Badge variant="outline" className="capitalize">
            {row.getValue("type_evaluation")}
          </Badge>
        ),
      },
      {
        accessorKey: "date_evaluation",
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
        cell: ({ row }) => {
          const date = new Date(row.getValue("date_evaluation"));
          return (
            <span className="text-sm text-muted-foreground">
              {date.toLocaleDateString("fr-FR")}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedNote(row.original);
              setIsDetailsOpen(true);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: notes,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const totalPages = Math.ceil(pagination.total / pagination.per_page);

  return (
    <>
      <div className="space-y-4">
        {/* Table */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="bg-gray-50 dark:bg-gray-800/50"
                >
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
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/30"
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
                    Aucune note trouvée.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-2">
            <div className="text-sm text-muted-foreground">
              Page {page} sur {totalPages} ({pagination.total} note
              {pagination.total > 1 ? "s" : ""})
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Précédent
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
              >
                Suivant
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de détails */}
      {selectedNote && (
        <NoteDetailsModal
          note={selectedNote}
          isOpen={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
        />
      )}
    </>
  );
}
