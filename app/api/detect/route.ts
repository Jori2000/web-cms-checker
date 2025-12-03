import { NextRequest, NextResponse } from "next/server";
import { detectCMSFromUrl } from "@/utils/detectCMS";

export async function POST(req: NextRequest) {
  const data = await req.json();

  if (data.url) {
    const result = await detectCMSFromUrl(data.url);
    return NextResponse.json(result);
  }

  if (data.csv) {
    const urls = data.csv.split(/\r?\n/).filter(Boolean);
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
