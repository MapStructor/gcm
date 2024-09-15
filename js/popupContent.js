//#region Main Popup Content Generation
// This function dynamically generates popup content based on the given ID and features from the map.
// It identifies the map layer and selects the appropriate content generation function for the popup.

function generatePopupContent(id, features, map) {
  const contentGenerators = {
	[`germany`]: GermanyPopUpContent,
	[`global`]: GlobalPopUpContent,
    [id === "lot_events-bf43eb-right"
      ? "lot_events-bf43eb-right"
      : `lot_events-bf43eb-left`]: lotEventsPopupContent,
    [`global-places`]: globalPlacesEventsPopUpContent,
    [`native-groups-area`]: longIslandPopupContent,
  };

  return contentGenerators[id] ? contentGenerators[id](features) : null;
}

//#endregion

//#region Utility Function
// Retrieves a globally defined function by its name, allowing for dynamic function execution.
// Useful for invoking specific popup content functions based on string identifiers.

function getPopupByName(name) {
  return popupsObject[name];
}
//#endregion

//#region Popup Content Functions
// Each function within this region is responsible for generating the HTML content
// for a different type of map layer popup. Functions are customized for Dutch Grants,
// Lot Events, Castello Events, and Long Island features, providing tailored content for each.

// Generates popup content for Germany, including name and lot details.
function GermanyPopUpContent(features) {
  //console.warn(features);
  let PopUpHTML = "";
  
  PopUpHTML =
      "<div class='infoLayerCurrLotsPopUp'><i>" + features[0].properties.label + "</i></div>";
	  
  return PopUpHTML;
}

// Generates popup content for Global, including name and lot details.
function GlobalPopUpContent(features) {
  //console.warn(features);
  let PopUpHTML = "";
  
  PopUpHTML =
      "<div class='infoLayerDutchGrantsPopUp'><i>" + features[0].properties.label + "</i></div>";
	  
  return PopUpHTML;
}


// Generates popup content for Lot Events, displaying taxlot information with a hyperlink.
function lotEventsPopupContent(features) {
  return (
    "<div class='demoLayerInfoPopUp'><b><h2>Taxlot: <a href='https://encyclopedia.nahc-mapping.org/taxlot/" +
    features[0].properties.TAXLOT +
    "' target='_blank'>" +
    features[0].properties.TAXLOT +
    "</a></h2></b></div>"
  );
}

// Generates popup content for Castello Events, showing taxlot information from 1660.
function globalPlacesEventsPopUpContent(features) {
  return (
    "<div class='infoLayerCastelloPopUp'><i>" +
    features[0].properties.label +
    "</i></div>"
  );
}

// Generates popup content for Long Island, displaying names and handling undefined properties.
function longIslandPopupContent(features) {
  var PopUpHTML = "";
  if (
    typeof taxlot_event_entities_info[features[0].properties.nid] ==
      "undefined" ||
    features[0].properties.nid == ""
  ) {
    PopUpHTML =
      "<div class='infoLayerCastelloPopUp'><b>Name : </b>" +
      features[0].properties.name +
      "</div>";
  } else {
    PopUpHTML =
      "<div class='infoLayerCastelloPopUp'><b>Name : </b>" +
      (taxlot_event_entities_info[features[0].properties.nid].name.length > 0
        ? taxlot_event_entities_info[features[0].properties.nid].name
        : features[0].properties.name) +
      "</div>";
  }
  return PopUpHTML;
}

// #endregion


// #region Popups Initialization
// Initialize popups for displaying information on the maps. These popups are configured to not close on click, indicating they may be used for persistent display of information.

// Function to create a mapboxgl.Popup with common options
function createPopup(offset = 0) {
  return new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
    offset: offset,
  });
}

// Initialize popups for displaying information on the maps
const popupConfig = [
  { name: "MapPopUp", count: undefined },
  { name: "MapPlacesPopUp", count: undefined },
  { name: "HighCastelloPopUp", count: undefined },
  { name: "HighGrantLotsPopUp", count: 5 },
  { name: "MapGrantLotPopUp", count: 5 },
  { name: "HighMapGrantLotPopUp", count: 5 },
  { name: "MapDutchGrantPopUp", count: 5 },
  { name: "MapNativeGroupsPopUp", count: 5 },
  { name: "HighMapNativeGroupsPopUp", count: 5 },
];

