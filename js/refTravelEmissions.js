var units = "kg";

$(document).ready(function() {
//Travel time, distance, emissions, etc///////

    var refValue = 30;

    var margins = {
    top: 70,
    left: 10,
    right: 30,
    bottom: 140
    },

    legendPanel = {
      width: 180
    },

    width = 260,
    height = 265;

    var activityToColor = {},
        i,
        color = ['#E5DF96','#E5A698','#906060','#CC98E5','#646464','#F95353','#F95D00','#E52700','#9E6EA4','#A0E500','#B34CE5','#CEE598','#E5664C','#906860','#703090','#C8C8C8','#969696','#E57D00','#E5C298','#305B90','#906430','#00A04C','#4C91E5','#CCEEFF','#98BBE5'],
        activity = ["Home","Work","Work-Related Business","Education","Pick Up/Drop Off","Personal Errand/Task","Meal/Eating Break","Shopping","Social","Recreation","Entertainment","Sports/Exercise","To Accompany Someone","Other Home","Medical/Dental (Self)","Other (stop)","Change Mode/Transfer","Car/Van","Taxi","Bus","Other (mode)","Motorcycle/Scooter","LRT/MRT","Bicycle","Foot"]
    for (i = 0; i < activity.length; i++) {
        activityToColor[activity[i]] = color[i];
    };

    var activityToAbbrev = {},
        i,
        activity = ["Home","Work","Work-Related Business","Education","Pick Up/Drop Off","Personal Errand/Task","Meal/Eating Break","Shopping","Social","Recreation","Entertainment","Sports/Exercise","To Accompany Someone","Other Home","Medical/Dental (Self)","Other (stop)","Change Mode/Transfer","Car/Van","Taxi","Bus","Other (mode)","Motorcycle/Scooter","LRT/MRT","Bicycle","Foot"],
        abbrev = ["Home","Work","Business","Edu.","Pick Up/Drop Off","Errand","Meal","Shop","Social","Rec.","Entertain.","Exercise","Accompany","Other","Medical","Other","Transfer","Car","Taxi","Bus","Other","Scooter","MRT","Bike","Foot"]

    for (i = 0; i < activity.length; i++) {
        activityToAbbrev[activity[i]] = abbrev[i];
    };

    

    d3.json("data/dailyEmissions.json", function(error, dataset) {  

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
          var svg = d3.select('#emissions')
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
              return "<span style='color:white'>" + d.mode + "<br>"+ d.x + " " + "kg" + "</span>";
            })
              
          svg.call(tip);


          xMax = d3.max(dataset, function (group) {
              return d3.max(group, function (d) {
                  return d.x + d.x0;
              });
          }),
          
          xScale = d3.scale.linear()
              .domain([0, 18])
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
      drawRefLine(svg, 2.5, "Neighbors");
      drawRefLine(svg, 1, "World");

      //Bars
      var groups = svg.selectAll('g')
          .data(dataset)
          .enter()
          .append('g')
            

      groups.attr('class', 'group')
          .style('fill', function (d, i) {
            return activityToColor[series[i]];
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
              
      svg.append('g')
          .attr('class', 'transition y axis')
          .attr('transform', 'translate(-10, 0)')
          .call(yAxis);
        
      //X axis label
      svg.append('text')
          .attr('class', 'label')
          .attr('fill','black')
          .attr('x', 0)
          .attr('y', height+45)
          .text('Travel Emissions (kg CO2)');

      //Big label
      svg.append('text')
          .attr('class', 'bigLabel')
          .attr('fill','black')
          .attr('x', 0)
          .attr('y', -50)
          .text('Daily Carbon Emissions');


      //Legend
      series.forEach(function (s, i) {
          svg.append('text')
              .attr('class', 'legendLabel')
              .attr('fill', 'black')
              .attr('x', i * 36)
              .attr('y', height+110)
              .text(activityToAbbrev[s]);
          svg.append('rect')
              .attr('fill', activityToColor[s])
              .attr('width', 25)
              .attr('height', 25)
              .attr('x', i *36)
              .attr('y', height+115);
              
       });   
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
        .attr('x', xScale(refValue)-3)
        .attr('y', -5)
        .text(refValue);

      svg.append("text")
        .attr('class', 'refLabel ' + refText)
        .attr('font', 'Open Sans')
        .attr("font-family", "sans-serif")
        .attr("font-size", "8px")
        .attr("fill", "black")
        .attr('x', xScale(refValue)-17)
        .attr('y', -20)
        .text(refText);
}