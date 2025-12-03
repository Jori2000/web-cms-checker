"use client";

import styled from "styled-components";
import { useState, useRef } from "react";
import type { Theme } from "@/styles/theme";

const Box = styled.div`
  margin-top: 10px;
`;

const Label = styled.label<{ $theme: Theme }>`
  display: block;
  font-weight: 600;
  margin-bottom: 10px;
  color: ${props => props.$theme.textPrimary};
  font-size: 1rem;
`;

const UploadArea = styled.div<{ $isDragging: boolean; $theme: Theme }>`
  border: 2px dashed ${props => props.$isDragging ? props.$theme.primary : props.$theme.border};
  border-radius: 10px;
  padding: 30px;
  text-align: center;
  background: ${props => props.$isDragging ? `${props.$theme.primary}11` : props.$theme.inputBackground};
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    border-color: ${props => props.$theme.primary};
    background: ${props => `${props.$theme.primary}11`};
  }
  
  @media (max-width: 768px) {
    padding: 24px 16px;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 10px;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const UploadText = styled.p<{ $theme: Theme }>`
  color: ${props => props.$theme.textSecondary};
  margin: 8px 0;
  font-size: 0.95rem;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const UploadButton = styled.button<{ $theme: Theme }>`
  margin-top: 12px;
  padding: 10px 24px;
  border-radius: 8px;
  background: ${props => props.$theme.cardBackground};
  color: ${props => props.$theme.primary};
  font-weight: 600;
  cursor: pointer;
  border: 2px solid ${props => props.$theme.primary};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.$theme.primary};
    color: white;
  }
  
  @media (max-width: 768px) {
    padding: 12px 20px;
    font-size: 0.95rem;
  }
`;

const FileName = styled.div<{ $theme: Theme }>`
  margin-top: 15px;
  padding: 12px;
  background: ${props => `${props.$theme.success}22`};
  border-radius: 8px;
  color: ${props => props.$theme.success};
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 10px;
    word-break: break-all;
  }
`;

export default function FileUpload({ onResult, theme }: { onResult: (d: any) => void; theme: Theme }) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCSV = async (file: File) => {
    setSelectedFile(file.name);
    setLoading(true);
    
    try {
      const text = await file.text();

      const res = await fetch("/api/detect", {
        method: "POST",
        body: JSON.stringify({ csv: text })
      });

      onResult(await res.json());
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].name.endsWith('.csv')) {
      handleCSV(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleCSV(e.target.files[0]);
    }
  };

  return (
    <Box>
      <Label $theme={theme}>CSV-Datei hochladen</Label>
      <UploadArea
        $isDragging={isDragging}
        $theme={theme}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <UploadIcon>📄</UploadIcon>
        <UploadText $theme={theme}>
          <strong>Datei hier ablegen</strong> oder klicken zum Auswählen
        </UploadText>
        <UploadText $theme={theme} style={{ fontSize: '0.85rem' }}>
          CSV-Dateien mit mehreren URLs werden unterstützt
        </UploadText>
        <UploadButton $theme={theme} type="button">
          Datei auswählen
        </UploadButton>
        <HiddenInput
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
        />
      </UploadArea>
      {loading && (
        <FileName $theme={theme}>
          ⏳ Analysiere {selectedFile}...
        </FileName>
      )}
      {selectedFile && !loading && (
        <FileName $theme={theme}>
          ✅ {selectedFile} erfolgreich analysiert
        </FileName>
      )}
    </Box>
  );
}