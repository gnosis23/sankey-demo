/* eslint-disable import/extensions */
import { graphData } from './data.js';
import { loadGraph0 } from './load.js';
import { render0 } from './render.js';

/**
 *
 * sankey
 */
// eslint-disable-next-line
(function () {
  const info = loadGraph0(graphData);
  render0(info, '.mainSvg');
})();
