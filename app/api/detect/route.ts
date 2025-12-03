import { NextRequest, NextResponse } from "next/server";
import { detectCMSFromUrl } from "@/utils/detectCMS";

export async function POST(req: NextRequest) {
  const data = await req.json();

  if (data.url) {
    const result = await detectCMSFromUrl(data.url);
    return NextResponse.json(result);
  }

  if (data.csv) {
    // Erst nach Zeilenumbrüchen trennen, dann jede Zeile nach Kommas
    const lines = data.csv.split(/\r?\n/);
    const urls: string[] = [];
    
    for (const line of lines) {
      // Jede Zeile nach Kommas trennen und Whitespace entfernen
      const urlsInLine = line.split(',').map((url: string) => url.trim()).filter(Boolean);
      urls.push(...urlsInLine);
    }
    
    const results = [];

    for (const url of urls) {
      const r = await detectCMSFromUrl(url);
      results.push({ url, ...r });
    }

    return NextResponse.json(results);
  }

  return NextResponse.json(
    { error: "Keine URL oder CSV gefunden." },
    { status: 400 }
  );
}
