/* eslint-disable import/prefer-default-export */
const initWidth = 960;
const initHeight = 500;
const verticalGap = 20;
const horizontalGap = 100;
const rectWidth = 150;
const edgeOpacity = 0.8;

function dGenerator(p1, p2) {
  const middle = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
  return `M${p1.x} ${p1.y} Q${middle.x} ${p1.y} ${middle.x} ${middle.y} T${p2.x} ${p2.y}`;
}

function calcDistance(p1, p2, e1) {
  const height = (e1.value * p1.height / p1.value);
  const leftMiddlePoint = {
    x: p1.x + p1.width,
    y: p1.y + p1.rSum + height / 2,
  };
  const rightMiddlePoint = {
    x: p2.x,
    y: p2.y + p2.lSum + height / 2,
  };
  return {
    height,
    leftMiddlePoint,
    rightMiddlePoint,
  };
}

/**
 * 将数据渲染到图
 * @param {*} data 经过load的数据
 * @param {string} domSelector 选择器
 */
export function render0(data, domSelector) {
  const { node, edge } = data;
  const positionMap = {
  };

  const svg = d3.select(domSelector)
    .attr('width', initWidth)
    .attr('height', initHeight);

  // ===========================================================================
  //      draw nodes
  // ===========================================================================
  node.forEach(function (step, idx) {
    let ySum = 0;
    const scale = d3.scaleLinear()
      .domain([0, d3.sum(node[0], d => d.value)])
      .range([0, initHeight - 200]);
    svg.append('g')
      .selectAll('rect')
      .data(node[idx])
      .enter()
      .append('g')
      .attr('class', `column-${idx}`)
      .append('rect')
      .attr('class', 'page')
      .attr('fill', '#c1daf9')
      .attr('x', function (d) {
        positionMap[d.id] = {
          id: d.id,
          x: (rectWidth + horizontalGap) * idx,
          width: rectWidth,
          height: scale(d.value),
          value: d.value,
          lSum: 0,
          rSum: 0,
        };
        return (rectWidth + horizontalGap) * idx;
      })
      .attr('y', function (d) {
        const old = ySum;
        ySum += (scale(d.value) + verticalGap);
        positionMap[d.id].y = old;
        return old;
      })
      .attr('width', rectWidth)
      .attr('height', function (d) { return scale(d.value); })
      .attr('style', 'fill:url(#myLinearGradient1)');

    const columnContainer = svg.selectAll(`g.column-${idx}`)
      .data(node[idx]);

    ySum = 0;
    columnContainer.append('text')
      .text(function (d) { return d.name; })
      .attr('x', function () {
        return (rectWidth + horizontalGap) * idx + 5;
      })
      .attr('y', function (d) {
        const old = ySum + 20;
        ySum += (scale(d.value) + verticalGap);
        return old;
      })
      .attr('class', 'title');

    ySum = 0;
    columnContainer.append('text')
      .text(function (d) { return d.value; })
      .attr('x', function () {
        return (rectWidth + horizontalGap) * idx + 5;
      })
      .attr('y', function (d) {
        const old = ySum + 20 + 14;
        ySum += (scale(d.value) + verticalGap);
        return old;
      })
      .attr('class', 'title');
  });

  // console.log(positionMap);

  // ===========================================================================
  //      draw edges
  // ===========================================================================
  edge.forEach(function (group) {
    group.forEach(function (edge1) {
      const info = calcDistance(positionMap[edge1.from], positionMap[edge1.to], edge1);
      // console.log(info);
      svg.append('path')
        .attr('d', dGenerator(info.leftMiddlePoint, info.rightMiddlePoint))
        .attr('stroke', '#e1ebf7')
        .attr('stroke-width', info.height)
        .attr('fill', 'none')
        .attr('opacity', edgeOpacity)
        .on('mouseover', function () {
          d3.select(this).attr('stroke', '#b1ccef');
        })
        .on('mouseout', function () {
          d3.select(this).attr('stroke', '#e1ebf7');
        });
      positionMap[edge1.from].rSum += (info.height);
      positionMap[edge1.to].lSum += (info.height);
    });
  });
}
