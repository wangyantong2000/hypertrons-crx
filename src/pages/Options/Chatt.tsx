import React, { useEffect, useState, ReactNode, useRef } from 'react';
import { getLLMInfo } from '../../helpers/LLM-info';
import { ProChat, ProChatProvider, ProChatInstance } from '@ant-design/pro-chat';
import { Markdown } from '@ant-design/pro-editor';
import { useTheme } from 'antd-style';
import { getUsername } from '../../helpers/get-repo-info';
import { ToggleChat } from '../ContentScripts/features/llm/service';
import { ChatOpenAI } from '@langchain/openai';
import { get } from 'jquery';

import { getResponse } from '../ContentScripts/features/oss-chat/service';

const Chat: React.FC = () => {
  const proChatRef = useRef<ProChatInstance>();
  const [complete, setComplete] = useState(false);
  const theme = useTheme();
  const username = getUsername();
  const avatar = 'https://avatars.githubusercontent.com/u/57651122?s=200&v=4';
  const {baseUrl,apiKey,modelName } = getLLMInfo()
  const model = new ChatOpenAI({
    apiKey: apiKey,
    configuration: {
      baseURL: baseUrl,
      fetch,
    },
    model: modelName,
    temperature: 0.95, // never use 1.0, some models do not support it
    maxRetries: 3,
  });
  return (
    <div style={{ background: theme.colorBgLayout, width: 600, height: 550 }}>
      <ProChat
        locale="en-US"
        chatRef={proChatRef}
        userMeta={{ avatar: `https://github.com/${username}.png` }}
        assistantMeta={{ avatar: avatar }}
        request={async (messages) => {
          return await getResponse(messages.at(-1)?.content?.toString(),model);
        }}
      />
    </div>
  );
};
const Chatt: React.FC = () => (
  <ProChatProvider>
    <ToggleChat />
    <Chat />
  </ProChatProvider>
);
export default Chatt;
