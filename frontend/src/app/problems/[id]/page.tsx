import ProblemDetial from "@/components/ProblemDetial";
import ProtectedComponent from "@/components/ProtectedComponent";
import React from "react";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return (
    <div>
      <ProtectedComponent>
        <ProblemDetial id={Number(id)} />
      </ProtectedComponent>
    </div>
  );
};

export default page;
