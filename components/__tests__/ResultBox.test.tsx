import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ThemeProvider } from "@/context/ThemeContext";
import { lightTheme } from "@/styles/theme";
import ResultBox from "../ResultBox";

// Mock für navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn()
  }
});

describe("ResultBox", () => {
  const mockTheme = lightTheme;

  it("should not render when data is null", () => {
    const { container } = render(
      <ResultBox data={null} theme={mockTheme} />
    );
    
    expect(container.firstChild).toBeNull();
  });

  it("should render single result", () => {
    const data = {
      cms: "WordPress",
      confidence: 85,
      reasons: ["Generator-Tag", "WordPress-path found"]
    };

    render(<ResultBox data={data} theme={mockTheme} />);

    expect(screen.getByText("🔍 Ergebnis")).toBeInTheDocument();
    expect(screen.getByText("WordPress")).toBeInTheDocument();
    expect(screen.getByText("85%")).toBeInTheDocument();
  });

  it("should render multiple results", () => {
    const data = [
      {
        url: "https://example1.com",
        cms: "WordPress",
        confidence: 85,
        reasons: ["Generator-Tag"]
      },
      {
        url: "https://example2.com",
        cms: "Drupal",
        confidence: 75,
        reasons: ["Drupal patterns found"]
      }
    ];

    render(<ResultBox data={data} theme={mockTheme} />);

    expect(screen.getByText("🔍 2 Ergebnisse")).toBeInTheDocument();
    expect(screen.getByText("WordPress")).toBeInTheDocument();
    expect(screen.getByText("Drupal")).toBeInTheDocument();
  });

  it("should display version when available", () => {
    const data = {
      cms: "WordPress",
      version: "6.4.2",
      confidence: 90,
      reasons: ["Generator-Tag"]
    };

    render(<ResultBox data={data} theme={mockTheme} />);

    expect(screen.getByText("6.4.2")).toBeInTheDocument();
  });

  it("should display URL for results", () => {
    const data = {
      url: "https://example.com",
      cms: "Shopify",
      confidence: 80,
      reasons: ["Shopify CDN found"]
    };

    render(<ResultBox data={data} theme={mockTheme} />);

    expect(screen.getByText("🌐 https://example.com")).toBeInTheDocument();
  });

  it("should copy JSON to clipboard", async () => {
    const data = {
      cms: "WordPress",
      confidence: 85,
      reasons: ["Generator-Tag"]
    };

    render(<ResultBox data={data} theme={mockTheme} />);

    const copyButton = screen.getByText("📋 JSON kopieren");
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        JSON.stringify(data, null, 2)
      );
    });
  });

  it("should render blocked access warning", () => {
    const data = {
      cms: "⚠️ Zugriff blockiert",
      confidence: 0,
      reasons: [
        "Die Website blockiert automatisierte Zugriffe (Bot-Protection).",
        "Bitte öffne die URL im Browser, um das CMS manuell zu identifizieren."
      ]
    };

    render(<ResultBox data={data} theme={mockTheme} />);

    expect(screen.getByText("⚠️ Zugriff blockiert")).toBeInTheDocument();
    expect(screen.getByText(/blockiert automatisierte Zugriffe/)).toBeInTheDocument();
  });

  it("should display reasons as tags", () => {
    const data = {
      cms: "Drupal",
      confidence: 75,
      reasons: ["Generator-Tag", "Drupal patterns found", "X-Generator Header"]
    };

    render(<ResultBox data={data} theme={mockTheme} />);

    expect(screen.getByText("Generator-Tag")).toBeInTheDocument();
    expect(screen.getByText("Drupal patterns found")).toBeInTheDocument();
    expect(screen.getByText("X-Generator Header")).toBeInTheDocument();
  });
});
