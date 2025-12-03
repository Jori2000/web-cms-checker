"use client";

import styled from "styled-components";

const Box = styled.div`
  margin-top: 30px;
  padding: 20px;
  background: #fafafa;
  border-radius: 6px;
`;

export default function ResultBox({ data }: { data: any }) {
  if (!data) return null;

  return (
    <Box>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Box>
  );
}