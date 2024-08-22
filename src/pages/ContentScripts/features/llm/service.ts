import { getRepoName, getRepositoryInfo, hasCode } from '../../../../helpers/get-repo-info';
import elementReady from 'element-ready';
import $, { get } from 'jquery';
import { OpenAI } from 'openai';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage } from '@langchain/core/messages';
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
const getTextarea = async () => {
  const textareaElement = (await elementReady('#read-only-cursor-text-area')) as HTMLTextAreaElement;
  return textareaElement.value;
};
export const getNote = async () => {
  const text = await getTextarea();
  console.log(text);

  const x = await model.invoke([new HumanMessage({ content: "Hi! I'm Bob" })]);
  console.log(x.content);
};
