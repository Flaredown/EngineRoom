import { moduleFor, test } from "ember-qunit";
import HistogramMixin from "../../mixins/histogram";

moduleFor("mixin:histogram", "HistogramMixin");

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

test("grouped data is processed by melting", function() {
  var DummyObject = Ember.Object.extend(HistogramMixin);
  var subject = DummyObject.create();
  var data = {
    result: [
      {
        groupBy: 0,
        result: 5
      },
      {
        groupBy: 1,
        result: 2
      },
      {
        groupBy: 2,
        result: 1
      }
    ]
  };
  var processedData = subject.get("processHistogram")(data, "groupBy");

  var expectedResult = [0, 0, 0, 0, 0, 1, 1, 2];

  ok(arraysEqual(processedData.sort(), expectedResult.sort()));
});
