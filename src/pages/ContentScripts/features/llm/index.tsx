import { has } from 'lodash-es';
import features from '../../../../feature-manager';
import { getRepoName, getRepositoryInfo, hasCode } from '../../../../helpers/get-repo-info';
import sleep from '../../../../helpers/sleep';
import elementReady from 'element-ready';
import $ from 'jquery';
import { getNote } from './service';
import iconSvgPath from './icon-svg-path';
const featureId = features.getFeatureID(import.meta.url);
function getCurrentBranch(): string | undefined {
  const pathParts = window.location.pathname.split('/');
  const branchIndex = pathParts.indexOf('tree') + 1;
  if (branchIndex > 0 && branchIndex < pathParts.length) {
    return pathParts[branchIndex];
  }
  return undefined;
}
const addNoteButton = async (): Promise<void | false> => {
  const textareaElement = (await elementReady('#read-only-cursor-text-area')) as HTMLTextAreaElement;
  if (!textareaElement) {
    return false;
  }
  const hasNoteButton = await elementReady(`span[aria-label="${featureId}"]`);
  if (hasNoteButton) {
    return false;
  }
  const rawButtonElement = await elementReady('span[aria-label="Download raw file"]', { waitForChildren: false });
  if (!rawButtonElement) {
    // if the selector failed to find the Insights tab
    return false;
  }
  const noteButton = rawButtonElement.cloneNode(true) as HTMLAnchorElement;
  noteButton.setAttribute('aria-label', featureId);
  noteButton.setAttribute('id', featureId);
  const buttonElement = $('button', noteButton);
  if (!buttonElement) {
    return false;
  }
  await sleep(10);
  buttonElement.attr('style', 'border-radius: 6px !important;');
  buttonElement.attr('aria-label', featureId);
  buttonElement.attr('data-testid', featureId);
  buttonElement.removeAttr('data-hotkey');
  buttonElement.on('click', () => {
    getNote();
  });
  const buttonSvgElement = buttonElement.find('svg');
  buttonSvgElement.attr('class', 'octicon octicon-note');
  buttonSvgElement.attr('viewBox', '0 0 1024 1024');
  buttonSvgElement.html(iconSvgPath);
  const buttonContainer = document.createElement('div');
  buttonContainer.appendChild(noteButton);
  buttonContainer.className = 'ButtonGroup-sc-1gxhls1-0 cpVEZe ';
  if (!rawButtonElement.parentElement) {
    return false;
  }
  rawButtonElement.parentElement.before(buttonContainer);
};
const init = async (): Promise<void> => {
  // console.log('Repository Name:', getRepoName());
  // console.log('Gist Pathname:', getCleanGistPathname());
  // console.log('Clean Pathname:', getCleanPathname());;
  await addNoteButton();
  const repoInfo = getRepositoryInfo();
  const currentBranch = getCurrentBranch();
  // console.log('Current Branch:', currentBranch);
};

const restore = async () => {};

function observeDomChanges() {
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        init(); // 在检测到 DOM 变化时重新初始化
        break;
      }
    }
  });

  const mainElement = document.querySelector('main .Box-sc-g0xbh4-0.fywjmm');
  if (mainElement) {
    observer.observe(mainElement, { childList: true, subtree: true });
  }
}

features.add(featureId, {
  asLongAs: [hasCode],
  awaitDomReady: false,
  init: async () => {
    await init();
    observeDomChanges(); // 启动 DOM 变化监听器
  },
  restore,
});
