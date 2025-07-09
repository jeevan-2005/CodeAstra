import ProtectedComponent from "@/components/ProtectedComponent";
import UserProblemSubmissions from "@/components/UserProblemSubmissions";
import React from "react";

const page = async ({
  params,
}: {
  params: Promise<{ problemSlug: string }>;
}) => {
  const { problemSlug } = await params;
  return (
    <ProtectedComponent>
      <UserProblemSubmissions problemSlug={decodeURIComponent(problemSlug)} />
    </ProtectedComponent>
  );
};

export default page;
