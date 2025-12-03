"use client";

import styled from "styled-components";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { lightTheme, darkTheme } from "@/styles/theme";
import UrlInput from "@/components/UrlInput";
import FileUpload from "@/components/FileUpload";
import ResultBox from "@/components/ResultBox";

const PageWrapper = styled.div<{ $theme: typeof lightTheme }>`
  min-height: 100vh;
  background: ${props => props.$theme.background};
  transition: background 0.3s ease;
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  
  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

const ThemeToggle = styled.button<{ $theme: typeof lightTheme }>`
  position: fixed;
  top: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${props => props.$theme.cardBackground};
  border: 2px solid ${props => props.$theme.border};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: ${props => props.$theme.shadow};
  transition: all 0.3s ease;
  z-index: 1000;
  
  &:hover {
    transform: scale(1.1) rotate(10deg);
    box-shadow: ${props => props.$theme.shadowHover};
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  @media (max-width: 768px) {
    top: 12px;
    right: 12px;
    width: 44px;
    height: 44px;
    font-size: 1.3rem;
  }
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 50px;
  
  @media (max-width: 768px) {
    margin-bottom: 30px;
  }
`;

const Title = styled.h1<{ $theme: typeof lightTheme }>`
  font-size: 3rem;
  font-weight: 700;
  margin: 0 0 20px 0;
  background: ${props => props.$theme.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2rem;
    margin: 0 0 16px 0;
  }
`;

const Subtitle = styled.p<{ $theme: typeof lightTheme }>`
  font-size: 1.2rem;
  color: ${props => props.$theme.textSecondary};
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.5;
    padding: 0 8px;
  }
`;

const Card = styled.div<{ $theme: typeof lightTheme }>`
  background: ${props => props.$theme.cardBackground};
  border-radius: 16px;
  padding: 40px;
  box-shadow: ${props => props.$theme.shadow};
  margin-bottom: 30px;
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    padding: 24px 16px;
    border-radius: 12px;
  }
`;

const Divider = styled.div<{ $theme: typeof lightTheme }>`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 30px 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid ${props => props.$theme.border};
  }
  
  &::before {
    margin-right: 15px;
  }
  
  &::after {
    margin-left: 15px;
  }
  
  span {
    color: ${props => props.$theme.textMuted};
    font-size: 0.9rem;
    font-weight: 500;
  }
`;

export default function Home() {
  const [result, setResult] = useState<any>(null);
  const { theme, toggleTheme } = useTheme();
  const currentTheme = theme === "light" ? lightTheme : darkTheme;

  return (
    <PageWrapper $theme={currentTheme}>
      <ThemeToggle 
        onClick={toggleTheme} 
        $theme={currentTheme}
        aria-label="Toggle theme"
      >
        {theme === "light" ? "🌙" : "☀️"}
      </ThemeToggle>
      
      <Container>
        <Header>
          <Title $theme={currentTheme}>🔍 CMS Checker</Title>
          <Subtitle $theme={currentTheme}>
            Finden Sie heraus, welches Content Management System eine Website verwendet.
            Geben Sie einfach eine URL ein oder laden Sie eine CSV-Datei mit mehreren URLs hoch.
          </Subtitle>
        </Header>

        <Card $theme={currentTheme}>
          <UrlInput onResult={setResult} theme={currentTheme} />
          
          <Divider $theme={currentTheme}>
            <span>ODER</span>
          </Divider>
          
          <FileUpload onResult={setResult} theme={currentTheme} />
        </Card>

        <ResultBox data={result} theme={currentTheme} />
      </Container>
    </PageWrapper>
  );
}
