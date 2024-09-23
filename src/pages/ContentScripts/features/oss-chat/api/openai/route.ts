import { createOpenAI } from '@ai-sdk/openai';
import { StreamingTextResponse, streamText } from 'ai';

export async function POST(request: Request) {
  const { messages = [] }: Partial<{ messages: Array<any> }> = await request.json();

  const PickMessages = messages.map((message) => {
    return {
      role: message.role,
      content: message.content,
    };
  });
  const openai = createOpenAI({
    // custom settings, e.g.
    apiKey: 'sk-cc97b460219f4785a1e13681641bb326', // your openai key
    baseURL: 'https://api.deepseek.com/v1', // if u dont need change baseUrl，you can delete this line
    compatibility: 'compatible',
  });

  const stream = await streamText({
    model: openai('deepseek-chat'),
    messages: [...PickMessages],
    temperature: 0.95, // never use 1.0, some models do not support it
    maxRetries: 3,
  });
  return new StreamingTextResponse(stream.textStream);
}
