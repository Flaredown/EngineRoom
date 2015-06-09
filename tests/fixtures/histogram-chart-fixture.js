var fixture = function(){

  return {
    raw: [
      {
        groupBy: 0,
        result: 1
      },
      {
        groupBy: 1,
        result: 2
      },
      {
        groupBy: 2,
        result: 1
      },     
      {
        groupBy: 3,
        result: 2
      },
      {
        groupBy: 4,
        result: 1
      },                
    ],
    melted: [0, 1, 1, 2, 3, 3, 4]
  };
};

export default fixture;
