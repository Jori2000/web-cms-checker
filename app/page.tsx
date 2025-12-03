"use client";

import styled from "styled-components";
import { useState } from "react";
import UrlInput from "@/components/UrlInput";
import FileUpload from "@/components/FileUpload";
import ResultBox from "@/components/ResultBox";

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 50px;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin: 0 0 20px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07), 0 10px 20px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 30px 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #e0e0e0;
  }
  
  &::before {
    margin-right: 15px;
  }
  
  &::after {
    margin-left: 15px;
  }
  
  span {
    color: #999;
    font-size: 0.9rem;
    font-weight: 500;
  }
`;

export default function Home() {
  const [result, setResult] = useState<any>(null);

  return (
    <Container>
      <Header>
        <Title>🔍 CMS Check</Title>
        <Subtitle>
          Find out which Content Management System (CMS) a website is using by entering its URL or uploading an HTML file.
        </Subtitle>
      </Header>

      <Card>
        <UrlInput onResult={setResult} />
        
        <Divider>
          <span>OR</span>
        </Divider>
        
        <FileUpload onResult={setResult} />
      </Card>

      <ResultBox data={result} />
    </Container>
  );
}
