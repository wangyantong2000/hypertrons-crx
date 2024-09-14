import React, { useEffect, useState } from 'react';

import { ProChat } from '@ant-design/pro-chat';
import { useTheme } from 'antd-style';
  

  const Chatt : React.FC=() => {
    const theme = useTheme();
    const [value, setValue] = useState();
    return (
      <div style={{ background: theme.colorBgLayout }}>
        <ProChat
          locale="en-US"
          inputAreaProps={{
            value: value,
            onChange: (e:any) => {
              setValue(e);
            },
          }}
        />
      </div>
    );
  };


export default Chatt;