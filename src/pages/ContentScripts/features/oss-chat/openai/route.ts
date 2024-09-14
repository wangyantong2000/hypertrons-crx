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
    apiKey: 'sk-PKT3SVOCcP3FkHeR875dBd2e8dEf4754B9Cc0bF633858759', // your openai key
    baseURL: 'https://xiaoai.plus/v1', // if u dont need change baseUrl，you can delete this line
    compatibility: 'compatible',
  });

  const stream = await streamText({
    model: openai('gpt-3.5-turbo'),
    messages: [...PickMessages],
  });
  return new StreamingTextResponse(stream.textStream);
}