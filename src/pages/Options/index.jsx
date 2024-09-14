import React from 'react';
import { render } from 'react-dom';

import Options from './Options';
import './index.css';
import Chatt from './Chatt';
render(<Chatt />, window.document.querySelector('#app-container'));

if (module.hot) module.hot.accept();
