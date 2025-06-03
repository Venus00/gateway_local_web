import React from "react";

export function StaticGrid({ children }: { children?: React.ReactNode }) {
  return (
    <div className=" p-3 grid grid-cols-1  md:grid-cols-6 xl:grid-cols-9 2xl:grid-cols-12 auto-rows-[80px] gap-1 w-full min-h-[70vh] grid-flow-dense">
      {children}
    </div>
  );
}
