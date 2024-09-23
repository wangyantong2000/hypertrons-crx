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
import { ProChat, ProChatProvider, useProChat } from '@ant-design/pro-chat';
import { Button, Divider, Flex, message } from 'antd';
import eventEmitter from '../../../../helpers/eventEmitter';
import { getResponse } from '../oss-chat/service';
import { set } from 'lodash-es';

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
let chu = false;
let context = '';
export const ToggleChat = () => {
  const proChat = useProChat();

  useEffect(() => {
    const handleToggle = (newState: boolean) => {
      chu = newState;
    };
    eventEmitter.on('toggleIsOpen1', handleToggle);
    return () => {
      eventEmitter.off('toggleIsOpen1', handleToggle);
    };
  }, []);
  useEffect(() => {
    if (chu === true) {
      proChat.sendMessage(context);
      proChat.deleteMessage(proChat.getChats()[proChat.getChats().length - 1].id);
    }
  }, [chu]);

  return <div />;
};
const buildPrompt = async () => {
  const { language, fileName, fileExtension } = await getFileInfo();
  const content = await getTextarea();
  const basePrompt =
    'You are a programming language commentator.\nYou need to help me add as many comments as possible to the code with the file extension #{fileExtension} to make it more understandable for beginners.\nFirst, you need to add a comment at the top of the file summarizing the code, then add detailed comments to the code below.\nPlease do not change the original code; just add comments as detailed as possible,\nbecause my purpose is only to understand and read. Please use my native language #{language} as the commenting language.\nDo not reply with any text other than the code, and use Markdown syntax.\nHere is the code you need to comment on:\n\n#{content}';
  const prompt = basePrompt
    .replace('#{content}', content)
    .replace('#{fileExtension}', fileExtension)
    .replace('#{language}', language);
  return prompt;
};
export const getNote = async () => {
  const notePrompt = await buildPrompt();
  context = notePrompt;
  chu = true;
  eventEmitter.emit('toggleIsOpen', true);
};
