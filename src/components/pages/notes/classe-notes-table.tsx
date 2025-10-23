"use client";

import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
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
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Edit,
  Eye,
} from "lucide-react";
import { NoteClasse } from "@/services/controllers/types/common";
import { EditNoteModal } from "./edit-note-modal";
import { NoteDetailsModal } from "./note-details-modal";
import { parseAsInteger, useQueryState } from "nuqs";

interface ClasseNotesTableProps {
  notes: NoteClasse[];
  pagination?: {
    current_page: number;
    per_page: number;
    total: number;
    last_page?: number;
  };
}

const columnHelper = createColumnHelper<NoteClasse>();

export function ClasseNotesTable({ notes, pagination }: ClasseNotesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "date_evaluation", desc: true },
  ]);
  const [editingNote, setEditingNote] = useState<NoteClasse | null>(null);
  const [viewingNote, setViewingNote] = useState<NoteClasse | null>(null);

  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const columns = useMemo(
    () => [
      columnHelper.accessor("matiere.libelle", {
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
          <span className="font-medium">{info.getValue() || "N/A"}</span>
        ),
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
          const note = parseFloat(info.getValue());
          const colorClass =
            note >= 15
              ? "text-green-600 font-bold"
              : note >= 10
                ? "text-blue-600 font-semibold"
                : "text-red-600 font-semibold";
          return <span className={colorClass}>{note.toFixed(1)}/20</span>;
        },
      }),
      columnHelper.accessor("type_evaluation", {
        header: "Type",
        cell: (info) => {
          const type = info.getValue();
          return (
            <Badge variant="outline" className="capitalize">
              {type}
            </Badge>
          );
        },
      }),
      columnHelper.accessor("date_evaluation", {
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
      columnHelper.accessor("commentaire", {
        header: "Commentaire",
        cell: (info) => {
          const comment = info.getValue();
          if (!comment) return <span className="text-muted-foreground">-</span>;
          return (
            <span className="text-sm text-muted-foreground line-clamp-1">
              {comment}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const note = row.original;
          return (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewingNote(note)}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingNote(note)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
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
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: pagination?.last_page || 1,
  });

  return (
    <div className="space-y-4">
      {/* Filtres toggle */}
      {/*<div className="flex justify-between items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4 mr-2" />
          {showFilters ? "Masquer les filtres" : "Afficher les filtres"}
        </Button>
      </div>*/}

      {/* Table */}
      <div className="rounded-md border bg-card">
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
                  Aucune note trouvée.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && pagination.last_page && pagination.last_page > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map(
              (pageNum) => {
                const showPage =
                  pageNum <= 2 ||
                  pageNum >= pagination.last_page! - 1 ||
                  (pageNum >= page - 1 && pageNum <= page + 1);

                const showEllipsisBefore = pageNum === 3 && page > 4;
                const showEllipsisAfter =
                  pageNum === pagination.last_page! - 2 &&
                  page < pagination.last_page! - 3;

                if (!showPage && !showEllipsisBefore && !showEllipsisAfter) {
                  return null;
                }

                if (showEllipsisBefore || showEllipsisAfter) {
                  return (
                    <span key={pageNum} className="px-2 text-gray-400">
                      ...
                    </span>
                  );
                }

                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPage(pageNum)}
                    className={`rounded-full min-w-[2.5rem] ${
                      pageNum === page ? "bg-[#2C3E50] hover:bg-[#1a252f]" : ""
                    }`}
                  >
                    {pageNum}
                  </Button>
                );
              },
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setPage(Math.min(pagination.last_page || 1, page + 1))
            }
            disabled={page === pagination.last_page}
            className="rounded-full"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Modals */}
      {editingNote && (
        <EditNoteModal
          note={editingNote}
          isOpen={!!editingNote}
          onOpenChange={(open) => !open && setEditingNote(null)}
        />
      )}

      {viewingNote && (
        <NoteDetailsModal
          note={viewingNote}
          isOpen={!!viewingNote}
          onOpenChange={(open) => !open && setViewingNote(null)}
        />
      )}
    </div>
  );
}
