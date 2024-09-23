/**
 * 高亮能力基于highlight.js 的语法解析能力 https://highlightjs.org/
 * 听说过的还算有名的语言放在langugaes中了，需要新增语言时在languages文件夹中添加并import使用，加入到 languageMap中
 * 如果没有在 https://github.com/highlightjs/highlight.js/tree/master/src/languages 中查找是否支持，然后添加
 * 优先支持主流语言，没有import在代码中使用的不会打包
 */
import { THEME_LIGHT } from '../../theme';
import { memo, useMemo } from 'react';
import { HighlightProps } from '../../index';
import HighLightJS from '../HighLightJS';
import { useStyles } from './style';
import React from 'react';
export type Props = Pick<HighlightProps, 'language' | 'children' | 'theme' | 'lineNumber' | 'className' | 'style'>;

const HighLighter: React.FC<Props> = memo((props) => {
  const { children, lineNumber = false, theme = THEME_LIGHT, language } = props;
  const { styles } = useStyles({ lineNumber, theme });

  const HighlightJSBlock = useMemo(
    () => (
      <HighLightJS lineNumber={lineNumber} theme={theme} language={language}>
        {children}
      </HighLightJS>
    ),
    [lineNumber, theme, language, children]
  );

  return HighlightJSBlock;
});

export default HighLighter;
