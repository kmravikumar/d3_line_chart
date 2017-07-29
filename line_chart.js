var dataArray = [
                 ['category A',5], ['category B',10], ['Some text ...long C',19], ['D',40],
                 ['category E',5], ['category F',10], ['Some text ...long G',19], ['H',40],
                 ['category I',5], ['category J',10], ['Some text ...long K',19], ['L',40],
                 ['category M',5], ['category N',10], ['Some text ...long O',19], ['P',40],
                 ['category Q',5], ['category R',10], ['Some text ...long S',19], ['T',40]                                                   
                ];

plot_bar_graph(dataArray, "#bar_chart", 400, 300);


// A function to plot D3 bar chart - Pass in the data array and the html objectId
// where the chart needs to be.
// Also pass the width, height for the plot
function plot_bar_graph (dataArray, htmlObjectId, width, height) {

    // set margins for a nice looking bar chart
    var margin = {top: 20, right: 50, bottom: 100, left: 10},
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
                        .range([0, width])
                        .padding(0.1)
                        .domain(dataArray.map(function(d) { return d[0]; }))
                        ;

    // define x,y-axes scale and align them bottom and right
    var yaxis = d3.axisRight()
                .scale(heightScale)
                .tickSize(3)
                ;

    var xaxis = d3.axisBottom()
                .scale(widthScale)
                .tickSize(0)
                ;

    // Define the canvas which will hole the bar chart
    var canvas = d3.select(htmlObjectId)
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                    ;

    // add bars to the canvas                
    var bars = canvas.selectAll("rect")
                    .data(dataArray)
                    .enter()
                        .append("rect")
                        .attr("class", "bar")
                        .attr("y", function(d) {return heightScale(d[1]);})
                        .attr("x", function(d) {return widthScale(d[0]);})
                        .attr("height", function(d) {return height - heightScale(d[1]);})
                        .attr("width", widthScale.bandwidth())
                        .attr("fill", "gray")
                        .on("mouseover", function(d) {
                            d3.select(this).attr("fill","red");
                        })
                        .on("mouseout", function(d) {
                            d3.select(this).attr("fill","gray");
                        })                        
                        .on("click", function(d) {
                            console.log(d);
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
                .attr("transform", "translate(" + width + ",0)")
                .attr("class", "axis y")  
                ;
                                
}                            