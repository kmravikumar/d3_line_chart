var dataArray = [
                 ['category A',5], ['category B',10], ['Some text ...long C',19], ['D',40],
                 ['category Q',5], ['category R',10], ['Some text ...long S',19], ['T',40]                                                   
                ];

plot_line_graph(dataArray, "#line_chart", 300, 200);


// A function to plot D3 line chart - Pass in the data array and the html objectId
// where the chart needs to be.
// Also pass the width, height for the plot
function plot_line_graph (dataArray, htmlObjectId, width, height) {

    // set margins for a nice looking bar chart
    var margin = {top: 10, right: 20, bottom: 50, left: 20},
    width = width - margin.left - margin.right,
    height = height - margin.top - margin.bottom;

    // Determine max data to set the axis limits
    var maxData = Math.max.apply(Math,dataArray.map(function(d){return d[1];}));
    var minData = Math.min.apply(Math,dataArray.map(function(d){return d[1];}));
    

    // Define linear scale for y-axis
    // Note that the height range is reversed. 
    var heightScale = d3.scaleLinear()
                            .range([height, margin.top])
                            // change 0 to minData is required
                            .domain([0,maxData])
                            ;

    // define scale for categorical x-axis
    // NOTE: The range is from margin.left and not 0.
    var widthScale = d3.scaleBand()
                        .range([margin.left, width])
                        .padding(0.1)
                        .domain(dataArray.map(function(d) { return d[0]; }))
                        ;

    // define x,y-axes scale and align them bottom and left
    var yaxis = d3.axisLeft()
                .scale(heightScale)
                .tickSize(3)
                ;

    var xaxis = d3.axisBottom()
                .scale(widthScale)
                .tickSize(0)
                ;

    // Define the canvas which will hold the chart
    var canvas = d3.select(htmlObjectId)
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    ;

     // Define the line and bind it to the data
    var line = d3.line()
        .x(function(d) {return widthScale(d[0]) + widthScale.bandwidth()/2; })
        .y(function(d) {return heightScale(d[1]); })
        .curve(d3.curveLinear)
        ;


    // Draw line connecting the data points
    // Do not fill!
    canvas.append("path")
        .data([dataArray])
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line)
        ;

    // Define the div for the tooltip
    // The styling and locations need css definitions.
    var div = d3.select(htmlObjectId)
                .append("div")	
                .attr("class", "tooltip")				
                .style("opacity", 0);


     // Add dots for data points. 
     // Also includes tooltip
    canvas.selectAll("dot")
        .data(dataArray)
      .enter().append("circle")
        .attr("r", 3.5)
        .attr("cx", function(d) { return widthScale(d[0]) + widthScale.bandwidth()/2; })
        .attr("cy", function(d) { return heightScale(d[1]); })
        .attr("fill", "steelblue")
        .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html(d[0] + "<br/>" + d[1])
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function() {		
            div.transition()		
                .duration(200)		
                .style("opacity", 0);	
        })
        ;


    // Add x-axis to the bar chart canvas
    canvas.append("g")
                .call(xaxis)
                .attr("transform", "translate(0," + height + ")")
                .attr("class", "axis x")  
            .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-4")
                .attr("dy", "4")
                .attr("transform", "rotate(-75)" )
                ;


    // add y-axis to the bar chart canvas
    canvas.append("g")
                .call(yaxis)
                .attr("transform", "translate(" + margin.left +", 0)")
                .attr("class", "axis y")  
                ;
                                
}                            