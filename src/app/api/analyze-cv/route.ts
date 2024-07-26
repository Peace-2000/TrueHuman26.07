import { NextResponse } from 'next/server';
import * as fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const url = formData.get('url') as string | null;
    const file = formData.get('file') as File | null;

    if (!url && !file) {
      console.error('No URL or file provided');
      return NextResponse.json({ error: 'No URL or file provided' }, { status: 400 });
    }

    const apiKey = process.env.RESUME_PARSER_API_KEY;

    if (!apiKey) {
      console.error('API key not configured');
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    let apiUrl: string;
    let options: RequestInit = {
      method: 'GET',
      headers: { 'apikey': apiKey }
    };

    if (url) {
      apiUrl = `https://api.apilayer.com/resume_parser/url?url=${encodeURIComponent(url)}`;
    } else if (file) {
      // Ensure the temporary directory exists
      const tmpDir = path.join(process.cwd(), 'tmp');
      console.log('Creating temporary directory:', tmpDir);
      await fs.mkdir(tmpDir, { recursive: true });

      // Save the file temporarily
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filePath = path.join(tmpDir, file.name);
      console.log('Saving file to:', filePath);
      await fs.writeFile(filePath, buffer);

      apiUrl = 'https://api.apilayer.com/resume_parser/upload';
      options = {
        method: 'POST',
        headers: { 
          'apikey': apiKey,
          'Content-Type': 'multipart/form-data'  // Specify content type for file upload
        } as Record<string, string>,
        body: buffer
      };
    } else {
      console.error('No URL or file provided');
      return NextResponse.json({ error: 'No URL or file provided' }, { status: 400 });
    }

    console.log('Fetching API:', apiUrl, options);
    const response = await fetch(apiUrl, options);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      return NextResponse.json({ error: errorData.message || 'Failed to parse resume' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error parsing resume:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
