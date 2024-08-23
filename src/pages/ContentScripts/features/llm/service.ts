import { getRepoName, getRepositoryInfo, hasCode } from '../../../../helpers/get-repo-info';
import elementReady from 'element-ready';
import $, { get } from 'jquery';
import { OpenAI } from 'openai';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage } from '@langchain/core/messages';
import i18n from 'i18next';
const openaiKey = 'sk-cc97b460219f4785a1e13681641bb326';
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
const getFileInfo = async () => {
  const language = i18n.language;
  const repoInfo = await getRepositoryInfo();
  const fileName = repoInfo?.path.split('/').at(-1);
  const fileExtension = fileName?.substring(fileName.lastIndexOf('.')) as string;
  console.log(language);
  console.log(fileName);
  console.log(fileExtension);
  return {
    language,
    fileName,
    fileExtension,
  };
};
const buildPrompt = async () => {
  const { language, fileName, fileExtension } = await getFileInfo();
  const content = await getTextarea();
  const basePrompt =
    'You are a programming language commentator.\nYou need to help me add as many comments as possible to the code with the file extension #{fileExtension} to make it more understandable for beginners.\nFirst, you need to add a comment at the top of the file summarizing the code, then add detailed comments to the code below.\nPlease do not change the original code; just add comments as detailed as possible,\nbecause my purpose is only to understand and read. Please use my native language #{language} as the commenting language.\nDo not reply with any text other than the code, and do not use Markdown syntax.\nHere is the code you need to comment on:\n\n#{content}';
  const prompt = basePrompt
    .replace('#{content}', content)
    .replace('#{fileExtension}', fileExtension)
    .replace('#{language}', language);
  return prompt;
};
export const getNote = async () => {
  const text = await getTextarea();
  console.log(text);
  await getFileInfo();
  const notePrompt = await buildPrompt();

  // const x=await model.invoke([new HumanMessage({ content: "Hi! I'm Bob" })]);
  // console.log(x.content);
};
