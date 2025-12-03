"use client";

import styled from "styled-components";
import { useState } from "react";

const Box = styled.div`
  margin: 20px 0;
`;

const Input = styled.input`
  padding: 10px;
  width: 80%;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  padding: 10px 15px;
  margin-left: 10px;
  border-radius: 5px;
  background: black;
  color: white;
  cursor: pointer;
`;

export default function UrlInput({ onResult }: { onResult: (d: any) => void }) {
  const [url, setUrl] = useState("");

  const handleCheck = async () => {
    const res = await fetch("/api/detect", {
      method: "POST",
      body: JSON.stringify({ url }),
    });

    onResult(await res.json());
  };

  return (
    <Box>
      <Input
        placeholder="URL eingeben…"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <Button onClick={handleCheck}>Check</Button>
    </Box>
  );
}
