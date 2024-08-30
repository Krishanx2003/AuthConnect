import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { LampDemo } from "@/components/LampDemo";
import { FlipWords } from "@/components/ui/flip-words";

const Dashboard = async () => {
  const words = ["better", "cute", "beautiful", "modern"];

  const session = await getServerSession();
  if (!session) {
    redirect("/");
    return null; // Ensure that the component returns nothing if redirected
  }
  return (
    <div className="h-[40rem] flex justify-center items-center px-4">
    <div className="text-4xl mx-auto font-normal text-neutral-600 dark:text-neutral-400">
      Build
      <FlipWords words={words} /> <br />
      websites with Aceternity UI
    </div>
  </div>
);

};

export default Dashboard;
