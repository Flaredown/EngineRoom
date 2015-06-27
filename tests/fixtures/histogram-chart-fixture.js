var fixture = function(){

  return {
    small: {
      specs: {
        "chartType": "histogram",
        "queryType": "count_unique",
        "queryParams": {
          "eventCollection": "entries",
          "targetProperty": "user_id",
          "groupBy": "n_conditions"
        }
      },
      raw: [
        {
          "value": [{"n_conditions": 0, result: 1}, {"n_conditions": 1, result: 2}, {"n_conditions": 2, result: 0}, {"n_conditions": 3, result: 2}, {"n_conditions": 4, result: 1}],
          "timeframe": {"start": "2015-05-31T04:00:00.000Z", "end": "2015-06-01T04:00:00.000Z"}
        },
        {
          "value": [{"n_conditions": 0, result: 2}, {"n_conditions": 1, result: 1}, {"n_conditions": 2, result: 0}, {"n_conditions": 3, result: 1}, {"n_conditions": 4, result: 3}],
          "timeframe": {"start": "2015-06-01T04:00:00.000Z", "end": "2015-06-02T04:00:00.000Z"}
        }
      ]
    },
    large: {
      specs: {
        "chartType": "histogram",
        "queryType": "count_unique",
        "queryParams": {
          "eventCollection": "entries",
          "targetProperty": "user_id",
          "groupBy": "n_conditions"
        }
      },
      raw: [
        {
          "value": [{"n_conditions": 0, result: 1}, {"n_conditions": 1, result: 2}, {"n_conditions": 2, result: 0}, {"n_conditions": 3, result: 2}, {"n_conditions": 4, result: 1}, {"n_conditions": 45, result: 1}, {"n_conditions": 90, result: 1}],
          "timeframe": {"start": "2015-05-31T04:00:00.000Z", "end": "2015-06-01T04:00:00.000Z"}
        },
        {
          "value": [{"n_conditions": 0, result: 2}, {"n_conditions": 1, result: 1}, {"n_conditions": 2, result: 0}, {"n_conditions": 3, result: 1}, {"n_conditions": 4, result: 3}, {"n_conditions": 45, result: 1}, {"n_conditions": 90, result: 1}],
          "timeframe": {"start": "2015-06-01T04:00:00.000Z", "end": "2015-06-02T04:00:00.000Z"}
        }
      ]      
    },    
  };
};

export default fixture;
