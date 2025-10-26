"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Activity {
  id: string;
  childName: string;
  childColor: string; // Couleur pour identifier l'enfant
  type: "quiz" | "cours" | "groupe";
  subject?: string;
  title: string;
  date: string;
  score?: number;
}

interface ParentRecentActivitiesProps {
  activities: Activity[];
}

const activityTypeConfig = {
  quiz: { label: "Quiz", color: "bg-red-100 text-red-800" },
  cours: { label: "Cours", color: "bg-blue-100 text-blue-800" },
  groupe: { label: "Groupe", color: "bg-teal-100 text-teal-800" },
};

export function ParentRecentActivities({
  activities,
}: ParentRecentActivitiesProps) {
  if (activities.length === 0) {
    return (
      <Card className="bg-white rounded-[24px] shadow-md border-0">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900">
            Activités récentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[200px] items-center justify-center text-gray-500">
            Aucune activité récente
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-[24px] shadow-md hover:shadow-lg transition-shadow duration-300 border-0">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-gray-900">
          Activités récentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Enfant</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Titre</TableHead>
              <TableHead>Matière</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((activity) => {
              const typeConfig = activityTypeConfig[activity.type];
              return (
                <TableRow key={activity.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: activity.childColor }}
                      />
                      <span className="font-medium">{activity.childName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={typeConfig.color}>
                      {typeConfig.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {activity.title}
                  </TableCell>
                  <TableCell>
                    {activity.subject || (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(activity.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {activity.score !== undefined ? (
                      <span
                        className={`font-semibold ${
                          activity.score >= 10
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {activity.score}/20
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
