$(document).ready( function() {

  var margin = {
      top: 120,
      right: 20,
      bottom: 200,
      left: 40
    },
    width = 250,
    height = 360;

  var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

  var y = d3.scale.linear()
    .range([height, 0]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .tickSize(0)
    .tickPadding(10)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

  var svg = d3.select("#weeklyTravelTime").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "svg")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  d3.csv("data/weeklyTravelTime.csv", type, function(error, data) {
    // console.log(data)
    x.domain(data.map(function(d) {
      return d.mode;
    }));
    y.domain([0, d3.max(data, function(d) {
      return Math.max(d.user, d.neighbor);
    })]);

    svg.append("g")
      .attr("class", "weekly x axis")
      .attr("class", "weekly x text")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg.append("g")
      .attr("class", "weekly y axis")
      .attr("transform", "translate(-10,0)")
      .call(yAxis)

      // .append("text")
      // .attr("class", "weekly y text")
      // .attr("transform", "rotate(-90)")
      // .attr("y", 6)
      // .attr("dy", ".71em")
      // .style("text-anchor", "end")
      // .text('Distance (km)');

// create a group for your overlapped bars
    var g = svg.selectAll(".bars")
      .data(data)
      .enter().append("g")

    var tip1 = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])

    var tip2 = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      // .html(function(d) {
      //   return "<span style='color:white'>" + d.user + " " + units + "</span>";
      // })
        
// place the second bar on top of it
    var bar1 = g.append("rect")
      //.attr("class", "bar2")
      .attr('fill', '#A8232C')
      .attr('opacity', 0.3)
      .attr("x", function(d) {
        return x(d.mode) + 20;
      })
      .attr("width", x.rangeBand() - 20)
      .attr("y", function(d) {
        tip1.html(function(d) {
          return "<span style='color:white'>" + "Neighbors: " + "<br>" + d.mode+ " " + d.neighbor + " hrs" + "</span>";
        })
        return y(d.neighbor);
      })
      .attr("height", function(d) {
        return height - y(d.neighbor);
      })
      bar1.call(tip1)
      .on('mouseover', tip1.show)
      .on('mouseout', tip1.hide);        
     
// place the first bar  
    var bar2 = g.append("rect")
      .attr('fill', '#A8232C')
      .attr("x", function(d) {
        return x(d.mode) + 5; // center it
      })
      .attr("width", x.rangeBand() - 20) // make it slimmer
      .attr("y", function(d) {
        tip2.html(function(d) {
          return "<span style='color:white'>" + "You: " + "<br>" + d.mode+ " " + d.user + " hrs" + "</span>";
        })

        return y(d.user);
      })
      .attr("height", function(d) {
        return height - y(d.user);
      })
      bar2.call(tip2)
      .on('mouseover', tip2.show)
      .on('mouseout', tip2.hide);
    


   //Legend labels
    svg.append('text')
      .attr("class", "weekly text")
      .attr('fill', 'black')
      .attr('x', 40)
      .attr('y', 437)
      .text("You");

    svg.append('text')
      .attr("class", "weekly text")
      .attr('fill', 'black')
      .attr('x', 112)
      .attr('y', 437)
      .text("Your neighbors");

    //Legend 
    svg.append('rect')
      .attr('fill', '#A8232C')
      .attr('width', 25)
      .attr('height', 25)
      .attr('x', 10)
      .attr('y', 420);

    svg.append('rect')
      .attr('fill', '#A8232C')
      .attr('opacity', 0.3)
      .attr('width', 25)
      .attr('height', 25)
      .attr('x', 80)
      .attr('y', 420);

    //Car icon
    svg.append("image")
      .attr("xlink:href", "images/car.png")
      .attr("x", 13)
      .attr("y", 340)
      .attr("width", 19)
      .attr("height", 19);    

    //Bus icon
    svg.append("image")
      .attr("xlink:href", "images/bus.png")
      .attr("x", 63)
      .attr("y", 340)
      .attr("width", 15)
      .attr("height", 15);

    //Train icon
    svg.append("image")
      .attr("xlink:href", "images/train.png")
      .attr("x", 110)
      .attr("y", 340)
      .attr("width", 20)
      .attr("height", 20); 

    //Bike icon
    svg.append("image")
      .attr("xlink:href", "images/bike.png")
      .attr("x", 158)
      .attr("y", 340)
      .attr("width", 22)
      .attr("height", 22);   

    //Walk icon
    svg.append("image")
      .attr("xlink:href", "images/walk.png")
      .attr("x", 207)
      .attr("y", 340)
      .attr("width", 21)
      .attr("height", 21);  

    //Big label
    svg.append('text')
        .attr('class', 'bigLabel')
        .attr('fill','black')
        .attr('x', 30)
        .attr('y', -60)
        .text('Travel Time');

  });
});


    function type(d) {
      d.user = +d.user;
      d.neighbor = +d.neighbor;
      return d;
    }