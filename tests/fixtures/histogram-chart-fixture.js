var fixture = function(){

  return {
    specs: {
      "chartType": "histogram",
      "queryType": "count_unique",
      "queryParams": {
        "eventCollection": "entries",
        "targetProperty": "user_id",
        "groupBy": "n_conditions"
      }
    },
    melted: [0, 1, 1, 2, 3, 3, 4]
  };
};

export default fixture;
