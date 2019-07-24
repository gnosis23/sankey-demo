/**
 *
 * data structures
 * Node = { id, name, x, y, yName, yValue, width, height, value, lSum, rSum }
 * Edge = { from, to, value, d }
 *
 *
 */

const initHeight = 500;
const verticalGap = 50;
const horizontalGap = 100;
const rectWidth = 150;

/**
 * 将输入格式转化为内部格式，适用于0级
 * @param {*} data GraphData
 * @returns 内部格式
 */
function transformGraphData0(nodes, edges) {
  const nodeSteps = [];
  // group by level
  for (let i = 0; i < nodes.length; i += 1) {
    const { level } = nodes[i];
    // eslint-disable-next-line no-continue
    if (level === -1) continue;

    if (nodeSteps[level] === undefined) nodeSteps[level] = [];
    nodeSteps[level].push(nodes[i]);
  }

  // group by level
  const edgeSteps = [];
  for (let i = 0; i < edges.length; i += 1) {
    const no = edges[i].from;
    const { level } = nodes[no];
    // eslint-disable-next-line no-continue
    if (level === -1) continue;

    if (edgeSteps[level] === undefined) edgeSteps[level] = [];
    edgeSteps[level].push(edges[i]);
  }

  return { nodeSteps, edgeSteps };
}

function dGenerator(p1, p2) {
  const middle = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
  return `M${p1.x} ${p1.y} Q${middle.x} ${p1.y} ${middle.x} ${middle.y} T${p2.x} ${p2.y}`;
}

function calcDistance(p1, p2, e1) {
  const height = (e1.value * p1.height / p1.value);
  const leftMiddlePoint = {
    x: p1.x + p1.width,
    y: p1.y + p1.rSum + (height / 2),
  };
  const rightMiddlePoint = {
    x: p2.x,
    y: p2.y + p2.lSum + (height / 2),
  };
  return {
    height,
    leftMiddlePoint,
    rightMiddlePoint,
  };
}

export default function () {
  let nodes = [];
  let edges = [];
  const positionMap = {};

  function sankey() {
    const { nodeSteps: node, edgeSteps: edge } = transformGraphData0(nodes, edges);
    const output = { edges: [], nodes: [] };

    const scale10 = d3.scaleLinear()
      .domain([0, d3.sum(node[0], d => d.value)])
      .range([10, initHeight - 200 + 10]);

    node.forEach(function (step, idx) {
      let ySum = 0;
      let ySumName = 0;
      let ySumValue = 0;
      node[idx].forEach((d) => {
        positionMap[d.id] = {
          id: d.id,
          name: d.name,
          x: (rectWidth + horizontalGap) * idx,
          y: ySum,
          yName: ySumName + 20,
          yValue: ySumValue + 20 + 14,
          width: rectWidth,
          height: scale10(d.value),
          value: d.value,
          lSum: 0,
          rSum: 0,
        };
        ySum += (scale10(d.value) + verticalGap);
        ySumName += (scale10(d.value) + verticalGap);
        ySumValue += (scale10(d.value) + verticalGap);
        output.nodes.push(positionMap[d.id]);
      });
    });

    // console.log(positionMap);

    // ===========================================================================
    //      draw edges
    // ===========================================================================
    edge.forEach(function (group) {
      group.forEach(function (edge1) {
        const info = calcDistance(positionMap[edge1.from], positionMap[edge1.to], edge1);
        /* eslint-disable no-param-reassign */
        edge1.d = dGenerator(info.leftMiddlePoint, info.rightMiddlePoint);
        edge1.height = info.height;
        /* eslint-enable no-param-reassign */
        positionMap[edge1.from].rSum += (info.height);
        positionMap[edge1.to].lSum += (info.height);
        output.edges.push(edge1);
      });
    });

    // export them
    return output;
  }

  sankey.nodes = function (_) {
    if (arguments.length) {
      nodes = _;
      return sankey;
    }
    return nodes;
  };

  sankey.edges = function (_) {
    if (arguments.length) {
      edges = _;
      return sankey;
    }
    return edges;
  };

  return sankey;
}
