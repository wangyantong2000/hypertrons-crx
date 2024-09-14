import React from 'react';

import { Container } from 'react-dom';
import $ from 'jquery';

import features from '../../../../feature-manager';
import getGithubTheme from '../../../../helpers/get-github-theme';
import { getRepoName, isPublicRepo } from '../../../../helpers/get-repo-info';
import View from './view';
import ReactDOM from 'react-dom/client';

const featureId = features.getFeatureID(import.meta.url);
let repoName: string;

const renderTo = (container: any) => {
  ReactDOM.createRoot(container).render(<View />);
};

const init = async (): Promise<void> => {
  repoName = getRepoName();

  const container = document.createElement('div');
  container.id = featureId;
  container.dataset.repo = repoName; // mark current repo by data-repo
  console.log(container);
  renderTo(container);
  document.body.appendChild(container);

  // TODO need a mechanism to remove extra listeners like this one
  document.addEventListener('turbo:load', async () => {
    if (await isPublicRepo()) {
      if (repoName !== getRepoName()) {
        repoName = getRepoName();
        // renderTo($(`#${featureId}`)[0]);
      }
    } else {
      $(`#${featureId}`).remove();
    }
  });
};

features.add(featureId, {
  include: [isPublicRepo],
  awaitDomReady: false,
  init,
});
