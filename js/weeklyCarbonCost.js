$(document).ready(function() {

   var margin = {
      top: 70,
      right: 20,
      bottom: 60,
      left: 60
    },
    width = 200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);

  var y = d3.scale.linear()
      .rangeRound([height, 0]);

  var color = d3.scale.ordinal()
      .range(["#008000", "#804000"]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .tickSize(0)
      .tickPadding(10)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickFormat(d3.format(".2s"));

  var svg = d3.select("#weeklyCarbonCost").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.csv("data/weeklyCarbonCost.csv", function(error, data) {
    if (error) throw error;

    color.domain(d3.keys(data[0]).filter(function(key) { return key !== "State"; }));

    data.forEach(function(d) {
      var y0 = 0;
      d.ages = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
      d.total = d.ages[d.ages.length - 1].y1;
    });

   // data.sort(function(a, b) { return b.total - a.total; });

    x.domain(data.map(function(d) {return d.State; }));
    y.domain([0, d3.max(data, function(d) {return d.total; })]);

    var tip1 = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
            .html(function(d) {
              if (d.name=='userShare'){
              return "<span style='color:white'>" + "$" + (d.y1-d.y0) + " - Your Share of Carbon Cost" + "</span>";
            }
            else{
              return "<span style='color:white'>" + "$" + (d.y1-d.y0) + " - Full Cost of Car and Fuel" + "</span>";
              }
            })
    var tip2 = d3.tip()
        // .attr('class', 'd3-tip')
        // .offset([-10, 0])
        //   .html(function(d) {
        //                 console.log(d);

        //     return "<span style='color:white'>" + "$" + d.cost + " - Full Cost of Car and Fuel" + "</span>";
        //   })

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "weekly x axis")
        // .attr("class", "weekly x text")
        .call(xAxis);

    svg.append("g")
        .attr("class", "weekly y axis")
        .call(yAxis)
      .append("text")
        .attr("class", "weekly y text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Cost (SGD)");

    var state = svg.selectAll(".state")
        .data(data)
      .enter().append("g")
        .attr("class", "g")
        .attr("transform", function(d) {
         
          t = x(d.State)
          t+=15
          return "translate(" + t + ",0)"; 
        })

      state.call(tip1)


    state.selectAll("rect")
        .data(function(d) { return d.ages; })
      .enter().append("rect")
        .attr("width", x.rangeBand()-25)
        .attr("y", function(d) { return y(d.y1); })
        .attr("height", function(d) {return y(d.y0) - y(d.y1); })
        .on('mouseover', tip1.show)
        .on('mouseout', tip1.hide)
        .style("fill", function(d) { return color(d.name); });


      //Daily carbon emissions top label
    svg.append('text')
        .attr('class', 'bigLabel')
        .attr('fill','black')
        .attr('x', 50)
        .attr('y', -53)
        .text('Cost');

  });
});