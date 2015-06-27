import { moduleForComponent, test } from "ember-qunit";
import lineChartFixture from "../fixtures/line-chart-fixture";

let component;

moduleForComponent("line-chart", "LineChartComponent", {
  needs: [],
  setup: function() {
    component = this.subject(
      {data: lineChartFixture().small}
    );
    this.render();    
  },
  tearDown: function() {
    //
  }
});

test("it sizes the svg based on div size and margin options", function() {
  var svg = component.$().find("svg");

  ok(svg, "draws the svg");

  var chartDiv = component.$().find(".chart");

  var expectedSvgWidth = chartDiv.width();
  var expectedSvgHeight = component.get("chartDivHeight");

  equal(svg.width(), expectedSvgWidth, "width");
  equal(svg.height(), expectedSvgHeight, "height");
});

test("it draws a line", function() {
  var processedData = lineChartFixture().small.raw;

  var svg = component.$().find("svg");
  var line = svg.find(".line")[0];

  ok(line, "draws the line");

  var segments = _segments(line);

  var expectedSegmentCount = processedData.length;
  equal(segments.length, expectedSegmentCount, "draws the right number of segments");

  var expectedSegmentX = 994;  // fragile, based on fixture and div width/height
  var expectedSegmentY = 12;  // fragile, based on fixture and div width/height

  equal(Math.round(segments[5].x), expectedSegmentX, "segments go in the right place: x"); 
  equal(Math.round(segments[5].y), expectedSegmentY, "segments go in the right place: y"); 
});

test("it draws axes", function() {
  var svg = component.$().find("svg");
  var xAxis = svg.find(".x");
  var yAxis = svg.find(".y");

  ok(xAxis);
  ok(yAxis);
});

test("it writes a chart title", function() {
  var title = component.$().find(".chart-title");

  equal(title.text(), component.get("titleString"));
});

// using other fixtures

test("it updates the chart based on changes in data", function() {
  var svg = component.$().find("svg");

  this.subject().set("data", lineChartFixture().large);

  var largeFixtureSegments = _segments(component.$().find("svg").find(".line")[0]);
  equal(largeFixtureSegments.length, component.get("data").raw.length,
    "updates to a large dataset"
  );

  this.subject().set("data", lineChartFixture().small);

  var smallFixtureSegments = _segments(component.$().find("svg").find(".line")[0]);
  equal(smallFixtureSegments.length, component.get("data").raw.length,
    "updates to a small dataset"
  );
});

function _segments(line) {
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
  return segments;
}
