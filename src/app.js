/**
 *
 * 
 */
(function () {
  'use strict';

  function dGenerator(p1, p2) {
    const middle = {x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2};
    return `M${p1.x} ${p1.y} Q${middle.x} ${p1.y} ${middle.x} ${middle.y} T${p2.x} ${p2.y}`;
  }

  function calcDistance(p1, p2, e1) {
    const height = (e1.session * p1.height / p1.session);
    const leftMiddlePoint = {
      x: p1.x + p1.width,
      y: p1.y + p1.rSum + height / 2,
    };
    const rightMiddlePoint = {
      x: p2.x,
      y: p2.y + p2.lSum + height / 2,
    };
    return {
      height: height,
      leftMiddlePoint: leftMiddlePoint,
      rightMiddlePoint: rightMiddlePoint,
    };
  }

  // ===========================================================================
  //     data area
  // ===========================================================================
  const data = {
    steps: [
      [
        {id: '$0_1111', name: 'index', url: '/index', session: 12000},
      ],
      [
        {id: '$1_1111', name: 'page1', url: '/page1', session: 6000},
        {id: '$1_2222', name: 'page2', url: '/page2', session: 2000},
        {id: '$1_3333', name: 'page3', url: '/page2', session: 1000},
      ],
      [
        {id: '$2_1111', name: 'index', url: '/index', session: 2200},
        {id: '$2_2222', name: 'page1', url: '/page1', session: 2000},
        {id: '$2_3333', name: 'page2', url: '/page2', session: 1400},
      ],
      [
        {id: '$3_1111', name: 'index', url: '/index', session: 1200},
        {id: '$3_2222', name: 'page1', url: '/page1', session: 1000},
        {id: '$3_3333', name: 'page2', url: '/page2', session: 700},
        {id: '$3_4444', name: 'page3', url: '/page3', session: 1400},
      ],
    ],
  };

  /**
   * attributes:
   * - id
   * - x
   * - y
   * - width
   * - height
   * - lSum - used left height
   * - rSum - used right height
   */
  const positionMap = {
  };

  const edges = [
    // level 0
    [
      {from: '$0_1111', to: '$1_1111', session: 6000},
      {from: '$0_1111', to: '$1_2222', session: 2000},
      {from: '$0_1111', to: '$1_3333', session: 1000},
    ],
    // level 1
    [
      {from: '$1_1111', to: '$2_1111', session: 1234},
      {from: '$1_1111', to: '$2_2222', session: 1000},
      {from: '$1_1111', to: '$2_2222', session: 100},
      {from: '$1_1111', to: '$2_3333', session: 100},
      {from: '$1_2222', to: '$2_1111', session: 100},
      {from: '$1_3333', to: '$2_1111', session: 100},
    ],
    // level 2
    [
      {from: '$2_1111', to: '$3_1111', session: 234},
      {from: '$2_1111', to: '$3_2222', session: 200},
      {from: '$2_1111', to: '$3_2222', session: 100},
      {from: '$2_1111', to: '$3_3333', session: 100},
      {from: '$2_2222', to: '$3_1111', session: 100},
      {from: '$2_3333', to: '$3_1111', session: 100},
    ],
  ];
  
  const initWidth = 960;
  const initHeight = 500;
  const vertical_gap = 20;
  const horizontal_gap = 100;
  const rect_width = 150;
  const edge_opacity = 0.8;

  // ===========================================================================
  //      procedure
  // ===========================================================================
  const svg = d3.select('body')
    .append('svg')
    .attr('width', initWidth)
    .attr('height', initHeight)
    ;

  // ===========================================================================
  //      draw rects
  // ===========================================================================
  data.steps.forEach(function(step, idx) {
    let ySum = 0;
    let scale = d3.scaleLinear()
      .domain([0, d3.sum(data.steps[0], d => d.session)])
      .range([0, initHeight - 200]);
    svg.append('g')      
      .selectAll('rect')
      .data(data.steps[idx])
      .enter()
      .append('g')
      .attr('class', 'column-' + idx)
      .append('rect')
      .attr('class', 'page')
      .attr('fill', '#c1daf9')
      .attr('x', function(d, i) {
        positionMap[d.id] = {
          id: d.id,
          x: (rect_width + horizontal_gap) * idx,
          width: rect_width,
          height: scale(d.session),
          session: d.session,
          lSum: 0,
          rSum: 0,
        };
        return (rect_width + horizontal_gap) * idx;
      })
      .attr('y', function(d, i) {
        const old = ySum;
        ySum += (scale(d.session) + vertical_gap);
        positionMap[d.id].y = old;
        return old;
      })
      .attr('width', rect_width)
      .attr('height', function(d) { return scale(d.session); })
      .on("mouseover",function(){
        d3.select(this).attr("fill", "#9ab8da")
      })
      .on("mouseout", function(){
        d3.select(this).attr("fill","#c1daf9")
      })
      ;
        
    const columnContainer = svg.selectAll('g.column-' + idx)
      .data(data.steps[idx]);

    ySum = 0;
    columnContainer.append('text')
      .text(function(d) { return d.name; })
      .attr('x', function(d, i) {
        return (rect_width + horizontal_gap) * idx;
      })
      .attr('y', function(d, i) {
        const old = ySum + 20;
        ySum += (scale(d.session) + vertical_gap);
        return old;
      })
      ;
    
    ySum = 0;
    columnContainer.append('text')
      .text(function(d) { return d.session; })
      .attr('x', function(d, i) {
        return (rect_width + horizontal_gap) * idx;
      })
      .attr('y', function(d, i) {
        const old = ySum + 20 + 20;
        ySum += (scale(d.session) + vertical_gap);
        return old;
      })
      ;
  });

  // console.log(positionMap);

  // ===========================================================================
  //      draw edges
  // ===========================================================================
  edges.forEach(function(group) {
    group.forEach(function(edge1, idx) {
      const info = calcDistance(positionMap[edge1.from], positionMap[edge1.to], edge1);
      // console.log(info);
      svg.append("path")
      .attr("d", dGenerator(info.leftMiddlePoint, info.rightMiddlePoint))
      .attr("stroke", "#e1ebf7")
      .attr("stroke-width", info.height)
      .attr("fill", "none")
      .attr("opacity", edge_opacity)
      .on("mouseover",function(){
        d3.select(this).attr("stroke", "#b1ccef")
      })
      .on("mouseout", function(){
        d3.select(this).attr("stroke","#e1ebf7")
      })
      ;
      positionMap[edge1.from].rSum += (info.height);
      positionMap[edge1.to].lSum += (info.height);
    });
  });

})();
