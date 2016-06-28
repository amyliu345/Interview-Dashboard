var units = "passengers";

$(document).ready(function() {
//Travel time, distance, emissions, etc///////

    var refValue = 30;

    var margins = {
    top: 30,
    left: 40,
    right: 10,
    bottom: 140
    },

    legendPanel = {
      width: 180
    },

    width = 180,
    height = 265;


    //Color Scheme
    colors = d3.scale.quantize()
      .domain([0,1,2,3,4])
      .range(['#fd8d3c', '#3182bd' ,'#6baed6','#CCEEFF','#9ecae1']);

    d3.json("data/dailyPassengers.json", function(error, dataset) {  

          series = dataset.map(function (d) {
              return d.name;
          }),

          dataset = dataset.map(function (d) {
              return d.data.map(function (o, i) {
                  // Structure it so that your numeric
                  // axis (the stacked amount) is y
                  return {
                      y: +o.count,
                      x: o.day,
                      mode: d.name
                  };
              });
          }),

          stack = d3.layout.stack();
          stack(dataset);

          dataset = dataset.map(function (group) {
          return group.map(function (d) {
              // Invert the x and y values, and y0 becomes x0
              return {
                  x: d.y,
                  y: d.x,
                  x0: d.y0,
                  mode: d.mode
              };
            });
          });

      //SVG
          var svg = d3.select('#passengers')
              .append('svg')
              .attr('width', width + margins.right)
              .attr('height', height + margins.top + margins.bottom)
              .append('g')
              .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')');

////////////////////////////////////////////////////////////////////////
          var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
              return "<span style='color:white'>" + d.mode + "<br>"+ d.x + " " + "</span>";
            })
              
          svg.call(tip);


          xMax = d3.max(dataset, function (group) {
              return d3.max(group, function (d) {
                  return d.x + d.x0;
              });
          }),
          
          xScale = d3.scale.linear()
              .domain([0, xMax])
              .range([0, width]),
          days = dataset[0].map(function (d) {
              return d.y;
          }),
        
          yScale = d3.scale.ordinal()
              .domain(days)
              .rangeRoundBands([0, height], .1),
              
          //X and Y axis ticks etc.
          xAxis = d3.svg.axis()
              .scale(xScale)
              .ticks(4)
              //.tickValues([0, 10, 20, 30])
              .outerTickSize(0)
              .tickFormat(d3.format(",.0f"))
              .orient('bottom'),
              
          yAxis = d3.svg.axis()
              .scale(yScale)
              .orient('left')
              .tickSize(0);
              

// ///ref line code here
//       drawRefLine(svg, refValue, "Neighbors");
//       drawRefLine(svg, 20, "World");

      //Bars
      var groups = svg.selectAll('g')
          .data(dataset)
          .enter()
          .append('g')
            

      groups.attr('class', 'group')
          .style('fill', function (d, i) {
            return colors(i);
          });

      var rects = groups.selectAll('rect')
          .data(function (d) {
            return d;
          })
          .enter()
          .append('rect')

      rects.attr('class', 'bar')
          .attr('x', function (d) {
            return xScale(d.x0);
          })
          .attr('y', function (d, i) {
            return yScale(d.y);
          })
          .attr('height', function (d) {
            return yScale.rangeBand();
          })
          .attr('width', function (d) {
            return xScale(d.x);
          })
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide);


      //X and Y axes
      svg.append('g')
          .attr('class', 'transition x axis')
          .attr('transform', 'translate(0,' + height + ')')
          .call(xAxis);
              
      // svg.append('g')
      //     .attr('class', 'transition y axis')
      //     .attr('transform', 'translate(-10, 0)')
      //     .call(yAxis);
        
      //X axis label
      svg.append('text')
          .attr('class', 'label')
          .attr('fill','black')
          .attr('x', 0)
          .attr('y', height+45)
          .text('Average # of Passengers');
  });
});




function drawRefLine(svg, refValue, refText){
        //Reference Line
      svg.append("line")
        .style("stroke-dasharray", ("2,2"))
        .style("stroke", "black")
        .attr('class', 'ref ' + refText)
        .attr("x1", xScale(refValue))
        .attr("y1", -4)
        .attr("x2", xScale(refValue))
        .attr("y2", 275); 

      svg.append("circle")  
        .style("fill", "gray")
        .attr('class', 'ref ' + refText)
        .attr("cx", xScale(refValue)) 
        .attr("cy", -8)
        .attr("r", 8);

      svg.append("text")  
        .attr('class', 'refText ' + refText)
        .attr("font-family", "sans-serif")
        .attr("font-size", "9px")
        .attr("fill", "white")
        .attr('x', xScale(refValue)-5)
        .attr('y', -5)
        .text(refValue);

      svg.append("text")
        .attr('class', 'refLabel ' + refText)
        .attr('font', 'Open Sans')
        .attr("font-family", "sans-serif")
        .attr("font-size", "8px")
        .attr("fill", "black")
        .attr('x', xScale(refValue)-15)
        .attr('y', -20)
        .text(refText);
}