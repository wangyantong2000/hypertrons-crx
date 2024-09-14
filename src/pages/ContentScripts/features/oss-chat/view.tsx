import React, { useState } from 'react';

import { CommentOutlined } from '@ant-design/icons';
import { FloatButton,Popover} from 'antd';
import Chatt from './chat'


const View = () : JSX.Element => {
  const [visible, setVisible] = useState(false);
  const showPopover = () => {
    setVisible(!visible);
  };

  return (
    <FloatButton.Group
    trigger="click"
    type="default"
    open={visible}
    style={{ insetInlineEnd: 36 }}
    icon={<CommentOutlined  />}
    onClick={showPopover}
  > 
   <FloatButton/>
  </FloatButton.Group>

  );
};

export default View;