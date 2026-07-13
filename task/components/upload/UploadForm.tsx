"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UploadForm() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setStatus(null);

    const form = e.currentTarget;
    const advisorId = (form.elements.namedItem("advisorId") as HTMLInputElement).value.trim();
    const teamId = (form.elements.namedItem("teamId") as HTMLInputElement).value.trim();
    const duration = (form.elements.namedItem("duration") as HTMLInputElement).value.trim();
    const audio = fileRef.current?.files?.[0];

    if (!advisorId || !teamId || !audio) {
      setError("Advisor ID, Team ID, and audio file are required.");
      return;
    }

    const formData = new FormData();
    formData.append("advisorId", advisorId);
    formData.append("teamId", teamId);
    if (duration) formData.append("duration", duration);
    formData.append("audio", audio);

    setLoading(true);
    setStatus("Uploading and processing — this may take a minute...");

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json();

      if (!res.ok) {
        setError(json.message ?? "Upload failed.");
        setStatus(null);
        return;
      }

      const callId = json.data?._id;
      router.push(callId ? `/calls/${callId}` : "/dashboard");
    } catch {
      setError("Network error. Please try again.");
      setStatus(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle className="text-base">Upload Sales Call</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="advisorId">Advisor ID (MongoDB ObjectId)</Label>
            <Input id="advisorId" name="advisorId" placeholder="e.g. 507f1f77bcf86cd799439011" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="teamId">Team ID (MongoDB ObjectId)</Label>
            <Input id="teamId" name="teamId" placeholder="e.g. 507f1f77bcf86cd799439012" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="duration">Duration (seconds, optional)</Label>
            <Input id="duration" name="duration" type="number" min="1" placeholder="e.g. 300" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="audio">Audio File</Label>
            <Input id="audio" name="audio" type="file" accept="audio/*" ref={fileRef} />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {status && <p className="text-sm text-muted-foreground">{status}</p>}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Processing..." : "Upload & Analyze"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
