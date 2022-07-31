function DrawWorldMap(countries, divId, contries) {

    d3.select(divId).html("");



    var width = 700,
        height = 500;

    var svg = d3.select(divId)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
    //    .style('border', '2px solid #000');

    var projection = d3.geoEquirectangular()
        .scale(100)
        .translate([width / 2.2, height / 2]);

    var geoPath = d3.geoPath()
        .projection(projection);

    svg.append("g")
        .selectAll("path")
        .data(topojson.feature(countries, countries.objects.countries).features)
        .enter()
        .append("path")
        .attr("d", geoPath)
        .attr("class", "countrymap")
        .attr("id", function(d){ return d.properties.id;})
        .style('stroke', 'white')
        .style('stroke-width', 0.5)
        .style("opacity", function (d) {
            return (d.properties.id == "AUS" ? 1 : 0.4);
        })
        .attr("fill", function (d) {
            var test = contries.has(d.properties.id);
            return (test ? 'green' : 'red');
        })


    // Handmade legend
    var legend = svg.append("g")
    .attr("transform","translate(300,-80)");
    legend.append("circle").attr("cx", 170).attr("cy", 130).attr("r", 6).style("fill", "green")
    legend.append("circle").attr("cx", 170).attr("cy", 160).attr("r", 6).style("fill", "red")
    legend.append("text").attr("x", 180).attr("y", 130).text("OECD MEMBER COUNTRIES").style("font-size", "11px").attr("alignment-baseline", "middle")
    legend.append("text").attr("x", 180).attr("y", 160).text("NON OECD MEMBER COUNTRIES").style("font-size", "11px").attr("alignment-baseline", "middle")


}