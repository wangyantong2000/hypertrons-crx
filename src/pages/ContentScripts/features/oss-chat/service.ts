import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage } from '@langchain/core/messages';
import View from './view';
import { forEach } from 'lodash';
import { ChatPromptTemplate, HumanMessagePromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { ImageURLContentBlock, Message, MessageContent, Role } from './interface';

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
const buildPrompt = async () => {

  const basePrompt =
    '你是来自x-lab实验室的围绕GitHub平台的智能问答机器人';
 
  return prompt;
};
export const getResponse = async (messages: any,model: any) => {
  const prompt = ChatPromptTemplate.fromMessages([HumanMessagePromptTemplate.fromTemplate('{input}')].filter(Boolean));
  const chain = prompt.pipe(model);
  const basePrompt =
  '你是来自x-lab实验室的围绕GitHub平台的智能问答机器人';
    const responseStream = await chain.stream({ input:basePrompt+messages });
  //   const responseStream=await model.stream([new HumanMessage({ content: messages })]);
  return handleStream(responseStream);

};
