import { has } from 'lodash-es';
import features from '../../../../feature-manager';
import {
  getRepoName,
  getRepositoryInfo,
  getCleanGistPathname,
  getCleanPathname,
  hasCode,
} from '../../../../helpers/get-repo-info';

const featureId = features.getFeatureID(import.meta.url);

function getCurrentBranch(): string | undefined {
  const pathParts = window.location.pathname.split('/');
  const branchIndex = pathParts.indexOf('tree') + 1;
  if (branchIndex > 0 && branchIndex < pathParts.length) {
    return pathParts[branchIndex];
  }
  return undefined;
}

const init = async (): Promise<void> => {
  console.log('Repository Name:', getRepoName());
  console.log('Gist Pathname:', getCleanGistPathname());
  console.log('Clean Pathname:', getCleanPathname());

  const repoInfo = getRepositoryInfo();
  const currentBranch = getCurrentBranch();
  console.log('Current Branch:', currentBranch);
};

const restore = async () => {};

function observeDomChanges() {
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        console.log('DOM changed:', mutation.addedNodes);
        init(); // 在检测到 DOM 变化时重新初始化
        break;
      }
    }
  });

  const mainElement = document.querySelector('main .Box-sc-g0xbh4-0.fywjmm');
  console.log('Main Element:', mainElement);
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
