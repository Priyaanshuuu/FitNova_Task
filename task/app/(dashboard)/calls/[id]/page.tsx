import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppealForm from "./AppealForm";

interface TranscriptSegment {
  speaker: string;
  text: string;
  startTime: number;
  endTime: number;
}

interface IssueFlag {
  issue: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  timestamp: string;
  quote: string;
  reason: string;
}

interface CallAnalysis {
  summary: string;
  overallScore: number;
  scores: {
    needsDiscovery: number;
    productKnowledge: number;
    objectionHandling: number;
    compliance: number;
    trialBooking: number;
  };
  flags: IssueFlag[];
  coachingSuggestions: string[];
}

interface Call {
  _id: string;
  advisorId: { name?: string; email?: string } | string;
  teamId: { name?: string } | string;
  processingStatus: string;
  duration?: number;
  transcript?: string;
  diarizedTranscript?: TranscriptSegment[];
  analysis?: CallAnalysis;
  createdAt: string;
}

async function getCall(id: string): Promise<Call | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/calls/${id}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

const severityVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  LOW: "outline",
  MEDIUM: "secondary",
  HIGH: "default",
  CRITICAL: "destructive",
};

function ScoreRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-medium">{value}/10</span>
      </div>
      <Progress value={value * 10} className="h-2" />
    </div>
  );
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CallDetailPage({ params }: PageProps) {
  const { id } = await params;
  const call = await getCall(id);

  if (!call) notFound();

  const advisorId =
    typeof call.advisorId === "object" ? (call.advisorId as { _id?: string })._id ?? "" : call.advisorId;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Call Detail</h1>
          <p className="text-xs text-muted-foreground font-mono mt-1">{call._id}</p>
        </div>
        <Badge
          variant={
            call.processingStatus === "COMPLETED"
              ? "default"
              : call.processingStatus === "FAILED"
              ? "destructive"
              : "secondary"
          }
        >
          {call.processingStatus}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Advisor</p>
          <p className="font-medium mt-0.5">
            {typeof call.advisorId === "object"
              ? (call.advisorId.name ?? advisorId)
              : call.advisorId}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Team</p>
          <p className="font-medium mt-0.5">
            {typeof call.teamId === "object" ? (call.teamId.name ?? "—") : call.teamId}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Date</p>
          <p className="font-medium mt-0.5">{new Date(call.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      {call.processingStatus !== "COMPLETED" && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground text-sm">
            {call.processingStatus === "FAILED"
              ? "Processing failed for this call."
              : `Processing in progress: ${call.processingStatus}`}
          </CardContent>
        </Card>
      )}

      {call.analysis && (
        <Tabs defaultValue="analysis">
          <TabsList>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="transcript">Transcript</TabsTrigger>
            <TabsTrigger value="flags">
              Flags ({call.analysis.flags?.length ?? 0})
            </TabsTrigger>
            <TabsTrigger value="appeal">Submit Appeal</TabsTrigger>
          </TabsList>

          <TabsContent value="analysis" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{call.analysis.summary}</p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Overall Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{call.analysis.overallScore}</p>
                  <p className="text-xs text-muted-foreground">out of 100</p>
                  <Progress value={call.analysis.overallScore} className="h-2 mt-3" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Score Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ScoreRow label="Needs Discovery" value={call.analysis.scores.needsDiscovery} />
                  <ScoreRow label="Product Knowledge" value={call.analysis.scores.productKnowledge} />
                  <ScoreRow label="Objection Handling" value={call.analysis.scores.objectionHandling} />
                  <ScoreRow label="Compliance" value={call.analysis.scores.compliance} />
                  <ScoreRow label="Trial Booking" value={call.analysis.scores.trialBooking} />
                </CardContent>
              </Card>
            </div>

            {call.analysis.coachingSuggestions?.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Coaching Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {call.analysis.coachingSuggestions.map((tip, i) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <span className="text-muted-foreground shrink-0">{i + 1}.</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="transcript" className="mt-4">
            <Card>
              <CardContent className="pt-4">
                {call.diarizedTranscript && call.diarizedTranscript.length > 0 ? (
                  <div className="space-y-3">
                    {call.diarizedTranscript.map((seg, i) => (
                      <div key={i} className="flex gap-3">
                        <span className="text-xs text-muted-foreground w-12 shrink-0 pt-0.5">
                          {formatTime(seg.startTime)}
                        </span>
                        <div>
                          <span
                            className={`text-xs font-semibold uppercase tracking-wide ${
                              seg.speaker === "Advisor"
                                ? "text-blue-600"
                                : "text-green-600"
                            }`}
                          >
                            {seg.speaker}
                          </span>
                          <p className="text-sm mt-0.5">{seg.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : call.transcript ? (
                  <pre className="text-sm whitespace-pre-wrap font-sans">{call.transcript}</pre>
                ) : (
                  <p className="text-sm text-muted-foreground">No transcript available.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="flags" className="mt-4 space-y-3">
            {call.analysis.flags?.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-sm text-muted-foreground">
                  No issues flagged.
                </CardContent>
              </Card>
            ) : (
              call.analysis.flags?.map((flag, i) => (
                <Card key={i}>
                  <CardContent className="pt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{flag.issue}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{flag.timestamp}</span>
                        <Badge variant={severityVariant[flag.severity] ?? "outline"}>
                          {flag.severity}
                        </Badge>
                      </div>
                    </div>
                    <blockquote className="border-l-2 pl-3 text-sm italic text-muted-foreground">
                      "{flag.quote}"
                    </blockquote>
                    <p className="text-sm">{flag.reason}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="appeal" className="mt-4">
            <AppealForm
              callId={call._id}
              advisorId={advisorId}
              flags={call.analysis.flags ?? []}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
