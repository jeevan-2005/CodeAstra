import ProtectedComponent from "@/components/ProtectedComponent";
import SubmissionsPage from "@/components/SubmissionsPage";
import React from "react";

const page = () => {
  return (
    <ProtectedComponent>
      <SubmissionsPage />
    </ProtectedComponent>
  );
};

export default page;
