import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'messages.json');

// Utility function to read messages safely
async function readMessages(): Promise<string[]> {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const messages = JSON.parse(data);
    return Array.isArray(messages) ? messages : [];
  } catch {
    // File doesn't exist or JSON invalid
    return [];
  }
}

// Utility function to write messages safely
async function writeMessages(messages: string[]) {
  // Ensure the folder exists
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(messages, null, 2), 'utf-8');
}

export async function GET() {
  try {
    const messages = await readMessages();
    return NextResponse.json({ messages });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ messages: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const incoming = await request.json();

    let newMessages: string[] = [];

    if (Array.isArray(incoming)) {
      newMessages = incoming;
    } else if (typeof incoming === 'string') {
      newMessages = [incoming];
    } else if (incoming && typeof incoming.message === 'string') {
      newMessages = [incoming.message];
    } else {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    const existingMessages = await readMessages();
    const combinedMessages = [...existingMessages, ...newMessages];

    await writeMessages(combinedMessages);

    return NextResponse.json({ message: 'Messages saved', messages: combinedMessages }, { status: 200 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Failed to save messages' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Try to parse body for index to delete a single message
    const body = await request.json().catch(() => ({}));
    const messages = await readMessages();

    if (typeof body.index === 'number') {
      if (body.index < 0 || body.index >= messages.length) {
        return NextResponse.json({ error: 'Invalid index' }, { status: 400 });
      }
      messages.splice(body.index, 1);
      await writeMessages(messages);
      return NextResponse.json({ message: 'Message deleted', messages });
    } else {
      // Delete all messages (remove file)
      await fs.unlink(filePath).catch(() => {}); // ignore error if file doesn't exist
      return NextResponse.json({ message: 'All messages deleted', messages: [] });
    }
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ message: 'No messages to delete', messages: [] });
  }
}
