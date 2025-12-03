"use client";

import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import type { Theme } from "@/styles/theme";

const Container = styled.div`
  margin-top: 30px;
  scroll-margin-top: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
  
  @media (max-width: 768px) {
    justify-content: center;
    text-align: center;
  }
`;

const Title = styled.h2<{ $theme: Theme }>`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.$theme.textPrimary};
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
    width: 100%;
    order: 1;
  }
`;

const CopyButton = styled.button<{ $theme: Theme }>`
  padding: 10px 20px;
  border-radius: 8px;
  background: ${props => props.$theme.gradient};
  color: white;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.$theme.shadowHover};
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    order: 2;
    justify-content: center;
    padding: 12px 16px;
    font-size: 0.95rem;
  }
`;

const ResultCard = styled.div<{ $theme: Theme }>`
  background: ${props => props.$theme.cardBackground};
  border-radius: 12px;
  padding: 24px;
  box-shadow: ${props => props.$theme.shadow};
  margin-bottom: 16px;
  border-left: 4px solid ${props => props.$theme.primary};
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    padding: 20px 16px;
    border-radius: 10px;
  }
`;

const SingleResultCard = styled(ResultCard)<{ $theme: Theme }>`
  border-left: 4px solid ${props => props.$theme.success};
`;

const ResultUrl = styled.div<{ $theme: Theme }>`
  font-size: 0.9rem;
  color: ${props => props.$theme.primary};
  font-weight: 600;
  margin-bottom: 12px;
  word-break: break-all;
`;

const CMSName = styled.div<{ $theme: Theme }>`
  font-size: 1.4rem;
  font-weight: 700;
  color: ${props => props.$theme.textPrimary};
  margin-bottom: 8px;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 16px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InfoLabel = styled.span<{ $theme: Theme }>`
  font-size: 0.85rem;
  color: ${props => props.$theme.textSecondary};
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InfoValue = styled.span<{ $theme: Theme }>`
  font-size: 1rem;
  color: ${props => props.$theme.textPrimary};
  font-weight: 600;
`;

const ConfidenceBadge = styled.span<{ $confidence: number; $theme: Theme }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  background: ${props => 
    props.$confidence >= 70 ? props.$theme.success :
    props.$confidence >= 40 ? props.$theme.warning : props.$theme.error
  };
  color: white;
`;

const ReasonsList = styled.div`
  margin-top: 12px;
`;

const ReasonsTitle = styled.div<{ $theme: Theme }>`
  font-size: 0.85rem;
  color: ${props => props.$theme.textSecondary};
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
`;

const ReasonTag = styled.span<{ $theme: Theme }>`
  display: inline-block;
  padding: 4px 10px;
  margin: 4px 4px 4px 0;
  border-radius: 6px;
  background: ${props => props.$theme.inputBackground};
  color: ${props => props.$theme.textPrimary};
  font-size: 0.85rem;
  border: 1px solid ${props => props.$theme.border};
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 4px 8px;
  }
`;

const CopyFeedback = styled.span<{ $show: boolean }>`
  opacity: ${props => props.$show ? 1 : 0};
  transition: opacity 0.2s ease;
  margin-left: 8px;
`;

export default function ResultBox({ data, theme }: { data: any; theme: Theme }) {
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll zum Ergebnis, wenn neue Daten geladen werden
  useEffect(() => {
    if (data && containerRef.current) {
      // Kleine Verzögerung für smoothes Scroll-Verhalten
      setTimeout(() => {
        containerRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    }
  }, [data]);

  if (!data) return null;

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  // Prüfen, ob es ein Array (CSV) oder ein einzelnes Ergebnis ist
  const isMultiple = Array.isArray(data);
  const results = isMultiple ? data : [data];

  return (
    <Container ref={containerRef}>
      <Header>
        <Title $theme={theme}>
          {isMultiple ? `🔍 ${results.length} Ergebnisse` : "🔍 Ergebnis"}
        </Title>
        <CopyButton $theme={theme} onClick={handleCopyAll}>
          📋 JSON kopieren
          <CopyFeedback $show={copied}>✓</CopyFeedback>
        </CopyButton>
      </Header>

      {results.map((result: any, index: number) => {
        const CardComponent = isMultiple ? ResultCard : SingleResultCard;
        
        return (
          <CardComponent key={index} $theme={theme}>
            {result.url && <ResultUrl $theme={theme}>🌐 {result.url}</ResultUrl>}
            
            <CMSName $theme={theme}>
              {result.cms || "Unbekannt"}
            </CMSName>

            <InfoGrid>
              <InfoItem>
                <InfoLabel $theme={theme}>Confidence</InfoLabel>
                <InfoValue $theme={theme}>
                  <ConfidenceBadge $confidence={result.confidence || 0} $theme={theme}>
                    {result.confidence ? `${Math.round(result.confidence)}%` : "0%"}
                  </ConfidenceBadge>
                </InfoValue>
              </InfoItem>

              {result.version && (
                <InfoItem>
                  <InfoLabel $theme={theme}>Version</InfoLabel>
                  <InfoValue $theme={theme}>{result.version}</InfoValue>
                </InfoItem>
              )}

              {result.reason && (
                <InfoItem>
                  <InfoLabel $theme={theme}>Grund</InfoLabel>
                  <InfoValue $theme={theme}>{result.reason}</InfoValue>
                </InfoItem>
              )}
            </InfoGrid>

            {result.reasons && result.reasons.length > 0 && (
              <ReasonsList>
                <ReasonsTitle $theme={theme}>Erkennungsmerkmale</ReasonsTitle>
                {result.reasons.map((reason: string, i: number) => (
                  <ReasonTag key={i} $theme={theme}>{reason}</ReasonTag>
                ))}
              </ReasonsList>
            )}
          </CardComponent>
        );
      })}
    </Container>
  );
}