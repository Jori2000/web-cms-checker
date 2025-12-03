"use client";

import styled from "styled-components";
import { useState, useRef } from "react";

const Box = styled.div`
  margin-top: 10px;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
  font-size: 1rem;
`;

const UploadArea = styled.div<{ $isDragging: boolean }>`
  border: 2px dashed ${props => props.$isDragging ? '#667eea' : '#e0e0e0'};
  border-radius: 10px;
  padding: 30px;
  text-align: center;
  background: ${props => props.$isDragging ? 'rgba(102, 126, 234, 0.05)' : '#fafafa'};
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.05);
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 10px;
`;

const UploadText = styled.p`
  color: #666;
  margin: 8px 0;
  font-size: 0.95rem;
`;

const UploadButton = styled.button`
  margin-top: 12px;
  padding: 10px 24px;
  border-radius: 8px;
  background: white;
  color: #667eea;
  font-weight: 600;
  cursor: pointer;
  border: 2px solid #667eea;
  transition: all 0.2s ease;
  
  &:hover {
    background: #667eea;
    color: white;
  }
`;

const FileName = styled.div`
  margin-top: 15px;
  padding: 12px;
  background: #e8f5e9;
  border-radius: 8px;
  color: #2e7d32;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

export default function FileUpload({ onResult }: { onResult: (d: any) => void }) {
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
      <Label>CSV upload</Label>
      <UploadArea
        $isDragging={isDragging}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <UploadIcon>📄</UploadIcon>
        <UploadText>
          <strong>Drop file here</strong> or click to select
        </UploadText>
        <UploadText style={{ fontSize: '0.85rem', color: '#999' }}>
          CSV files with multiple URLs are supported
        </UploadText>
        <UploadButton type="button">
          Select file
        </UploadButton>
        <HiddenInput
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
        />
      </UploadArea>
      {loading && (
        <FileName>
          ⏳ Analyzing {selectedFile}...
        </FileName>
      )}
      {selectedFile && !loading && (
        <FileName>
          ✅ {selectedFile} successfully analyzed
        </FileName>
      )}
    </Box>
  );
}