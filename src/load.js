/**
 *
 *
 *
 * 内部格式转换文件
 *
 *
 *
 * @copyright Bohao Wang
 */

/**
 * 将输入格式转化为内部格式，适用于0级
 * @param {*} data GraphData
 * @returns 内部格式
 */
function transformGraphData0(data) {
  const nodes = [];

  // copy node data
  data.node.forEach((x, index) => {
    nodes.push({ id: index, name: x.name, level: x.level });
  });

  // copy value info
  data.graph[0].nodeProperty.forEach((x) => {
    nodes[x.id].value = x.value;
  });

  const edges = [];

  // copy edge
  data.edge.forEach((x) => {
    edges.push({
      from: nodes[x.startNode].id,
      to: nodes[x.endNode].id,
    });
  });

  // copy value
  data.graph[0].edgeProperty.forEach((x) => {
    edges[x.id].value = x.value;
  });

  return { nodes, edges };
}

/**
 * 将输入格式转化为内部格式，适用于0级
 * @param {*} data GraphData
 */
export function loadGraph0(data) {
  return transformGraphData0(data);
}

export function loadGraph(data) {
  return data;
}
