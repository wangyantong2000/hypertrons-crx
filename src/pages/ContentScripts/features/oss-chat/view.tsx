import React, { useState,useEffect } from 'react';

import { CommentOutlined, CloseOutlined } from '@ant-design/icons';
import { FloatButton, Popover } from 'antd';
import Chatt from './chat';
import eventEmitter from '../../../../helpers/eventEmitter';
const View = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false); 
  useEffect(() => {
    const handleToggle = (newState:boolean) => {
      setIsOpen(newState);
    };

    eventEmitter.on('toggleIsOpen', handleToggle);

    return () => {
      eventEmitter.off('toggleIsOpen', handleToggle);
    };
  }, []);
  const switchIcon = () => {
    const newState = !isOpen;
    eventEmitter.emit('toggleIsOpen', newState);
    if(!newState){
      eventEmitter.emit('toggleIsOpen1', false); 
    }
  };
  return (
    <Popover
    content={<Chatt />}
    title="Chat"
    placement="topRight"
    trigger="click"
    arrow={false}
    overlayStyle={{position: 'fixed',bottom:90, width: 624, height: 600}} 
    destroyTooltipOnHide={true}
    open={isOpen}
  >
    <FloatButton
      type="default"
      style={{  right: 24, bottom: 24,height:50, width:50 ,boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'}}
        icon={
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
            {isOpen ? (
              <CloseOutlined style={{ fontSize: 24 }} />
            ) : (
              <CommentOutlined style={{ fontSize: 24 }} />
            )}
          </span>
        }
      onClick={switchIcon}
    >
    </FloatButton>
  </Popover>
  );
};

export default View;
