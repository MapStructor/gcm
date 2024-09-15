//TIME LAYER FILTERING

function changeDate(unixDate) {
  var date = parseInt(moment.unix(unixDate).format("YYYYMMDD"));
  var dateFilter = ["all", ["<=", "DayStart", date], [">=", "DayEnd", date]];

  //LAYERS FOR FILTERING
  ["germany-highlighted", "germany-lines", "germany", "global-highlighted", "global-lines", "global", "global-places", "global-labels"].forEach(id => {
    beforeMap.setFilter(id, dateFilter)
    afterMap.setFilter(id, dateFilter)
  })

  /*
  beforeMap.setFilter("lot_events-bf43eb-left", dateFilter);
  afterMap.setFilter("lot_events-bf43eb-right", dateFilter);
  */
  
  demoFilterRangeCalc();
} //end function changeDate
