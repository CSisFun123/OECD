
function RadarGraph(data,divId) {    
    var radius = 5;
    var w = 400;
    var h = 400;
    var factor = 1;
    var factorLegend = .85;
    var levels = 5;
    var maxValue = d3.max(data[0], d => d.value);
    var radians = 2 * Math.PI;
    var opacityArea = 0.5;
    var ToRight = 5;
    var TranslateX = 125;
    var TranslateY = 50;
    var ExtraWidthX = 200;
    var ExtraWidthY = 200;
    var color = d3.scaleOrdinal().range(["#6F257F", "#CA0D59"]);

    var allAxis = (data[0].map(function (i, j) {
        return i.key
    }));
    var total = allAxis.length;
    var radius = factor * Math.min(w / 2, h / 2);
    var Format = d3.format('%');
    d3.select(divId).select("svg").remove();

    var g = d3.select(divId)
        .append("svg")
        .attr("width", w + ExtraWidthX)
        .attr("height", h + ExtraWidthY)
        .style("overflow", "visible")
        .append("g")
        .attr("transform", "translate(" + TranslateX + "," + TranslateY + ")");

    var tooltip;

    //Circular segments
    for (var j = 0; j < levels; j++) {
        var levelFactor = factor * radius * ((j + 1) / levels);
        g.selectAll(".levels")
            .data(allAxis)
            .enter()
            .append("svg:line")
            .attr("x1", function (d, i) {
                return levelFactor * (1 - factor * Math.sin(i * radians / total));
            })
            .attr("y1", function (d, i) {
                return levelFactor * (1 - factor * Math.cos(i * radians / total));
            })
            .attr("x2", function (d, i) {
                return levelFactor * (1 - factor * Math.sin((i + 1) * radians / total));
            })
            .attr("y2", function (d, i) {
                return levelFactor * (1 - factor * Math.cos((i + 1) * radians / total));
            })
            .attr("class", "line")
            .style("stroke", "white")
            .style("stroke-opacity", "0.75")
            .style("stroke-width", "0.3px")
            .attr("transform", "translate(" + (w / 2 - levelFactor) + ", " + (h / 2 - levelFactor) + ")");
    }

    //Text indicating at what % each level is
    for (var j = 0; j < levels; j++) {
        var levelFactor = factor * radius * ((j + 1) / levels);
        g.selectAll(".levels")
            .data([1]) //dummy data
            .enter()
            .append("svg:text")
            .attr("x", function (d) {
                return levelFactor * (1 - factor * Math.sin(0));
            })
            .attr("y", function (d) {
                return levelFactor * (1 - factor * Math.cos(0));
            })
            .attr("class", "legend")
            .style("font-family", "sans-serif")
            .style("font-size", "10px")
            .attr("transform", "translate(" + (w / 2 - levelFactor + ToRight) + ", " + (h / 2 - levelFactor) + ")")
            .attr("fill", "black")
            .text(d3.format(",.0f")((j + 1) * maxValue / levels));
    }

    series = 0;

    var axis = g.selectAll(".axis")
        .data(allAxis)
        .enter()
        .append("g")
        .attr("class", "axis");

    axis.append("line")
        .attr("x1", w / 2)
        .attr("y1", h / 2)
        .attr("x2", function (d, i) {
            return w / 2 * (1 - factor * Math.sin(i * radians / total));
        })
        .attr("y2", function (d, i) {
            return h / 2 * (1 - factor * Math.cos(i * radians / total));
        })
        .attr("class", "line")
        .style("stroke", "white")
        .style("stroke-width", "1px");

    axis.append("text")
        .attr("class", "legend")
        .text(function (d) {
            return d
        })
        .style("font-family", "sans-serif")
        .style("font-size", "11px")
        .attr("text-anchor", "middle")
        .attr("dy", "1.5em")
        .attr("transform", function (d, i) {
            return "translate(0, -10)"
        })
        .attr("x", function (d, i) {
            return w / 2 * (1 - factorLegend * Math.sin(i * radians / total)) - 60 * Math.sin(i * radians / total);
        })
        .attr("y", function (d, i) {
            return h / 2 * (1 - Math.cos(i * radians / total)) - 20 * Math.cos(i * radians / total);
        });


    data.forEach(function (y, x) {
        dataValues = [];
        g.selectAll(".nodes")
            .data(y, function (j, i) {
                dataValues.push([
                    w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / maxValue) * factor * Math.sin(i * radians / total)),
                    h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / maxValue) * factor * Math.cos(i * radians / total))
                ]);
            });
        dataValues.push(dataValues[0]);
        g.selectAll(".key")
            .data([dataValues])
            .enter()
            .append("polygon")
            .attr("class", "radar-chart-serie" + series)
            .style("stroke-width", "2px")
            .style("stroke", color(series))
            .attr("points", function (d) {
                var str = "";
                for (var pti = 0; pti < d.length; pti++) {
                    str = str + d[pti][0] + "," + d[pti][1] + " ";
                }
                return str;
            })
            .style("fill", function (j, i) {
                return color(series)
            })
            .style("fill-opacity", opacityArea)
            .on('mouseover', function (d) {
                z = "polygon." + d3.select(this).attr("class");
                g.selectAll("polygon")
                    .transition(200)
                    .style("fill-opacity", 0.1);
                g.selectAll(z)
                    .transition(200)
                    .style("fill-opacity", .7);
            })
            .on('mouseout', function () {
                g.selectAll("polygon")
                    .transition(200)
                    .style("fill-opacity", opacityArea);
            });
        series++;
    });
    series = 0;


    var tooltip = d3.select("body").append("div").attr("class", "toolTip");
    data.forEach(function(y, x){
        g.selectAll(".nodes")
        .data(y).enter()
        .append("svg:circle")
        .attr("class", "radar-chart-serie"+series)
        .attr('r', 5)
        .attr("alt", function(j){return Math.max(j.value, 0)})
        .attr("cx", function(j, i){
          dataValues.push([
          w/2*(1-(parseFloat(Math.max(j.value, 0))/maxValue)*factor*Math.sin(i*radians/total)), 
          h/2*(1-(parseFloat(Math.max(j.value, 0))/maxValue)*factor*Math.cos(i*radians/total))
        ]);
        return w/2*(1-(Math.max(j.value, 0)/maxValue)*factor*Math.sin(i*radians/total));
        })
        .attr("cy", function(j, i){
          return h/2*(1-(Math.max(j.value, 0)/maxValue)*factor*Math.cos(i*radians/total));
        })
        .attr("data-id", function(j){return j.key})
        .style("fill", "#fff")
        .style("stroke-width", "2px")
        .style("stroke", color(series)).style("fill-opacity", .9)
        .on('mouseover', function (d){
          console.log(d.key)
              tooltip
                .style("left", d3.event.pageX - 40 + "px")
                .style("top", d3.event.pageY - 80 + "px")
                .style("display", "inline-block")
                        .html((d.key) + "<br><span>" + (d.value) + "</span>");
              })
              .on("mouseout", function(d){ tooltip.style("display", "none");});
  
        series++;
      });
}