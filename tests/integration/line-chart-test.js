import { moduleForComponent, test } from 'ember-qunit';
import lineChartFixture from '../fixtures/line-chart-fixture';


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

// test("it draws an svg", function() {
//   var component = this.subject();
//   this.render();

//   ok(component.$().find("svg"));
// });

// test("it sizes the svg based on div size and margin options", function() {
//   var component = this.subject();
//   this.render();

//   var svg = component.$().find("svg");

//   var chartDiv = component.$().find(".chart");
//   var margin = component.get("margin")(
//     component.get("xAxisRoom"),
//     component.get("yAxisRoom")
//   );
//   var expectedSvgWidth = chartDiv.width() - margin.right;
//   var expectedSvgHeight = component.get("chartDivHeight");

//   equal(svg.width(), expectedSvgWidth, "width");
//   equal(svg.height(), expectedSvgHeight, "height");
// });
