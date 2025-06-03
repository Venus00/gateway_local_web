import { SearchX } from "lucide-react";

export default function NotFound({ timeframe }: { timeframe?: string }) {
  return (
    <main className="grid place-content-center  p-4 ">
      <h3 className=" text-foreground/50 lg:text-3xl md:text-xl text-center text-sm flex flex-col gap-1 items-center">
        <SearchX />
        <span>No data available for the last {timeframe}.</span>
      </h3>
      {/* <div>{JSON.stringify({ telemetries })}</div> */}
    </main>
  );
}
