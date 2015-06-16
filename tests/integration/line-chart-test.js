import { moduleForComponent, test } from "ember-qunit";
import lineChartFixture from "../fixtures/line-chart-fixture";


moduleForComponent("line-chart", "LineChartComponent", {
  needs: [],
  setup: function() {
    var fixture = lineChartFixture();

    this.subject().set("data", fixture);
  },
  tearDown: function() {
    //
  }
});

test("it renders", function() {
  var component = this.subject();
  equal(component._state, "preRender");
  this.render();

  equal(component._state, "inDOM");
});

test("it sizes the svg based on div size and margin options", function() {
  var component = this.subject();
  this.render();

  var svg = component.$().find("svg");

  ok(svg, "draws the svg");

  var chartDiv = component.$().find(".chart");
  var margin = component.get("margin")(
    component.get("xAxisRoom"),
    component.get("yAxisRoom"),
    component.get("legendRoom")    
  );
  var expectedSvgWidth = chartDiv.width() - margin.right;
  var expectedSvgHeight = component.get("chartDivHeight");

  equal(svg.width(), expectedSvgWidth, "width");
  equal(svg.height(), expectedSvgHeight, "height");
});



test("it draws axes", function() {
  var component = this.subject();
  this.render();

  var svg = component.$().find("svg");
  var xAxis = svg.find(".x");
  var yAxis = svg.find(".y");

  ok(xAxis);
  ok(yAxis);
});

test("it writes a chart title", function() {
  var component = this.subject();
  this.render();

  var title = component.$().find(".chart-title");

  var expectedTitle = component.get("titleString");

  equal(title.text(), expectedTitle);
});

test("it draws a line", function() {
  var component = this.subject();  
  this.render();

  var processedData = component.get("data").processed;

  var svg = component.$().find("svg");
  var line = svg.find(".line")[0];

  ok(line, "draws the line");

  var segments = [];
  for (var i = 0 ; i < line.pathSegList.numberOfItems; i++) {
    var item = line.pathSegList.getItem(i);
    switch (item.pathSegType) {
    case SVGPathSeg.PATHSEG_MOVETO_ABS:
       segments.push({x: item.x, y: item.y});
       break;
    case SVGPathSeg.PATHSEG_LINETO_ABS:
       segments.push({x: item.x, y: item.y});
    }
  }

  var expectedSegmentCount = processedData.length;
  equal(segments.length, expectedSegmentCount, "draws the right number of segments");

  var expectedSegmentX = 460;  // fragile, based on fixture and div width/height
  var expectedSegmentY = 12;  // fragile, based on fixture and div width/height

  equal(Math.round(segments[5].x), expectedSegmentX, "segments go in the right place: x"); 
  equal(Math.round(segments[5].y), expectedSegmentY, "segments go in the right place: y"); 

});
