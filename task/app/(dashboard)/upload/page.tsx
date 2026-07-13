import UploadForm from "@/components/upload/UploadForm";

export default function UploadPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Upload Call</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Upload an audio file and let AI analyze the sales call.
        </p>
      </div>
      <UploadForm />
    </div>
  );
}
