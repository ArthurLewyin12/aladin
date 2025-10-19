"use client";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";
import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpDown, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ComparisonData {
  matiere: string;
  note_aladin: number;
  note_classe: number;
}

interface ComparisonTableProps {
  data: ComparisonData[];
}

export function ComparisonTable({ data }: ComparisonTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns: ColumnDef<ComparisonData>[] = useMemo(
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
              className="hover:bg-gray-100 dark:hover:bg-gray-800 -ml-4"
            >
              Matière
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("matiere")}</div>
        ),
      },
      {
        accessorKey: "note_aladin",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="hover:bg-gray-100 dark:hover:bg-gray-800 -ml-4"
            >
              Note Aladin
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const note = row.getValue("note_aladin") as number;
          const noteColorClass =
            note >= 15
              ? "text-green-600"
              : note >= 10
                ? "text-blue-600"
                : "text-red-600";
          return (
            <div className={`font-semibold ${noteColorClass}`}>
              {note.toFixed(1)}/20
            </div>
          );
        },
      },
      {
        accessorKey: "note_classe",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="hover:bg-gray-100 dark:hover:bg-gray-800 -ml-4"
            >
              Note Classe
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const note = row.getValue("note_classe") as number;
          const noteColorClass =
            note >= 15
              ? "text-green-600"
              : note >= 10
                ? "text-blue-600"
                : "text-red-600";
          return (
            <div className={`font-semibold ${noteColorClass}`}>
              {note.toFixed(1)}/20
            </div>
          );
        },
      },
      {
        id: "ecart",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="hover:bg-gray-100 dark:hover:bg-gray-800 -ml-4"
            >
              Écart
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        accessorFn: (row) => row.note_aladin - row.note_classe,
        cell: ({ row }) => {
          const noteAladin = row.getValue("note_aladin") as number;
          const noteClasse = row.getValue("note_classe") as number;
          const ecart = noteAladin - noteClasse;
          const ecartRounded = Math.round(ecart * 10) / 10;

          const getEcartBadge = () => {
            if (Math.abs(ecart) < 0.5) {
              return (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800"
                >
                  <Minus className="h-3 w-3" />
                  <span>≈ 0</span>
                </Badge>
              );
            }

            if (ecart > 0) {
              return (
                <Badge
                  variant="default"
                  className="flex items-center gap-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                >
                  <TrendingUp className="h-3 w-3" />
                  <span>+{ecartRounded}</span>
                </Badge>
              );
            }

            return (
              <Badge
                variant="destructive"
                className="flex items-center gap-1 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
              >
                <TrendingDown className="h-3 w-3" />
                <span>{ecartRounded}</span>
              </Badge>
            );
          };

          return <div className="flex justify-start">{getEcartBadge()}</div>;
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  if (!data || data.length === 0) {
    return (
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Tableau de Comparaison</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Pas encore de données à comparer
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Tableau de Comparaison</CardTitle>
      </CardHeader>
      <CardContent>
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
                    Aucune donnée disponible
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
