import Ember from "ember";
var computed = Em.computed;
var observer = Em.observer;

const DISPLAY_DATE_FORMAT = "%b %d";
const FLAREDOWN_COLORS = [
  "#B2BE84", "#709CB2", "#ED9E81",
  "#E7CC89", "#B18DB4", "#74A893",
  "#DB7B9C", "#F07670"
];
const KEEN_DATE_FORMAT = "%Y-%m-%dT%H:%M:%S.%LZ";
const MARGIN_BASE = 12;
const PADDING_TOP = 0;
const PADDING_RIGHT = 10;

export default Ember.Mixin.create({

  dataChanged: observer("data", function() {
    Ember.assert("must have chartDivHeight", Ember.isPresent(this.get("chartDivHeight")));
    Ember.assert("must have legendRoom", Ember.isPresent(this.get("legendRoom")));
    Ember.assert("must have xAxisRoom", Ember.isPresent(this.get("xAxisRoom")));
    Ember.assert("must have yAxisRoom", Ember.isPresent(this.get("yAxisRoom")));

    Ember.assert("must have element", Ember.isPresent(this.get("element")));
    Ember.assert("must have margin", Ember.isPresent(this.get("margin")));
    Ember.assert("must have plotHeight", Ember.isPresent(this.get("plotHeight")));
    Ember.assert("must have plotWidth", Ember.isPresent(this.get("plotWidth")));

    Ember.assert("must have setupD3", Ember.isPresent(this.get("setupD3")));
    Ember.assert("must have updateD3", Ember.isPresent(this.get("updateD3")));
    Ember.assert("must have chartEnter", Ember.isPresent(this.get("chartEnter")));
    Ember.assert("must have chartUpdate", Ember.isPresent(this.get("chartUpdate")));

    if (this.get("svgExists")) {
      this.updateD3();
    } else {
      this.setupD3();
      this.updateD3();
    }
  }).on("didInsertElement"),

  colorPalette: FLAREDOWN_COLORS,
  formatCount: d3.format("d"),
  formatDateDisplay: d3.time.format(DISPLAY_DATE_FORMAT),
  formatDateKeen: d3.time.format(KEEN_DATE_FORMAT),
  paddingRight: PADDING_RIGHT,
  paddingTop: PADDING_TOP,
  timeframeStart: new Date(2015, 4, 1),
  timeframeEnd: new Date(),

  margin: computed("xAxisRoom", "yAxisRoom", "legendRoom", function() {
    return {
      top: MARGIN_BASE,
      right: MARGIN_BASE + this.get("legendRoom"),
      bottom: MARGIN_BASE + this.get("xAxisRoom"),
      left: MARGIN_BASE + this.get("yAxisRoom")
    };
  }),

  // TODO rename this: it returns the chart root "g" element, NOT "svg"
  svg: computed(function() {
    // BEWARE, d3 sets stuff on .select (don't watch for "element")
    return d3.select(this.get("element")).select("svg g");
  }),

  svgExists: computed(function() {
    return $(this.get("#" + "elementId")).find("svg").length;
  }),

  preprocessD3: function() {
    //
  },

  setupD3: function() {
    this.drawSvg(this.get("chartElement"), this.get("plotWidth"), this.get("plotHeight"), this.get("margin"));
    this.chartEnter();
    this.drawXAxis(this.get("xAxis"), this.get("svg"), this.get("plotHeight"));
    this.drawYAxis(this.get("yAxis"), this.get("svg"), this.get("yAxisRoom")); 
  },

  updateD3: function() {
    this.chartUpdate();

    this.updateXAxis(this.get("xAxis"));

    this.updateYAxis(this.get("yAxis"));    

    this.drawTitle(this.get("titleString"), this.get("element"));
  },

  // TODO decide if these take parameters or reference properties
  drawSvg: function(chartElement, plotWidth, plotHeight, margin) {
    d3.select(chartElement).append("svg")
        .attr("width", plotWidth + margin.left + margin.right)
        .attr("height", plotHeight + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");     
  },

  drawTitle: function(titleString, element) {
    d3.select(element).select(".chart-title").text(titleString);
  },


  drawXAxis: function(axis, target, height) {
    if (axis) {
      target.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0, " + height + ")")
        .call(axis);
    }
  },

  drawYAxis: function(axis, target) {
    if (axis) {
      target.append("g")
        .attr("class", "y axis")
        .call(axis);
    }
  },

  filterByDate: function(data, start, end) {

    data.forEach((d) => {
      d.date = this.get("formatDateKeen").parse(d.timeframe.start);
    });

    return data.filter(function(d) {
      return (d.date >= start) && (d.date < end);
    });
  },

  formatPercentage: function(n, total) {
    return Math.round(100 * n / total).toString() + "%";
  },

  truncate: function(text, width, padding) {
    text.each(function() {
      var self = d3.select(this),
        textLength = self.node().getComputedTextLength(),
        text = self.text();
      while (textLength > (width - 2 * padding) && text.length > 0) {
        text = text.slice(0, -1);
        self.text(text + "...");
        textLength = self.node().getComputedTextLength();
      }
    });
  },

  updateXAxis: function(axis){
    if (axis) {
      this.get("svg").selectAll(".x.axis")
        .call(axis);
    }
  },

  updateYAxis: function(axis){
    if (axis) {
    this.get("svg").selectAll(".y.axis")
      .call(axis)      
      .selectAll(".tick text")
      .call(this.truncate, this.get("yAxisRoom"), 0); 
    }
  }
});
