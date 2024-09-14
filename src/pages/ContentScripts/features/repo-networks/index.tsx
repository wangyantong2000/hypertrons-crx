import React from 'react';
import { render, Container } from 'react-dom';
import $ from 'jquery';

import features from '../../../../feature-manager';
import isPerceptor from '../../../../helpers/is-perceptor';
import { getRepoName, isPublicRepoWithMeta } from '../../../../helpers/get-repo-info';
import { getRepoNetwork, getDeveloperNetwork } from '../../../../api/repo';
import View from './view';
import DataNotFound from './DataNotFound';
import { createRoot } from 'react-dom/client';
import Chatt from './Chatt';
const featureId = features.getFeatureID(import.meta.url);
let repoName: string;
let repoNetworks: any;
let developerNetworks: any;

const getData = async () => {
  repoNetworks = await getRepoNetwork(repoName);
  developerNetworks = await getDeveloperNetwork(repoName);
};
const renderTo = (container:any) => {
  try {
    const root = createRoot(container);
    root.render(<Chatt />);
  } catch (error) {
    console.error('Error during rendering:', error);
  }

};
const init = async (): Promise<void> => {
  repoName = getRepoName();
  await getData();
  const container = document.createElement('div');
  container.id = featureId;
  renderTo(container);
  $('#hypercrx-perceptor-slot-repo-networks').append(container);
};

features.add(featureId, {
  asLongAs: [isPerceptor, isPublicRepoWithMeta],
  awaitDomReady: false,
  init,
  
});
