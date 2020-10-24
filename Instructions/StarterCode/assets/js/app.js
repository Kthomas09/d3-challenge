// @TODO: YOUR CODE HERE!
var svgWidth = 920;
var svgHeight = 620;

var margin = {
    top: 20,
    right: 40,
    bottom: 200,
    left: 100 
}

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var chart = d3.select("#scatter")
              .append("div")
              .attr("class", "chart");

var svg = chart.append("svg")
               .attr("width", svgWidth)
               .attr("height", svgHeight);

var chartGroup = svg.append("g")
                    .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("assets/data/data.csv").then(function(data){
    console.log(data);
    data.forEach(function(healthData){
        healthData.healthcare = +healthData.healthcare;
        healthData.poverty = +healthData.poverty;
    });

    
    var xLinearScale = d3.scaleLinear()
                         .domain([20, d3.max(data, d => d.healthcare)])
                         .range([0, width]);
    
    var yLinearScale = d3.scaleLinear()
                         .domain([0, d3.max(data, d => d.poverty)])
                         .range([height, 0]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
              .attr("transform", `translate(0, ${height})`)
              .call(bottomAxis);

    chartGroup.append("g")
              .call(leftAxis);

    var circlesGroup = chartGroup.selectAll("circle")
                                 .data(data)
                                 .enter()
                                 .append("circle")
                                 .attr("cx", d => xLinearScale(d.healthcare))
                                 .attr("cy", d => yLinearScale(d.poverty))
                                 .attr("r", "15")
                                 .attr("fill", "blue")
                                 .attr("opacity", ".5");

    var toolTip = d3.tip()
                    .attr("class", "tooltip")
                    .offset([80, -60])
                    .html(function(d){
                        return(`${d.state}`)
                    });
    
    chartGroup.call(toolTip);

    circlesGroup.on("click", function(data){
        toolTip.show(data, this);
    })
               .on("mouseout", function(data, index){
                   toolTip.hide(data);
               });

    chartGroup.append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 0-margin.left +40)
              .attr("x", 0-(height /2))
              .attr("dy", "1em")
              .attr("class", "axisText")
              .text("State Poverty Rate");

    chartGroup.append("text")
              .attr("tranform", `translate(${width/2}, ${height + margin.top +30})`)
              .attr("class", "axisText")
              .text("State Healthcare");
}).catch(function(error){
    console.log(error);
});