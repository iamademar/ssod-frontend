import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { cookies } from 'next/headers';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const assistants: { [key: string]: string } = {
  '1': 'asst_RznERPRfKfAmzHFEGPoFSCdp',
  '2': 'asst_vMmBlnTtKx1l3W8eTdy126oc',
  // Add more assistants as needed
};

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const assistantId = assistants[id];

  if (!assistantId) {
    return NextResponse.json({ error: 'Invalid assistant ID' }, { status: 400 });
  }

  return NextResponse.json({ message: 'Chatbot page loaded successfully' });
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { message, isPageRefresh } = await req.json();

    const assistantId = assistants[id];
    if (!assistantId) {
      return NextResponse.json({ error: 'Invalid assistant ID' }, { status: 400 });
    }

    const cookieStore = cookies();
    let threadId = cookieStore.get('threadId')?.value;

    // Create a new thread if it's a page refresh or if there's no existing threadId
    if (isPageRefresh || !threadId) {
      const thread = await openai.beta.threads.create();
      threadId = thread.id;
      cookieStore.set('threadId', threadId, { httpOnly: true, secure: true });
    }

    // Add the user's message to the existing thread
    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: message,
    });

    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    });

    // Poll for the run to complete
    let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
    while (runStatus.status !== 'completed') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
    }

    const messages = await openai.beta.threads.messages.list(threadId);
    const lastMessage = messages.data[0];

    let response = '';
    if (lastMessage.content[0].type === 'text') {
      response = lastMessage.content[0].text.value;
    } else {
      // Handle the case where the content is not text (e.g., an image)
      response = "The assistant's response was not in text format.";
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error in chatbot API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
