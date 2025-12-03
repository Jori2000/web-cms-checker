"use client";

import styled from "styled-components";

const Box = styled.div`
  margin: 20px 0;
`;

export default function FileUpload({ onResult }: { onResult: (d: any) => void }) {
  const handleCSV = async (file: File) => {
    const text = await file.text();

    const res = await fetch("/api/detect", {
      method: "POST",
      body: JSON.stringify({ csv: text })
    });

    onResult(await res.json());
  };

  return (
    <Box>
      <input
        type="file"
        accept=".csv"
        onChange={(e) => e.target.files && handleCSV(e.target.files[0])}
      />
    </Box>
  );
}