const createPopups = () => {
  const popupsObj = {};
  popupConfig.forEach((config) => {
    popupsObj[`after${config.name}`] = createPopup(config.count);
    popupsObj[`before${config.name}`] = createPopup(config.count);
  });
  return popupsObj;
};

const popupsObject = createPopups();

// #endregion

// #region Hovered and Clicked State Management
// Variables to manage the state of hovered and clicked map features. These are used to track which features are currently under interaction, allowing for dynamic updates to the UI or map based on user actions.

var clickedStateId = null;

var demo_layer_feature_props = null,
  demo_layer_features = null,
  demo_layer_taxlot = "";
// #endregion

// #region Event Handling and Popups
// Functions to handle click events on map features and display popups with detailed information.
[beforeMap, afterMap].forEach((map, id) => {
  if (id === 0) {
    init_zoom = map.getZoom();
    init_bearing = map.getBearing();
    init_center = map.getCenter();
  }
  map.on("load", function (e) {
    map
      .on(
        "click",
        `lot_events-bf43eb${id === 0 ? "-left" : "-right"}`,
        function (e) {
          console.log(e.features[0].properties)
          DemoClickHandle(e);
        }
      )
      .on("click", `global-places`, function (e) {
          console.log(e.features[0].properties)
          GlobalPlacesClickHandle(e);
      })
      //.on("click", `dutch_grants-5ehfqe`, function (e) {
	  .on("click", `germany`, function (e) {
          console.log(e.features[0].properties)
          GermanyClickHandle(e);
      })
	  .on("click", `global`, function (e) {
          console.log(e.features[0].properties)
          GlobalClickHandle(e);
      })
      .on("click", `native-groups-area`, function (e) {
          console.log(e.features[0].properties)
          NativeGroupsClickHandle(e);
      })
      .on("click", function () {
        DefaultHandle();
      });
  });

  map.on("error", console.log);
});

// #endregion

//#region Utility Handlers

function DefaultHandle() {
  if (
    !demo_taxlot_click_ev &&
    !global_labels_click_ev &&
    !germany_click_ev &&
	!global_click_ev 
  ) {
    if (windoWidth > 637)
      if ($("#view-hide-layer-panel").length > 0)
        $("#view-hide-layer-panel").trigger("click");
  }

  demo_taxlot_click_ev = false;
  global_labels_click_ev = false;
  germany_click_ev = false;
  global_click_ev = false;
}

//#endregion

//#region Close Info and ClickHandle Functions

function closeGlobalPlacesInfo() {
  $("#infoLayerCastello").slideUp();
  global_labels_view_flag = false;
  ["after", "before"].forEach((position) => {
    if (popupsObject[`${position}HighCastelloPopUp`].isOpen())
      popupsObject[`${position}HighCastelloPopUp`].remove();
  });
}

