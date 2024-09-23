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
import { StyleProvider } from '@ant-design/cssinjs';
import elementReady from 'element-ready';
const featureId = features.getFeatureID(import.meta.url);
let repoName: string;
let repoNetworks: any;
let developerNetworks: any;
let repoID: any;
const getData = async () => {
  repoNetworks = await getRepoNetwork(repoName);
  developerNetworks = await getDeveloperNetwork(repoName);
};
const renderTo = (container: any) => {
  let root = createRoot(container);
  const element = document.getElementById('hypercrx-repo-activity-racing-bar');
  //     console.log(element)
  // const shadowRoot = element?.shadowRoot;
  if (element) root = createRoot(container);

  root.render(<Chatt />);
};
const init = async (): Promise<void> => {
  repoID = $('meta[name="octolytics-dimension-repository_network_root_id"]').attr('content');
  const networksContainer = '#hypercrx-perceptor-slot-repo-networks';
  await elementReady(networksContainer, { stopOnDomReady: false });

  const container = document.createElement('div');
  container.id = featureId;
  renderTo(container);
  $(networksContainer).append(container);

  // await getData();

  // const shadowHost = document.createElement('div');
  // const shadowRoot = shadowHost.attachShadow({ mode: 'open' });
  // const element = document.querySelector('#hypercrx-repo-activity-racing-bar');
  // if (element) {
  //   const shadow = element.attachShadow({ mode: 'open' });}
};

features.add(featureId, {
  asLongAs: [isPerceptor, isPublicRepoWithMeta],
  awaitDomReady: false,
  init,
});
