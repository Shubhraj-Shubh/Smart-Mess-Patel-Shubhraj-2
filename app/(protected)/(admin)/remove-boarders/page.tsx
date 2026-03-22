import RemoveBoarderForm from "./remove-boarder-form";

export default function RemoveBoardersPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Remove Boarders</h1>
        <p className="text-muted-foreground">
          Upload an XLS/XLSX file and mark boarders inactive using roll numbers from
          the first column.
        </p>
      </div>

      <RemoveBoarderForm />
    </div>
  );
}
