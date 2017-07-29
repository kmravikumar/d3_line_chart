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
    var margin = {top: 20, right: 10, bottom: 100, left: 20},
    width = width - margin.left - margin.right,
    height = height - margin.top - margin.bottom;

    // Determine max data to set the axis limits
    // This is not a neat fix, but a hack!
    // D3 adjusts ticks in multiples of 5 - so add 1 if it is a exact multiple
    var maxData = Math.max.apply(Math,dataArray.map(function(d){return d[1];}))
    if (maxData%5==0){
        maxData = maxData + 1;
    }

    // Define linear scale for y-axis
    // Note that the height range is reversed. This
    // is to make sure that the bars start frmo the bottom rather than the top
    var heightScale = d3.scaleLinear()
                            .domain([0,maxData])
                            .range([height, 0])
                            ;

    // define scale for categorical x-axis
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
                .tickSize(3)
                ;

    // Define the canvas which will hole the bar chart
    var canvas = d3.select(htmlObjectId)
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                    ;

     // Define the line and bind it to the data
    var line = d3.line()
        .x(function(d) {return widthScale(d[0]) + widthScale.bandwidth()/2; })
        .y(function(d) {return heightScale(d[1]); })
        .curve(d3.curveLinear);

    canvas.append("path")
        .data([dataArray])
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line);

    // Add dots for data points
    canvas.selectAll("dot")
        .data(dataArray)
      .enter().append("circle")
        .attr("r", 3.5)
        .attr("cx", function(d) { return widthScale(d[0]) + widthScale.bandwidth()/2; })
        .attr("cy", function(d) { return heightScale(d[1]); })
        .attr("fill", "steelblue");

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
                // uncomment if the axis ie needed on the right side of the graph
                .attr("transform", "translate(" + margin.left +", 0)")
                .attr("class", "axis y")  
                ;
                                
}                            