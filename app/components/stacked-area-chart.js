import Ember from "ember";
import Chart from "../mixins/chart";
var computed = Em.computed;


export default Ember.Component.extend(Chart, {

  nDays: 4,  // TODO: unhardcode
  legendRectSize: 18,
  legendSpacing: 4,

  // data properties

  processedData: computed("data", "timeframeStart", "timeframeEnd",
    function() {

      var _data = this.filterByDate(
        this.get("data").processed,
        this.get("timeframeStart"),
        this.get("timeframeEnd")
      );

      _data.forEach((d) => {
        d.total = d.value
          .map(function(x) { return x.result; })
          .reduce(function(previousValue, currentValue) {
            return previousValue + currentValue;
          });
      });

      return _data;
  }),

  dataForD3: computed("processedData", "stackFunction", "groups", function() {
    return this.get("stackFunction")(this.get("groups").map((name) => {
      return {
        groupBy: name,
        values: this.get("processedData").map((d) => {
          return { date: d.date, y: d.value[this.get("groups").indexOf(name)].result };
        })
      };
    }));    
  }),

  // other properties

  areaFunction: computed("xScale", "yScale", function() {
    return d3.svg.area()
      .x((d) => { return this.get("xScale")(d.date); })
      .y0((d) => { return this.get("yScale")(d.y0); })
      .y1((d) => { return this.get("yScale")(d.y0 + d.y); });
  }),

  chartDivWidth: computed("chartElement", function() {
    return parseInt(d3.select(this.get("chartElement")).style("width"), 10);
  }),

  chartElement: computed("elementId", function() {
    return "#" + this.get("elementId") + " .chart";
  }),

  colorScale: computed("colorPalette", "groups", function() {
    return d3.scale.ordinal()
      .domain(this.get("groups"))
      .range(this.get("colorPalette"));
  }),

  groupBy: computed("data", function() {
    return this.get("data").specs.queryParams.groupBy;
  }),

  groups: computed("data", "groupBy", function() {
    return this.get("data").processed[0].value.map((x) => {
      return x[this.get("groupBy")];
    });
  }),

  plotWidth: computed("chartDivWidth", "margin", function(){
    return this.get("chartDivWidth") - this.get("margin").left - this.get("margin").right;
  }),

  plotHeight: computed("chartDivHeight", "margin", function() {
    return this.get("chartDivHeight") - this.get("margin").top - this.get("margin").bottom;
  }),

  stackFunction: computed(function() {
    return d3.layout.stack()
      .values(function(d) { return d.values; });
  }),

  titleString: computed("data", "formatDateDisplay", "timeframeStart", "timeframeEnd", function() {
    var spec = this.get("data").specs;
    return spec.queryType +
      " " + spec.queryParams.targetProperty +
      " in " + spec.queryParams.eventCollection +
      " by " + spec.queryParams.groupBy +
      " " + spec.queryParams.interval +
      " from " + this.get("formatDateDisplay")(this.get("timeframeStart")) +
      " to " + this.get("formatDateDisplay")(this.get("timeframeEnd")) ;
  }),

  xAxis: computed("formatDateDisplay", "nDays", "xScale", function() {
    return d3.svg.axis()
      .scale(this.get("xScale"))
      .orient("bottom")
      .ticks(this.get("nDays"))
      .tickFormat(this.get("formatDateDisplay"))
      .tickSubdivide(0);
  }),

  xScale: computed("processedData", "plotWidth", function() {
    return d3.time.scale()
      .domain(d3.extent(this.get("processedData"), function(d) { return d.date; }))
      .range([0, this.get("plotWidth")]);
  }),

  yAxis: computed("formatCount", "yScale", function() {
    return d3.svg.axis()
      .scale(this.get("yScale"))
      .orient("left")
      .ticks(4)
      .tickFormat(this.get("formatCount"))
      .tickSubdivide(0);
  }),

  yScale: computed("data", "plotHeight", function() {
    return d3.scale.linear()
      .domain([0, d3.max(this.get("data").processed, function(d) { return d.total; })])
      .range([this.get("plotHeight"), 0]);
  }),

  willInsertElement(){
    this.set("chartDivHeight", 250);
    this.set("xAxisRoom", 13);
    this.set("yAxisRoom", 25);
    this.set("legendRoom", 90);
  },

  chartElements: function() {
    // this returns the update selection
    return this.get("svg").selectAll(".group").data(this.get("dataForD3"));   
  },

  chartEnter: function() {
    var enterSelection = this.get("svg").selectAll("path.group")
      .data(this.get("dataForD3"))
      .enter();   

    enterSelection.append("path")
      .attr("class", "group")
      .attr("d", (d) => { return this.get("areaFunction")(d.values); })
      .style("fill", (d) => { return this.get("colorScale")(d.groupBy); });

    this.legendEnter();
  },

  chartUpdate: function() {
    this.chartEnter();

    var updateSelection = this.chartElements();

    updateSelection.attr("d", (d) => { return this.get("areaFunction")(d.values); })
      .style("fill", (d) => { return this.get("colorScale")(d.groupBy); });

    var exitSelection = updateSelection.exit();
    exitSelection.remove();        

    this.legendUpdate();
  },

  legendElements: function() {
    // this returns the update selection
    return this.get("svg").selectAll(".legend").data(this.get("dataForD3"));       
  },

  legendEnter: function() {
    var enterSelection = this.get("svg").selectAll(".legend")
      .data(this.get("dataForD3"))
      .enter();   

    var legendGs = enterSelection.append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => {
        var legendEntryHeight = this.get("legendRectSize") + this.get("legendSpacing");
        var offset = 0;
        var horz = this.get("plotWidth") + 10;
        var vert = i * legendEntryHeight - offset;
        return "translate(" + horz + "," + vert + ")";
      });

    legendGs.append("rect")
      .attr("width", this.get("legendRectSize"))
      .attr("height", this.get("legendRectSize"))
      .style("fill", (d) => { 
        return this.get("colorScale")(d.groupBy);
      })
      .style("stroke", (d) => { 
        return this.get("colorScale")(d.groupBy);
      });

    legendGs.append("text")
      .attr("x", this.get("legendRectSize") + this.get("legendSpacing"))
      .attr("y", this.get("legendRectSize") - this.get("legendSpacing"))
      .text(function(d) { return d.groupBy; })
      .call(
        this.truncate,
        this.get("legendRoom") - this.get("legendRectSize") - this.get("legendSpacing"),
        0
      );
  },

  legendUpdate: function() {
    var updateSelection = this.legendElements();

    updateSelection.attr("transform", (d, i) => {
        var legendEntryHeight = this.get("legendRectSize") + this.get("legendSpacing");
        var offset = 0;
        var horz = this.get("plotWidth") + 10;
        var vert = i * legendEntryHeight - offset;
        return "translate(" + horz + "," + vert + ")";
      });

    updateSelection.selectAll("rect")
      .attr("width", this.get("legendRectSize"))
      .attr("height", this.get("legendRectSize"))
      .style("fill", (d) => { 
        return this.get("colorScale")(d.groupBy);
      })
      .style("stroke", (d) => { 
        return this.get("colorScale")(d.groupBy);
      });

    updateSelection.selectAll("text")
      .attr("x", this.get("legendRectSize") + this.get("legendSpacing"))
      .attr("y", this.get("legendRectSize") - this.get("legendSpacing"))
      .text(function(d) { return d.groupBy; })
      .call(
        this.truncate,
        this.get("legendRoom") - this.get("legendRectSize") - this.get("legendSpacing"),
        0
      );

    var exitSelection = updateSelection.exit();
    exitSelection.remove();
  }
});
