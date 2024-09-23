import React, { useEffect, useState, ReactNode, useRef } from 'react';
import { ProChat, ProChatProvider, ProChatInstance, ChatItemProps } from '@ant-design/pro-chat';
import { useTheme } from 'antd-style';
import { getUsername } from '../../../../helpers/get-repo-info';
import { ToggleChat } from '../llm/service';
import { getResponse, convertChunkToJson } from './service';
import StarterList from './StarterList';
import ChatItemRender from './ChatItemRender';
import UserContent from './UserContent';
import LoadingStart from './LoadingStart';
import LoadingEnd from './LoadingEnd';
import Markdown from '../repo-networks/Markdown';
const Chat: React.FC = () => {
  const proChatRef = useRef<ProChatInstance>();
  const [complete, setComplete] = useState(false);
  const theme = useTheme();
  const username = getUsername();
  const avatar = 'https://avatars.githubusercontent.com/u/57651122?s=200&v=4';
  const title = '';
  const helloMessage = '';
  // const starters:string[]=[]
  const starters = ['你好', '介绍一下'];
  const botInfo = {
    assistantMeta: {
      avatar: avatar,
      title: title,
    },
    helloMessage: helloMessage,
    starters: starters,
  };
  return (
    <div style={{ background: theme.colorBgLayout, width: 600, height: 550 }}>
      <ProChat
        locale="en-US"
        chatRef={proChatRef}
        userMeta={{ avatar: `https://github.com/${username}.png` }}
        assistantMeta={{ avatar: avatar }}
        helloMessage=""
        request={async (messages) => {
          return await getResponse(messages.at(-1)?.content?.toString());
        }}
        chatItemRenderConfig={{
          render: (
            props: ChatItemProps,
            domsMap: {
              avatar: React.ReactNode;
              title: React.ReactNode;
              messageContent: React.ReactNode;
              actions: React.ReactNode;
              itemDom: React.ReactNode;
            },
            defaultDom: React.ReactNode
          ): React.ReactNode => {
            const originData = props.originData || {};
            const isDefault = originData.role === 'hello';
            if (isDefault) {
              return (
                <ChatItemRender
                  direction={'start'}
                  title={domsMap.title}
                  avatar={domsMap.avatar}
                  content={
                    <div className="leftMessageContent">
                      <div className="ant-pro-chat-list-item-message-content">
                        <div className="text-left text-[20px] font-[500] leading-[28px] font-sf">
                          Hello！
                          {botInfo.assistantMeta?.title}
                        </div>
                        <div className="text-left text-[14px] font-[500] leading-[28px] font-sf">{props.message}</div>
                      </div>
                    </div>
                  }
                  starter={
                    <StarterList
                      starters={botInfo?.starters ?? starters ?? []}
                      onClick={(msg: string) => {
                        proChatRef?.current?.sendMessage(msg);
                      }}
                      className="ml-[72px]"
                    />
                  }
                />
              );
            }
            if (originData?.role === 'user') {
              try {
                const content = JSON.parse(originData.content) as string[];
                const { text } = content.reduce(
                  (acc, item) => {
                    acc.text += text;
                    return acc;
                  },
                  { text: '' }
                );
                return <ChatItemRender direction={'end'} title={domsMap.title} content={<UserContent text={text} />} />;
              } catch (err) {
                console.error(err);
                return defaultDom;
              }
            }
            const originMessage = convertChunkToJson(originData.content) as any;

            // handle errors
            if (originMessage.errors.length > 0) {
              return (
                <ChatItemRender
                  direction={'start'}
                  avatar={domsMap.avatar}
                  title={domsMap.title}
                  content={
                    <div className="leftMessageContent">
                      <div className="ant-pro-chat-list-item-message-content text-red-700">ops...似乎出了点问题。</div>
                    </div>
                  }
                />
              );
            }
            // Default message content
            const defaultMessageContent = <div className="leftMessageContent">{defaultDom}</div>;
            // If originMessage is invalid, return default message content
            if ((!originMessage || typeof originMessage === 'string') && !!proChatRef?.current?.getChatLoadingId()) {
              return (
                <ChatItemRender
                  direction={'start'}
                  avatar={domsMap.avatar}
                  title={domsMap.title}
                  content={defaultMessageContent}
                />
              );
            }
            const { message: answerStr } = originMessage;
            // Handle chat loading state
            if (!!proChatRef?.current?.getChatLoadingId() && answerStr === '...') {
              return (
                <ChatItemRender
                  direction={'start'}
                  avatar={domsMap.avatar}
                  title={domsMap.title}
                  content={
                    <div className="leftMessageContent">
                      <LoadingStart loop={!complete} onComplete={() => setComplete(true)} />
                    </div>
                  }
                />
              );
            }
            return (
              <ChatItemRender
                direction={'start'}
                avatar={domsMap.avatar}
                title={domsMap.title}
                content={
                  <div className="leftMessageContent">
                    <LoadingEnd>
                      <Markdown
                        className="ant-pro-chat-list-item-message-content"
                        style={{ overflowX: 'hidden', overflowY: 'auto' }}
                      >
                        {answerStr}
                      </Markdown>
                    </LoadingEnd>
                  </div>
                }
              />
            );
          },
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
