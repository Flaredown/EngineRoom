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
      melted: [0, 1, 1, 3, 3, 4]
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
      melted: [0, 1, 1, 2, 3, 3, 4, 45, 90]
    },    
  };
};

export default fixture;
