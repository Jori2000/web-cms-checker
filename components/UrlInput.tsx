"use client";

import styled from "styled-components";
import { useState } from "react";
import type { Theme } from "@/styles/theme";

const Box = styled.div`
  margin-bottom: 10px;
`;

const Label = styled.label<{ $theme: Theme }>`
  display: block;
  font-weight: 600;
  margin-bottom: 10px;
  color: ${props => props.$theme.textPrimary};
  font-size: 1rem;
`;

const InputWrapper = styled.div`
  display: flex;
  gap: 12px;
  align-items: stretch;
`;

const Input = styled.input<{ $theme: Theme }>`
  flex: 1;
  padding: 14px 18px;
  border-radius: 10px;
  border: 2px solid ${props => props.$theme.border};
  background: ${props => props.$theme.inputBackground};
  color: ${props => props.$theme.textPrimary};
  font-size: 1rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.$theme.primary};
    box-shadow: 0 0 0 3px ${props => props.$theme.primary}33;
  }
  
  &::placeholder {
    color: ${props => props.$theme.textMuted};
  }
`;

const Button = styled.button<{ $theme: Theme }>`
  padding: 14px 32px;
  border-radius: 10px;
  background: ${props => props.$theme.gradient};
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.$theme.shadowHover};
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export default function UrlInput({ onResult, theme }: { onResult: (d: any) => void; theme: Theme }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!url.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/detect", {
        method: "POST",
        body: JSON.stringify({ url }),
      });

      onResult(await res.json());
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCheck();
    }
  };

  return (
    <Box>
      <Label $theme={theme}>URL prüfen</Label>
      <InputWrapper>
        <Input
          $theme={theme}
          type="url"
          placeholder="https://beispiel.de"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
        <Button $theme={theme} onClick={handleCheck} disabled={loading || !url.trim()}>
          {loading ? "Prüfe..." : "Analysieren"}
        </Button>
      </InputWrapper>
    </Box>
  );
}
