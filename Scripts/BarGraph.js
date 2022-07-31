// function to draw bar graph 
// data : data for bar graph
// divId : continer id where we will show graph
// barcolor : set bar color default is set to skyblue
// w : width of graph default is set to 800
// h : height of graph default is set to 600

function BarGraph(data, divId, barcolor = 'skyblue', w = 800, h = 600) {
 let countrySelected = document.getElementById('countryLabel').innerHTML;
    d3.select(divId).html("");
    // create svg
    var svg = d3.select(divId).append("svg").style("overflow", "visible")
        .attr("width", w)
        .attr("height", h),
        margin = {
            top: 20,
            right: 20,
            bottom: 70,
            left: 60
        },
        x = d3.scaleBand().padding(0.1),
        y = d3.scaleLinear(),
        theData = data;
        
    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    g.append("g")
        .attr("class", "axis axis--x");

    g.append("g")
        .attr("class", "axis axis--y");
    // label for v axis
    g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .style("font-size", "small")
        .text("value");

    // DRAWING

    function draw() {
        var bounds = svg.node().getBoundingClientRect(),
            width = bounds.width - margin.left - margin.right,
            height = bounds.height - margin.top - margin.bottom;
        //set range for axis and style 
        x.rangeRound([0, width]);
        y.rangeRound([height, 0]);

        g.select(".axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");;

        g.select(".axis--y")
            .call(d3.axisLeft(y).ticks(5));
        // generate bars 
        var bars = g.selectAll(".bar")
            .data(theData);

        bars
            .enter().append("rect")
            .attr("class", "bar")
            .attr("id", function(d){ return d.key;})
            .style("fill", function(d){ 
                if(d.key==countrySelected){
                    return "green";
                }
                else{
                    return barcolor;
                }
            })
            .attr("x", function (d) {
                return x(d.key);
            })
            .attr("y", function (d) {
                return y(d.value);
            })
            .attr("width", x.bandwidth())
            .attr("height", function (d) {
                return height - y(d.value);
            });

        // UPDATE
        bars.attr("x", function (d) {
                return x(d.key);
            })
            .attr("y", function (d) {
                return y(d.value);
            })
            .attr("width", x.bandwidth())
            .attr("height", function (d) {
                let h = height - y(d.value);
                if(h>0){
                    return h;
                }
                else{
                    return 0;
                }
            });

        // EXIT
        bars.exit()
            .remove();

    }
    // set domain for axises
    x.domain(theData.map(function (d) {
        return d.key;
    }));
    var max = d3.max(theData, function (d) {
        return d.value;
    });
    y.domain([0, max]);

    draw();

    window.addEventListener("resize", draw);
    
}