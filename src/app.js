/* eslint-disable import/extensions */
import { graphData } from './data.js';
import { loadGraph0 } from './load.js';
import { render0 } from './render.js';
import sankey from './layout.js';

/**
 *
 * sankey
 */
// eslint-disable-next-line
(function () {
  const info = loadGraph0(graphData);
  const layout = sankey().nodes(info.nodes).edges(info.edges);
  const data = layout();
  render0(data, '.mainSvg');
})();
