import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage } from '@langchain/core/messages';
import View from './view';
import { forEach } from 'lodash';
import { ChatPromptTemplate, HumanMessagePromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { ImageURLContentBlock, Message, MessageContent, Role } from './interface';
const openaiKey = '';
const openaiModel = 'deepseek-chat';
const model = new ChatOpenAI({
  apiKey: openaiKey,
  configuration: {
    baseURL: 'https://api.deepseek.com/v1',
    fetch,
  },
  model: openaiModel,
  temperature: 0.95, // never use 1.0, some models do not support it
  maxRetries: 3,
});
interface Tool {
  type: string;
  extra: {
    source: string;
    pluginName: string;
    data: string;
    status: string;
  };
}
export const handleStream = async (stream: any) => {
  const encoder = new TextEncoder();

  const readableStream = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        console.log(chunk);
        try {
          const chunkText = chunk.content;
          controller.enqueue(encoder.encode(chunkText));
        } catch (err) {
          console.error(err);
          controller.error(err);
        }
      }
      controller.close();
    },
  });
  return new Response(readableStream);
};
export const convertChunkToJson = (rawData: string) => {
  const messages: string[] = [];
  const errors: string[] = [];
  try {
    forEach(rawData, (chunk) => {
      messages.push(chunk);
    });
    // final message
    return { message: messages.join(''), errors };
  } catch (error: any) {
    // it seems never happen
    errors.push(error.message);
    return { message: messages.join(''), errors };
  }
};
export const getResponse = async (messages: any) => {
  const prompt = ChatPromptTemplate.fromMessages([HumanMessagePromptTemplate.fromTemplate('{input}')].filter(Boolean));
  const chain = prompt.pipe(model);
  const responseStream = await chain.stream({ input: messages });
  //   const responseStream=await model.stream([new HumanMessage({ content: messages })]);
  return handleStream(responseStream);
};