function GlobalPlacesClickHandle(event) {
	
   var highPopUpHTML = "<div class='infoLayerCastelloPopUp'><b>" + event.features[0].properties.label + "</b></div>";
	
  if (global_labels_view_flag && clickedStateId == event.features[0].id) {
    if ($("#view-hide-layer-panel").length > 0)
      if (!layer_view_flag) {
        $("#rightInfoBar").css("display", "block");
        setTimeout(function () {
          $("#rightInfoBar").slideUp();
        }, 500);
      }

    closeGlobalPlacesInfo();
  } else {
    clickedStateId = event.features[0].id;
    var coordinates = [];
    coordinates = event.features[0].geometry.coordinates.slice();

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(event.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += event.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    // console.log("setting html for popup")
    ["before", "after"].forEach((position) => {
      popupsObject[`${position}HighCastelloPopUp`]
        .setLngLat(coordinates)
        .setHTML(highPopUpHTML);

      if (!popupsObject[`${position}HighCastelloPopUp`].isOpen())
        popupsObject[`${position}HighCastelloPopUp`].addTo(
          position === "before" ? beforeMap : afterMap
        );
    });



    if ($(".infoLayerElem").first().attr("id") != "infoLayerCastello")
      $("#infoLayerCastello").insertBefore($(".infoLayerElem").first());
    $("#infoLayerCastello")
      .html(buildPopUpInfo(event.features[0].properties, "#infoLayerCastello", "labels"));
	  
     $("#infoLayerCastello").slideDown();

    if (!layer_view_flag)
      if ($("#view-hide-layer-panel").length > 0)
        $("#view-hide-layer-panel").trigger("click");
    //}
    global_labels_view_flag = true;
  }
  global_labels_click_ev = true;
}

function closeDemoInfo() {
  $("#demoLayerInfo").slideUp();
  demo_layer_view_flag = false;
  if (afterHighDemoPopUp.isOpen()) afterHighDemoPopUp.remove();
  if (beforeHighDemoPopUp.isOpen()) beforeHighDemoPopUp.remove();
}

function DemoClickHandle(event) {
  if (demo_layer_view_flag) {
    if ($("#view-hide-layer-panel").length > 0)
      if (!layer_view_flag) {
        $("#rightInfoBar").css("display", "block");
        setTimeout(function () {
          $("#rightInfoBar").slideUp();
        }, 500);
      }

    closeDemoInfo();
  } else {
    demo_layer_taxlot = event.features[0].properties.TAXLOT;

    demoFilterRangeCalc();
    buildPopUpInfo(event.features[0].properties, "#demoLayerInfo");
    if ($(".infoLayerElem").first().attr("id") != "demoLayerInfo")
      $("#demoLayerInfo").insertBefore($(".infoLayerElem").first());
    $("#demoLayerInfo").slideDown();

    if (!layer_view_flag)
      if ($("#view-hide-layer-panel").length > 0)
        $("#view-hide-layer-panel").trigger("click");

    demo_layer_view_flag = true;

    var coordinates = [];
    coordinates = event.features[0].geometry.coordinates.slice();

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(event.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += event.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    beforeHighDemoPopUp
      .setLngLat(coordinates)
      .setHTML(
        "<div class='demoLayerInfoPopUp'><b><h2>Taxlot: <a href='https://encyclopedia.nahc-mapping.org/taxlot/" +
          demo_layer_taxlot +
          "' target='_blank'>" +
          demo_layer_taxlot +
          "</a></h2></b></div>"
      );
    if (!beforeHighDemoPopUp.isOpen()) beforeHighDemoPopUp.addTo(beforeMap);

    afterHighDemoPopUp
      .setLngLat(coordinates)
      .setHTML(
        "<div class='demoLayerInfoPopUp'><b><h2>Taxlot: <a href='https://encyclopedia.nahc-mapping.org/taxlot/" +
          demo_layer_taxlot +
          "' target='_blank'>" +
          demo_layer_taxlot +
          "</a></h2></b></div>"
      );
    if (!afterHighDemoPopUp.isOpen()) afterHighDemoPopUp.addTo(afterMap);
  }
  demo_taxlot_click_ev = true;
}

function closeGermanyInfo() {
  $("#infoLayerCurrLots").slideUp();
  germany_layer_view_flag = false;
  afterMap.setFeatureState(
    {
      source: "germany-highlighted",
      sourceLayer: "geacron_shps_testing-89qva4",
      id: german_layer_view_id,
    },
    { hover: false }
  );
  beforeMap.setFeatureState(
    {
      source: "germany-highlighted",
      sourceLayer: "geacron_shps_testing-89qva4",
      id: german_layer_view_id,
    },
    { hover: false }
  );
  ["before", "after"].forEach((position) => {
    if (popupsObject[`${position}HighMapGrantLotPopUp`].isOpen())
      popupsObject[`${position}HighMapGrantLotPopUp`].remove();
  });
}

function GermanyClickHandle(event) {
  
  console.log(event.features[0].id);
  // dutch_grant_lots_info[event.features[0].properties.Lot]
  
  var highPopUpHTML = "<div class='infoLayerCurrLotsPopUp'><b>" + event.features[0].properties.label + "</b></div>";


  if (german_layer_view_id == event.features[0].id) {
    if (germany_layer_view_flag) {
      if ($("#view-hide-layer-panel").length > 0)
        if (!layer_view_flag) {
          $("#rightInfoBar").css("display", "block");
          setTimeout(function () {
            $("#rightInfoBar").slideUp();
          }, 500);
        }

      closeGermanyInfo();
    } else {
      buildPopUpInfo(event.features[0].properties, "#infoLayerCurrLots","germany");
      if ($(".infoLayerElem").first().attr("id") != "infoLayerCurrLots")
        $("#infoLayerCurrLots").insertBefore($(".infoLayerElem").first());
      $("#infoLayerCurrLots").slideDown();
      if ($("#view-hide-layer-panel").length > 0)
        if (!layer_view_flag) $("#view-hide-layer-panel").trigger("click");
      germany_layer_view_flag = true;
      afterMap.setFeatureState(
        {
          source: "germany-highlighted",
          sourceLayer: "geacron_shps_testing-89qva4",
          id: german_layer_view_id,
        },
        { hover: true }
      );
      beforeMap.setFeatureState(
        {
          source: "germany-highlighted",
          sourceLayer: "geacron_shps_testing-89qva4",
          id: german_layer_view_id,
        },
        { hover: true }
      );
      ["after", "before"].forEach((position) => {
        const map = position === "after" ? afterMap : beforeMap;
        popupsObject[`${position}HighMapGrantLotPopUp`]
          .setLngLat(event.lngLat)
          .setHTML(highPopUpHTML);
        if (!popupsObject[`${position}HighMapGrantLotPopUp`].isOpen())
          popupsObject[`${position}HighMapGrantLotPopUp`].addTo(map);
      });
    }
  } else {
    buildPopUpInfo(event.features[0].properties, "#infoLayerCurrLots","germany");
    if ($(".infoLayerElem").first().attr("id") != "infoLayerCurrLots")
      $("#infoLayerCurrLots").insertBefore($(".infoLayerElem").first());
    $("#infoLayerCurrLots").slideDown();
    if ($("#view-hide-layer-panel").length > 0)
      if (!layer_view_flag) $("#view-hide-layer-panel").trigger("click");
    germany_layer_view_flag = true;
    //*A#
    afterMap.setFeatureState(
      {
        source: "germany-highlighted",
        sourceLayer: "geacron_shps_testing-89qva4",
        id: german_layer_view_id,
      },
      { hover: false }
    );
    afterMap.setFeatureState(
      {
        source: "germany-highlighted",
        sourceLayer: "geacron_shps_testing-89qva4",
        id: event.features[0].id,
      },
      { hover: true }
    );
    beforeMap.setFeatureState(
      {
        source: "germany-highlighted",
        sourceLayer: "geacron_shps_testing-89qva4",
        id: german_layer_view_id,
      },
      { hover: false }
    );
    beforeMap.setFeatureState(
      {
        source: "germany-highlighted",
        sourceLayer: "geacron_shps_testing-89qva4",
        id: event.features[0].id,
      },
      { hover: true }
    );
    ["after", "before"].forEach((position) => {
      const map = position === "after" ? afterMap : beforeMap;
      popupsObject[`${position}HighMapGrantLotPopUp`]
        .setLngLat(event.lngLat)
        .setHTML(highPopUpHTML);
      if (!popupsObject[`${position}HighMapGrantLotPopUp`].isOpen())
        popupsObject[`${position}HighMapGrantLotPopUp`].addTo(map);
    });
  }
  german_layer_view_id = event.features[0].id;
  germany_click_ev = true;
}


function closeGlobalInfo() {
  $("#infoLayerDutchGrants").slideUp();
  global_layer_view_flag = false;
  afterMap.setFeatureState(
    {
      source: "global-highlighted",
      sourceLayer: "geacron_mapbox",
      id: global_layer_view_id,
    },
    { hover: false }
  );
  beforeMap.setFeatureState(
    {
      source: "global-highlighted",
      sourceLayer: "geacron_mapbox",
      id: global_layer_view_id,
    },
    { hover: false }
  );
  ["before", "after"].forEach((position) => {
    if (popupsObject[`${position}HighMapGrantLotPopUp`].isOpen())
      popupsObject[`${position}HighMapGrantLotPopUp`].remove();
  });
}


function GlobalClickHandle(event) {
  
  console.log(event.features[0].id);
  // dutch_grant_lots_info[event.features[0].properties.Lot]
  
  var highPopUpHTML = "<div class='infoLayerDutchGrantsPopUp'><b>" + event.features[0].properties.label + "</b></div>";


  if (global_layer_view_id == event.features[0].id) {
    if (global_layer_view_flag) {
      if ($("#view-hide-layer-panel").length > 0)
        if (!layer_view_flag) {
          $("#rightInfoBar").css("display", "block");
          setTimeout(function () {
            $("#rightInfoBar").slideUp();
          }, 500);
        }

      closeGlobalInfo();
    } else {
      buildPopUpInfo(event.features[0].properties, "#infoLayerDutchGrants","global");
      if ($(".infoLayerElem").first().attr("id") != "infoLayerDutchGrants")
        $("#infoLayerDutchGrants").insertBefore($(".infoLayerElem").first());
      $("#infoLayerDutchGrants").slideDown();
      if ($("#view-hide-layer-panel").length > 0)
        if (!layer_view_flag) $("#view-hide-layer-panel").trigger("click");
      global_layer_view_flag = true;
      afterMap.setFeatureState(
        {
          source: "global-highlighted",
          sourceLayer: "geacron_mapbox",
          id: global_layer_view_id,
        },
        { hover: true }
      );
      beforeMap.setFeatureState(
        {
          source: "global-highlighted",
          sourceLayer: "geacron_mapbox",
          id: global_layer_view_id,
        },
        { hover: true }
      );
      ["after", "before"].forEach((position) => {
        const map = position === "after" ? afterMap : beforeMap;
        popupsObject[`${position}HighMapGrantLotPopUp`]
          .setLngLat(event.lngLat)
          .setHTML(highPopUpHTML);
        if (!popupsObject[`${position}HighMapGrantLotPopUp`].isOpen())
          popupsObject[`${position}HighMapGrantLotPopUp`].addTo(map);
      });
    }
  } else {
    buildPopUpInfo(event.features[0].properties, "#infoLayerDutchGrants","global");
    if ($(".infoLayerElem").first().attr("id") != "infoLayerDutchGrants")
      $("#infoLayerDutchGrants").insertBefore($(".infoLayerElem").first());
    $("#infoLayerDutchGrants").slideDown();
    if ($("#view-hide-layer-panel").length > 0)
      if (!layer_view_flag) $("#view-hide-layer-panel").trigger("click");
    global_layer_view_flag = true;
    //*A#
    afterMap.setFeatureState(
      {
        source: "global-highlighted",
        sourceLayer: "geacron_mapbox",
        id: global_layer_view_id,
      },
      { hover: false }
    );
    afterMap.setFeatureState(
      {
        source: "global-highlighted",
        sourceLayer: "geacron_mapbox",
        id: event.features[0].id,
      },
      { hover: true }
    );
    beforeMap.setFeatureState(
      {
        source: "global-highlighted",
        sourceLayer: "geacron_mapbox",
        id: global_layer_view_id,
      },
      { hover: false }
    );
    beforeMap.setFeatureState(
      {
        source: "global-highlighted",
        sourceLayer: "geacron_mapbox",
        id: event.features[0].id,
      },
      { hover: true }
    );
    ["after", "before"].forEach((position) => {
      const map = position === "after" ? afterMap : beforeMap;
      popupsObject[`${position}HighMapGrantLotPopUp`]
        .setLngLat(event.lngLat)
        .setHTML(highPopUpHTML);
      if (!popupsObject[`${position}HighMapGrantLotPopUp`].isOpen())
        popupsObject[`${position}HighMapGrantLotPopUp`].addTo(map);
    });
  }
  global_layer_view_id = event.features[0].id;
  global_click_ev = true;
}

function closeNativeGroupsInfo() {
  $("#infoLayerNativeGroups").slideUp();
  native_group_layer_view_flag = false;
  afterMap.setFeatureState(
    {
      source: "native-groups-area-highlighted",
      sourceLayer: "indian_areas_long_island-50h2dj",
      id: native_group_layer_view_id,
    },
    { hover: false }
  );
  beforeMap.setFeatureState(
    {
      source: "native-groups-area-highlighted",
      sourceLayer: "indian_areas_long_island-50h2dj",
      id: native_group_layer_view_id,
    },
    { hover: false }
  );
  ["after", "before"].forEach((position) => {
    if (popupsObject[`${position}HighMapNativeGroupsPopUp`].isOpen())
      popupsObject[`${position}HighMapNativeGroupsPopUp`].remove();
  });
}

function NativeGroupsClickHandle(event) {
  var highPopUpHTML = "";

  if (
    typeof taxlot_event_entities_info[event.features[0].properties.nid] ==
      "undefined" ||
    event.features[0].properties.nid == ""
  ) {
    highPopUpHTML =
      "<div class='infoLayerCastelloPopUp'><b>Name : </b>" +
      event.features[0].properties.name +
      "</div>";
  } else {
    highPopUpHTML =
      "<div class='infoLayerCastelloPopUp'><b>Name : </b>" +
      (taxlot_event_entities_info[event.features[0].properties.nid].name
        .length > 0
        ? taxlot_event_entities_info[event.features[0].properties.nid].name
        : event.features[0].properties.name) +
      "</div>";
  }

  if (native_group_layer_view_id == event.features[0].id) {
    if (native_group_layer_view_flag) {
      if ($("#view-hide-layer-panel").length > 0)
        if (!layer_view_flag) {
          $("#rightInfoBar").css("display", "block");
          setTimeout(function () {
            $("#rightInfoBar").slideUp();
          }, 500);
        }

      closeNativeGroupsInfo();
    } else {
      buildPopUpInfo(event.features[0].properties, "#infoLayerNativeGroups");
      if ($(".infoLayerElem").first().attr("id") != "infoLayerNativeGroups")
        $("#infoLayerNativeGroups").insertBefore($(".infoLayerElem").first());
      $("#infoLayerNativeGroups").slideDown();
      if ($("#view-hide-layer-panel").length > 0)
        if (!layer_view_flag) $("#view-hide-layer-panel").trigger("click");
      native_group_layer_view_flag = true;
      afterMap.setFeatureState(
        {
          source: "native-groups-area-highlighted",
          sourceLayer: "indian_areas_long_island-50h2dj",
          id: native_group_layer_view_id,
        },
        { hover: true }
      );
      beforeMap.setFeatureState(
        {
          source: "native-groups-area-highlighted",
          sourceLayer: "indian_areas_long_island-50h2dj",
          id: native_group_layer_view_id,
        },
        { hover: true }
      );
      ["after", "before"].forEach((position) => {
        const map = position === "after" ? afterMap : beforeMap;
        popupsObject[`${position}HighMapNativeGroupsPopUp`]
          .setLngLat(event.lngLat)
          .setHTML(highPopUpHTML);
        if (!popupsObject[`${position}HighMapNativeGroupsPopUp`].isOpen())
          popupsObject[`${position}HighMapNativeGroupsPopUp`].addTo(map);
      });
    }
  } else {
    buildPopUpInfo(event.features[0].properties, "#infoLayerNativeGroups");
    if ($(".infoLayerElem").first().attr("id") != "infoLayerNativeGroups")
      $("#infoLayerNativeGroups").insertBefore($(".infoLayerElem").first());
    $("#infoLayerNativeGroups").slideDown();
    if ($("#view-hide-layer-panel").length > 0)
      if (!layer_view_flag) $("#view-hide-layer-panel").trigger("click");
    native_group_layer_view_flag = true;
    afterMap.setFeatureState(
      {
        source: "native-groups-area-highlighted",
        sourceLayer: "indian_areas_long_island-50h2dj",
        id: native_group_layer_view_id,
      },
      { hover: false }
    );
    afterMap.setFeatureState(
      {
        source: "native-groups-area-highlighted",
        sourceLayer: "indian_areas_long_island-50h2dj",
        id: event.features[0].id,
      },
      { hover: true }
    );
    beforeMap.setFeatureState(
      {
        source: "native-groups-area-highlighted",
        sourceLayer: "indian_areas_long_island-50h2dj",
        id: native_group_layer_view_id,
      },
      { hover: false }
    );
    beforeMap.setFeatureState(
      {
        source: "native-groups-area-highlighted",
        sourceLayer: "indian_areas_long_island-50h2dj",
        id: event.features[0].id,
      },
      { hover: true }
    );
    ["after", "before"].forEach((position) => {
      const map = position === "after" ? afterMap : beforeMap;
      popupsObject[`${position}HighMapNativeGroupsPopUp`]
        .setLngLat(event.lngLat)
        .setHTML(highPopUpHTML);
      if (!popupsObject[`${position}HighMapNativeGroupsPopUp`].isOpen())
        popupsObject[`${position}HighMapNativeGroupsPopUp`].addTo(map);
    });
  }
  native_group_layer_view_id = event.features[0].id;
  native_groups_click_ev = true;
}

function closeGrantLotsInfo() {
  $("#infoLayerGrantLots").slideUp();
  grant_lots_view_flag = false;
  ["after", "before"].forEach((position) => {
    if (popupsObject[`${position}HighGrantLotsPopUp`].isOpen())
      popupsObject[`${position}HighGrantLotsPopUp`].remove();
  });
}

// #endregion
