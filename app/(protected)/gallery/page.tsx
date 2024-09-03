"use client";
import ImageUpload from '../image-upload';

import { useEffect, useState } from "react";
import PageHeading from "@/components/PageHeading/PageHeading";

export default async function Gallery() {
  return (
    <div className="page-container">
      <PageHeading title="Gallery" />
      <ImageUpload/>
    </div>
  );
}
