import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Call {
  _id: string;
  advisorId: { name?: string } | string;
  teamId: { name?: string } | string;
  processingStatus: string;
  duration?: number;
  analysis?: { overallScore?: number };
  createdAt: string;
}

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  COMPLETED: "default",
  FAILED: "destructive",
  UPLOADED: "outline",
  TRANSCRIBING: "secondary",
  DIARIZING: "secondary",
  ANALYZING: "secondary",
};

function formatDuration(seconds?: number) {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

async function getCalls(): Promise<Call[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/calls`, {
      cache: "no-store",
    });
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export default async function DashboardPage() {
  const calls = await getCalls();

  const completed = calls.filter((c) => c.processingStatus === "COMPLETED");
  const avgScore =
    completed.length > 0
      ? Math.round(
          completed.reduce((sum, c) => sum + (c.analysis?.overallScore ?? 0), 0) /
            completed.length
        )
      : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">All uploaded calls</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{calls.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{completed.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{avgScore !== null ? `${avgScore}/100` : "—"}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Calls</CardTitle>
        </CardHeader>
        <CardContent>
          {calls.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No calls yet.{" "}
              <Link href="/upload" className="underline">
                Upload one
              </Link>
              .
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Advisor</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {calls.map((call) => (
                  <TableRow key={call._id}>
                    <TableCell>
                      <Link
                        href={`/calls/${call._id}`}
                        className="text-primary underline font-mono text-xs"
                      >
                        {call._id.slice(-8)}
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm">
                      {typeof call.advisorId === "object"
                        ? (call.advisorId.name ?? "—")
                        : call.advisorId}
                    </TableCell>
                    <TableCell className="text-sm">
                      {typeof call.teamId === "object"
                        ? (call.teamId.name ?? "—")
                        : call.teamId}
                    </TableCell>
                    <TableCell className="text-sm">{formatDuration(call.duration)}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[call.processingStatus] ?? "outline"}>
                        {call.processingStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {call.analysis?.overallScore != null
                        ? `${call.analysis.overallScore}/100`
                        : "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(call.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
