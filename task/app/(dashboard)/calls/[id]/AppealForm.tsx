"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface IssueFlag {
  issue: string;
  severity: string;
  timestamp: string;
  quote: string;
  reason: string;
}

interface Props {
  callId: string;
  advisorId: string;
  flags: IssueFlag[];
}

export default function AppealForm({ callId, advisorId, flags }: Props) {
  const [selectedIssue, setSelectedIssue] = useState(flags[0]?.issue ?? "");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedIssue || reason.length < 10) {
      setResult({ success: false, message: "Select an issue and provide at least 10 characters." });
      return;
    }
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/appeals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callId, advisorId, issue: selectedIssue, reason }),
      });
      const json = await res.json();
      if (!res.ok) {
        setResult({ success: false, message: json.message ?? "Failed to submit appeal." });
      } else {
        setResult({ success: true, message: "Appeal submitted successfully." });
        setReason("");
      }
    } catch {
      setResult({ success: false, message: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  if (flags.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          No flagged issues to appeal.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle className="text-base">Submit Appeal</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="issue">Issue to Appeal</Label>
            <select
              id="issue"
              value={selectedIssue}
              onChange={(e) => setSelectedIssue(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm bg-background"
            >
              {flags.map((f, i) => (
                <option key={i} value={f.issue}>
                  {f.issue} ({f.timestamp})
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="reason">Reason (min. 10 characters)</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              placeholder="Explain why this flag should be reviewed..."
            />
            <p className="text-xs text-muted-foreground">{reason.length} characters</p>
          </div>

          {result && (
            <p className={`text-sm ${result.success ? "text-green-600" : "text-destructive"}`}>
              {result.message}
            </p>
          )}

          <Button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Appeal"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
