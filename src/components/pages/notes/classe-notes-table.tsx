"use client";

import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Eye } from "lucide-react";
import { NoteClasse } from "@/services/controllers/types/common";
import { EditNoteModal } from "./edit-note-modal";
import { NoteDetailsModal } from "./note-details-modal";
import { useMediaQuery } from "@/services/hooks/use-media-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ClasseNotesTableProps {
  notes: NoteClasse[];
  pagination?: {
    current_page: number;
    per_page: number;
    total: number;
    last_page?: number;
  };
  readOnly?: boolean;
}

type ClasseNoteBySubject = {
  matiere: string;
  notes: NoteClasse[];
  moyenne: number | null;
};

const columnHelper = createColumnHelper<ClasseNoteBySubject>();

function DetailsView({ rowData }: { rowData: ClasseNoteBySubject }) {
  return (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-4">{rowData.matiere}</h3>
      {rowData.notes.length > 0 ? (
        <ul className="space-y-3">
          {rowData.notes.map((note, index) => {
            const noteValue = parseFloat(note.note);
            return (
              <li
                key={index}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <p className="font-semibold">
                    {note.type_evaluation}
                    {note.chapitres_ids && note.chapitres_ids.length > 0 && (
                      <span className="text-sm text-muted-foreground ml-2">
                        (Chapitres: {note.chapitres_ids.join(", ")})
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(note.date_evaluation).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <Badge className="text-lg">{noteValue.toFixed(1)}/20</Badge>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>Aucune note de classe pour cette matière.</p>
      )}
    </div>
  );
}

export function ClasseNotesTable({ notes, pagination, readOnly = false }: ClasseNotesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [editingNote, setEditingNote] = useState<NoteClasse | null>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedRow, setSelectedRow] = useState<ClasseNoteBySubject | null>(
    null,
  );

  const processedData = useMemo(() => {
    const notesByMatiere = new Map<string, NoteClasse[]>();
    notes.forEach((note) => {
      if (note.matiere?.libelle) {
        const existing = notesByMatiere.get(note.matiere.libelle) || [];
        existing.push(note);
        notesByMatiere.set(note.matiere.libelle, existing);
      }
    });

    return Array.from(notesByMatiere, ([matiere, notes]) => {
      let moyenne: number | null = null;
      if (notes.length > 0) {
        const total = notes.reduce(
          (acc, curr) => acc + parseFloat(curr.note),
          0,
        );
        moyenne = total / notes.length;
      }
      return {
        matiere,
        notes: notes.sort(
          (a, b) =>
            new Date(b.date_evaluation).getTime() -
            new Date(a.date_evaluation).getTime(),
        ),
        moyenne,
      };
    });
  }, [notes]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("matiere", {
        header: "Matière",
        cell: (info) => <span className="font-medium">{info.getValue()}</span>,
      }),
      columnHelper.accessor("notes", {
        header: "Notes",
        cell: (info) => {
          const notesArray = info.getValue();
          return (
            <div className="flex flex-wrap gap-2 max-w-xs">
              {notesArray.length > 0 ? (
                <TooltipProvider>
                  {notesArray.slice(0, 5).map((note, index) => {
                    const noteValue = parseFloat(note.note);
                    const colorClass =
                      noteValue >= 15
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : noteValue >= 10
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
                    return (
                      <Tooltip key={index}>
                        <TooltipTrigger asChild>
                          <Badge variant="outline" className={colorClass}>
                            {noteValue.toFixed(1)}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-semibold">{note.type_evaluation}</p>
                          {note.chapitres_ids && note.chapitres_ids.length > 0 && (
                            <p className="text-sm">
                              Ch: {note.chapitres_ids.join(", ")}
                            </p>
                          )}
                          <p className="text-sm">
                            {new Date(note.date_evaluation).toLocaleDateString(
                              "fr-FR",
                            )}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                  {notesArray.length > 5 && (
                    <Badge variant="secondary">...</Badge>
                  )}
                </TooltipProvider>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </div>
          );
        },
      }),
      columnHelper.accessor("moyenne", {
        header: "Moyenne",
        cell: (info) => {
          const moyenne = info.getValue();
          if (moyenne === null) {
            return <span className="text-muted-foreground">-</span>;
          }
          const colorClass =
            moyenne >= 15
              ? "text-green-600 font-bold"
              : moyenne >= 10
                ? "text-blue-600 font-semibold"
                : "text-red-600 font-semibold";
          return <span className={colorClass}>{moyenne.toFixed(2)}/20</span>;
        },
      }),
      columnHelper.display({
        id: "details",
        header: "Détails",
        cell: ({ row }) => {
          const rowData = row.original;
          if (isDesktop) {
            return (
              <Dialog
                open={
                  !!(selectedRow && selectedRow.matiere === rowData.matiere)
                }
                onOpenChange={(isOpen) => !isOpen && setSelectedRow(null)}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedRow(rowData)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Détails des notes de classe</DialogTitle>
                  </DialogHeader>
                  <DetailsView rowData={rowData} />
                </DialogContent>
              </Dialog>
            );
          }
          return (
            <Drawer
              open={!!(selectedRow && selectedRow.matiere === rowData.matiere)}
              onOpenChange={(isOpen) => !isOpen && setSelectedRow(null)}
            >
              <DrawerTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedRow(rowData)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Détails des notes de classe</DrawerTitle>
                </DrawerHeader>
                <DetailsView rowData={rowData} />
              </DrawerContent>
            </Drawer>
          );
        },
      }),
    ],
    [isDesktop, selectedRow],
  );

  const table = useReactTable({
    data: processedData,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Rechercher une matière..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="pl-9"
        />
      </div>

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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/30"
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

      {editingNote && (
        <EditNoteModal
          note={editingNote}
          isOpen={!!editingNote}
          onOpenChange={(open) => !open && setEditingNote(null)}
        />
      )}
    </div>
  );
}
