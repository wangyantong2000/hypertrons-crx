import { getRepoName, getRepositoryInfo, hasCode } from '../../../../helpers/get-repo-info';
import React, { useState, useEffect } from 'react';
import elementReady from 'element-ready';
import $, { get } from 'jquery';
import { OpenAI } from 'openai';
import { ChatOpenAI } from '@langchain/openai';
import { render, Container } from 'react-dom';
import { HumanMessage } from '@langchain/core/messages';
import View from './view';
import { ChatPromptTemplate, HumanMessagePromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
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

  await getFileInfo();
  // const notePrompt = await buildPrompt();
  // const prompt =ChatPromptTemplate.fromMessages(
  //   [
  //     HumanMessagePromptTemplate.fromTemplate('{input}')
  //   ].filter(Boolean)
  // )
  // const chain = prompt.pipe(model)
  // const x=await chain.invoke({input:notePrompt});
  // console.log(x);
  const textareaElement = (await elementReady('#read-only-cursor-text-area')) as HTMLTextAreaElement;
  const content = `\`\`\`typescript
// This TypeScript file defines a module for managing Hypercrx extension options, including default settings and storage operations.

import { importedFeatures } from '../README.md'; // Importing features list from the README file.

// Define the type for Hypercrx options, which is the type of the 'defaults' object.
export type HypercrxOptions = typeof defaults;

// Define the default options for Hypercrx.
export const defaults = Object.assign(
  {
    // Default locale setting for the extension.
    locale: 'en',
  },
  // Dynamically create default settings for each feature imported from the README file.
 
);

// Class to manage storage of Hypercrx options.
class OptionsStorage {
  // Method to retrieve all options from storage.
  public async getAll(): Promise<HypercrxOptions> {
    // Retrieve options from Chrome's storage, using default values if not present.
    return (await chrome.storage.sync.get(defaults)) as HypercrxOptions;
  }

  // Method to set options in storage.
  public async set(options: Partial<HypercrxOptions>): Promise<void> {
    // Set the provided options in Chrome's storage.
    await chrome.storage.sync.set(options);
  }
}

// Create an instance of the OptionsStorage class.
const optionsStorage = new OptionsStorage();

// Export the optionsStorage instance as the default export of this module.
export default optionsStorage;\`\`\`
`;
  // const oelement=await elementReady('#copilot-button-positioner') as HTMLElement;
  // const newElement = oelement.cloneNode(true) as HTMLElement;
  const oelement = (await elementReady('.Box-sc-g0xbh4-0.iJmJly')) as HTMLElement;
  const newElement = oelement.cloneNode(true) as HTMLElement;
  const a = $('.Box-sc-g0xbh4-0.cXpbTk', newElement);
  const container = $('<div></div>');
  render(<View />, container[0]); // 将React组件渲染为真实的DOM元素
  a.html(container[0]);
  oelement.after(newElement);

  // const fe=$('#read-only-cursor-text-area',newElement)
  // const newtextareaElement = fe.clone(true);

  // newtextareaElement.html(content)
  // console.log(newtextareaElement.html())
  // fe.replaceWith(newtextareaElement);
  // console.log(newElement)
  // oelement.after(newElement);

  // const op=$()
  // if(op==null){
  //   return
  // }
  // op.replaceChild(newtextareaElement, textareaElement);

  // textareaElement.parentNode?.replaceChild(newtextareaElement, textareaElement);

  // const x=await chain.stream({ input: notePrompt });
  // for await (const chunk of x) {
  //   console.log(chunk);
  // }
  // const x=await model.invoke([new HumanMessage({ content: "Hi! I'm Bob" })]);
  // console.log(x.content);
};
