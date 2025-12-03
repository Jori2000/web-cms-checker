"use client";

import styled from "styled-components";
import { useState } from "react";

const Box = styled.div`
  margin-bottom: 10px;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
  font-size: 1rem;
`;

const InputWrapper = styled.div`
  display: flex;
  gap: 12px;
  align-items: stretch;
`;

const Input = styled.input`
  flex: 1;
  padding: 14px 18px;
  border-radius: 10px;
  border: 2px solid #e0e0e0;
  font-size: 1rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: #999;
  }
`;

const Button = styled.button`
  padding: 14px 32px;
  border-radius: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
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

export default function UrlInput({ onResult }: { onResult: (d: any) => void }) {
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
      <Label>Check URL</Label>
      <InputWrapper>
        <Input
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
        <Button onClick={handleCheck} disabled={loading || !url.trim()}>
          {loading ? "Checking..." : "Analyze"}
        </Button>
      </InputWrapper>
    </Box>
  );
}
