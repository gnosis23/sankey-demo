/**
 *
 * 
 */
(function () {
  'use strict';

  const data = {
    steps: [
      [
        {name: 'index', url: '/index', session: 12000},
      ],
      [
        {name: 'page1', url: '/page1', session: 6000},
        {name: 'page2', url: '/page2', session: 2000},
        {name: 'page3', url: '/page2', session: 1000},
      ],
      [
        {name: 'index', url: '/index', session: 2200},
        {name: 'page1', url: '/page1', session: 2000},
        {name: 'page2', url: '/page2', session: 1400},
      ],
    ],
  };
  
  const initWidth = 960;
  const initHeight = 500;
  const vertical_gap = 20;
  const horizontal_gap = 100;
  const rect_width = 150;
  const edge_opacity = 0.8;

  const svg = d3.select('body')
    .append('svg')
    .attr('width', initWidth)
    .attr('height', initHeight)
    ;
  
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
        return (rect_width + horizontal_gap) * idx;
      })
      .attr('y', function(d, i) {
        const old = ySum;
        ySum += (scale(d.session) + vertical_gap);
        return old;
      })
      .attr('width', rect_width)
      .attr('height', function(d) { return scale(d.session); })
      .on("mouseover",function(){
        console.log(this);
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
  
  svg.append("path")
    .attr("d", dGenerator({x: 150, y: 75}, {x: 250, y: 75}))
    .attr("stroke", "#e1ebf7")
    .attr("stroke-width", 150)
    .attr("fill", "none")
    .attr("opacity", edge_opacity)
    ;

  svg.append("path")
    .attr("d", dGenerator({x:150, y: 175}, {x:250, y:195}))
    .attr("stroke", "#e1ebf7")
    .attr("stroke-width", 50)
    .attr("fill", "none")
    .attr("opacity", edge_opacity)
    ;

  svg.append("path")
    .attr("d", dGenerator({x:150, y: 212.5}, {x:250, y:252.5}))
    .attr("stroke", "#e1ebf7")
    .attr("stroke-width", 25)
    .attr("fill", "none")
    .attr("opacity", edge_opacity)
    ;  

  svg.append("path")
    .attr("d", dGenerator({x:400, y: 195}, {x:500, y:25}))
    .attr("stroke", "#e1ebf7")
    .attr("stroke-width", 50)
    .attr("fill", "none")
    .attr("opacity", edge_opacity)
    .on("mouseover",function(){
      console.log(this);
      d3.select(this).attr("stroke", "#b1ccef")
    })
    .on("mouseout", function(){
      d3.select(this).attr("stroke","#e1ebf7")
    })
    ;  
  
  function dGenerator(p1, p2) {
    const middle = {x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2};
    return `M${p1.x} ${p1.y} Q${middle.x} ${p1.y} ${middle.x} ${middle.y} T${p2.x} ${p2.y}`;
  }
})();
