"use client"; // This line ensures the component is rendered as a Client Component

import { useEffect, useState } from "react";
import PageHeading from "@/components/PageHeading/PageHeading";

export default async function ActivityPage() {
  return (
    <div className="page-container">
      <PageHeading title="Gallery" />
    </div>
  );
}
