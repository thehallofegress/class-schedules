import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const { fileName, data } = await req.json();
    console.log("")
    if (!fileName || !data) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "public", fileName);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");

    return NextResponse.json({ message: "File saved successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error saving file:", error);
    return NextResponse.json({ error: "Failed to save file" }, { status: 500 });
  }
}
