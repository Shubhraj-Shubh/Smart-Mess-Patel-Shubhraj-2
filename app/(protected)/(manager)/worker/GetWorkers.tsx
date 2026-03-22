import { GetAllWorkers } from "@/actions/adminActions";
import WorkerCard from "./WorkerCard";
import { Accordion } from "@/components/ui/accordion";

export default async function Workers() {
  const workers = await GetAllWorkers();
  
  return (
    <>
      <h1 className="text-center text-2xl my-4">Staffs</h1>

      <div className="max-w-screen-lg m-auto border-b">
        <Accordion type="single" collapsible>
          {workers.map((worker, index) => (
            <WorkerCard key={index} worker={worker} />
          ))}
        </Accordion>
      </div>
    </>
  );
}
