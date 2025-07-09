import ProfilePage from "@/components/ProfilePage";
import ProtectedComponent from "@/components/ProtectedComponent";
import React from "react";

const page = () => {
  return (
    <ProtectedComponent>
      <ProfilePage />
    </ProtectedComponent>
  );
};

export default page;
