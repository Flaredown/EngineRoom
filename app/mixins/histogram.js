import Ember from "ember";

function fillArray(value, len) {
  var arr = [];
  for (var i = 0; i < len; i++) {
    arr.push(value);
  }
  return arr;
}

function melt(data, groupBy) {
  var melted = [];

  for (var i = data.result.length - 1; i >= 0; i--) {
    var x = data.result[i];

    if (x[groupBy] === null) {
      melted = melted.concat(fillArray(0, x.result));
    } else {
      melted = melted.concat(fillArray(x[groupBy], x.result));
    }
  }

  return melted;
}

export default Ember.Mixin.create({

  processData: function(query, groupBy) {
    return melt(query, groupBy);
  }

});
