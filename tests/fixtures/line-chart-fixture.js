var fixture = function() {
  return {
    small: {
      specs: {
        "chartType": "line",
        "queryType": "count_unique",
        "queryParams": {
          "eventCollection": "entries",
          "targetProperty": "user_id",
          "timeframe": "this_7_days",
          "interval": "daily"
        }
      },
      raw: [
        {"value":38,"timeframe":{"start":"2015-05-31T04:00:00.000Z","end":"2015-06-01T04:00:00.000Z"}},
        {"value":54,"timeframe":{"start":"2015-06-01T04:00:00.000Z","end":"2015-06-02T04:00:00.000Z"}},
        {"value":49,"timeframe":{"start":"2015-06-02T04:00:00.000Z","end":"2015-06-03T04:00:00.000Z"}},
        {"value":52,"timeframe":{"start":"2015-06-03T04:00:00.000Z","end":"2015-06-04T04:00:00.000Z"}},
        {"value":50,"timeframe":{"start":"2015-06-04T04:00:00.000Z","end":"2015-06-05T04:00:00.000Z"}},
        {"value":51,"timeframe":{"start":"2015-06-05T04:00:00.000Z","end":"2015-06-06T04:00:00.000Z"}},
        {"value":47,"timeframe":{"start":"2015-06-06T04:00:00.000Z","end":"2015-06-07T04:00:00.000Z"}},
      ]
    },
    large: {
      specs: {
        "chartType": "line",
        "queryType": "count_unique",
        "queryParams": {
          "eventCollection": "entries",
          "targetProperty": "user_id",
          "timeframe": "this_14_days",
          "interval": "daily"
        }
      },
      raw: [
        {"value":38,"timeframe":{"start":"2015-05-31T04:00:00.000Z","end":"2015-06-01T04:00:00.000Z"}},
        {"value":54,"timeframe":{"start":"2015-06-01T04:00:00.000Z","end":"2015-06-02T04:00:00.000Z"}},
        {"value":49,"timeframe":{"start":"2015-06-02T04:00:00.000Z","end":"2015-06-03T04:00:00.000Z"}},
        {"value":52,"timeframe":{"start":"2015-06-03T04:00:00.000Z","end":"2015-06-04T04:00:00.000Z"}},
        {"value":50,"timeframe":{"start":"2015-06-04T04:00:00.000Z","end":"2015-06-05T04:00:00.000Z"}},
        {"value":51,"timeframe":{"start":"2015-06-05T04:00:00.000Z","end":"2015-06-06T04:00:00.000Z"}},
        {"value":47,"timeframe":{"start":"2015-06-06T04:00:00.000Z","end":"2015-06-07T04:00:00.000Z"}},
        {"value":33,"timeframe":{"start":"2015-06-07T04:00:00.000Z","end":"2015-06-08T04:00:00.000Z"}},
        {"value":40,"timeframe":{"start":"2015-06-08T04:00:00.000Z","end":"2015-06-09T04:00:00.000Z"}},
        {"value":39,"timeframe":{"start":"2015-06-09T04:00:00.000Z","end":"2015-06-10T04:00:00.000Z"}},
        {"value":34,"timeframe":{"start":"2015-06-10T04:00:00.000Z","end":"2015-06-11T04:00:00.000Z"}},
        {"value":30,"timeframe":{"start":"2015-06-11T04:00:00.000Z","end":"2015-06-12T04:00:00.000Z"}},
        {"value":42,"timeframe":{"start":"2015-06-12T04:00:00.000Z","end":"2015-06-13T04:00:00.000Z"}},
        {"value":11,"timeframe":{"start":"2015-06-13T04:00:00.000Z","end":"2015-06-14T04:00:00.000Z"}}
      ]
    }
  };
};

export default fixture;
