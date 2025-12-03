"use client";

import styled from "styled-components";
import { useState } from "react";
import UrlInput from "@/components/UrlInput";
import FileUpload from "@/components/FileUpload";
import ResultBox from "@/components/ResultBox";

const Container = styled.div`
  max-width: 750px;
  margin: 60px auto;
  padding: 20px;
  font-family: sans-serif;
`;

export default function Home() {
  const [result, setResult] = useState<any>(null);

  return (
    <Container>
      <h1>CMS Checker</h1>
      <UrlInput onResult={setResult} />
      <FileUpload onResult={setResult} />
      <ResultBox data={result} />
    </Container>
  );
}
