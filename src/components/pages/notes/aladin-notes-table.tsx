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
import { ArrowUpDown, Search, Eye } from "lucide-react";
import { NoteQuiz } from "@/services/controllers/types/common/stats.type";
import { useSession } from "@/services/hooks/auth/useSession";
import { useMatieresByNiveau } from "@/services/hooks/matieres/useMatieres";
import { convertScoreToNote } from "@/lib/quiz-score";
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
import { useMediaQuery } from "@/services/hooks/use-media-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AladinNotesTableProps {
  notes: NoteQuiz[];
}

type AladinNoteBySubject = {
  matiere: string;
  notes: NoteQuiz[];
  moyenne: number | null;
};

const columnHelper = createColumnHelper<AladinNoteBySubject>();

function DetailsView({ rowData }: { rowData: AladinNoteBySubject }) {
  return (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-4">{rowData.matiere}</h3>
      {rowData.notes.length > 0 ? (
        <ul className="space-y-3">
          {rowData.notes.map((note, index) => {
            const noteSur20 = convertScoreToNote(
              note.note,
              note.nombre_questions,
            );
            const noteDate = new Date(note.date);
            return (
              <li
                key={index}
                className="flex justify-between items-start border-b pb-3"
              >
                <div className="flex-1">
                  <p className="font-semibold text-base">{note.chapitre}</p>
                  <div className="flex flex-col gap-1 mt-1">
                    <p className="text-sm text-muted-foreground">
                      📅 {noteDate.toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                      {" à "}
                      <span className="font-medium">
                        {noteDate.toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </p>
                    {note.niveau && (
                      <p className="text-sm">
                        🎯 Difficulté:{" "}
                        <span className="font-medium text-foreground">
                          {note.niveau}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
                <Badge className="text-lg ml-3 shrink-0">
                  {noteSur20.toFixed(2)}/20
                </Badge>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>Aucune note de quiz pour cette matière.</p>
      )}
    </div>
  );
}

export function AladinNotesTable({ notes }: AladinNotesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const { user } = useSession();
  const { data: matieres, isLoading: isLoadingMatieres } = useMatieresByNiveau(
    user?.niveau?.id ?? 0,
  );
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedRow, setSelectedRow] = useState<AladinNoteBySubject | null>(
    null,
  );

  const processedData = useMemo(() => {
    if (!matieres) return [];

    const notesByMatiere = new Map<string, NoteQuiz[]>();
    notes.forEach((note) => {
      if (note.matiere) {
        const existing = notesByMatiere.get(note.matiere) || [];
        existing.push(note);
        notesByMatiere.set(note.matiere, existing);
      }
    });

    return matieres.matieres.map((matiere) => {
      const subjectNotes = notesByMatiere.get(matiere.libelle) || [];
      let moyenne: number | null = null;
      if (subjectNotes.length > 0) {
        const total = subjectNotes.reduce(
          (acc, curr) =>
            acc + convertScoreToNote(curr.note, curr.nombre_questions),
          0,
        );
        moyenne = total / subjectNotes.length;
      }
      return {
        matiere: matiere.libelle,
        notes: subjectNotes,
        moyenne: moyenne,
      };
    });
  }, [matieres, notes]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("matiere", {
        header: "Matière",
        cell: (info) => <span className="font-medium">{info.getValue()}</span>,
      }),
      columnHelper.accessor("notes", {
        header: "Notes",
        cell: (info) => (
          <div className="flex flex-wrap gap-2 max-w-xs">
            {info.getValue().length > 0 ? (
              <TooltipProvider>
                {info
                  .getValue()
                  .slice(0, 5)
                  .map((note, index) => {
                    const noteSur20 = convertScoreToNote(
                      note.note,
                      note.nombre_questions,
                    );
                    const noteDate = new Date(note.date);
                    return (
                      <Tooltip key={index}>
                        <TooltipTrigger asChild>
                          <Badge variant="outline">
                            {noteSur20.toFixed(1)}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-semibold">{note.chapitre}</p>
                          <p className="text-sm">
                            {noteDate.toLocaleDateString("fr-FR")} à{" "}
                            {noteDate.toLocaleTimeString("fr-FR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          {note.niveau && (
                            <p className="text-sm">
                              Difficulté: {note.niveau}
                            </p>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                {info.getValue().length > 5 && (
                  <Badge variant="secondary">...</Badge>
                )}
              </TooltipProvider>
            ) : (
              <span className="text-muted-foreground">-</span>
            )}
          </div>
        ),
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
                    <DialogTitle>Détails des notes d'Aladin</DialogTitle>
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
                  <DrawerTitle>Détails des notes d'Aladin</DrawerTitle>
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

  if (isLoadingMatieres) {
    return <p>Chargement des matières...</p>;
  }

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
                  className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/30" // Added background classes
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
    </div>
  );
}
