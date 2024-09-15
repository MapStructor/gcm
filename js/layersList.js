const layers = [
  {
    //ID: CHANGE THIS, 1 OF 3
    id: "germany-highlighted",
    type: "fill",
    source: {
      type: "vector",
      //URL: CHANGE THIS, 2 OF 3
      //url: "mapbox://mapny.18d146m2",
      url: "mapbox://mapny.6b7q1m9x",
    },
    layout: {
      visibility: document.getElementById("german_layer").checked
        ? "visible"
        : "none",
    },
    //"source-layer": "output",
    "source-layer": "geacron_shps_testing-89qva4",
    paint: {
      "fill-color": "#7b68ee",
      "fill-opacity": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        0.7,
        0,
      ],
      "fill-outline-color": "#000080",
    },
    toggleElement: "german_layer",
  },
  {
    //ID: CHANGE THIS, 1 OF 3
    id: "germany",
    type: "fill",
    source: {
      type: "vector",
      //URL: CHANGE THIS, 2 OF 3
      //url: "mapbox://mapny.18d146m2",
      url: "mapbox://mapny.6b7q1m9x",
    },
    layout: {
      visibility: document.getElementById("german_layer").checked
        ? "visible"
        : "none",
    },
    //"source-layer": "output",
    "source-layer": "geacron_shps_testing-89qva4",
    paint: {
      "fill-color": "#7b68ee",
      "fill-opacity": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        0.8,
        0.45,
      ],
      "fill-outline-color": "#000080",
    },
  },
  {
    id: "germany-lines",
    type: "line",
    source: {
      type: "vector",
      url: "mapbox://mapny.6b7q1m9x",
    },
    layout: {
      visibility: document.getElementById("german_layer_lines").checked
        ? "visible"
        : "none",
    },
    "source-layer": "geacron_shps_testing-89qva4",
    paint: {
      "line-color": "#000080",
      "line-width": 3,
      "line-opacity": 0.8,
    },
  },
  {
    //ID: CHANGE THIS, 1 OF 3
    id: "global-highlighted",
    type: "fill",
    source: {
      type: "vector",
      //URL: CHANGE THIS, 2 OF 3
      //url: "mapbox://mapny.18d146m2",
      url: "mapbox://mapny.c9zt9yge",
    },
    layout: {
      visibility: document.getElementById("global_layer").checked
        ? "visible"
        : "none",
    },
    //"source-layer": "output",
    "source-layer": "geacron_mapbox",
    paint: {
      "fill-color": "#e3ed58",
      "fill-opacity": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        0.7,
        0,
      ],
      "fill-outline-color": "#FF0000",
    },
    toggleElement: "global_layer",
  },
  {
    // Main layer for global map with random colors
    id: "global",
    type: "fill",
    source: {
      type: "vector",
      url: "mapbox://mapny.c9zt9yge",
    },
    layout: {
      visibility: document.getElementById("global_layer").checked
        ? "visible"
        : "none",
    },
    "source-layer": "geacron_mapbox",
    paint: {
      "fill-color": [
        "match",
        ["get", "color_id2"],
        ...Array.from({ length: 400 }, (_, i) => {
          const letters = "0123456789ABCDEF";
          let color = "#";
          for (let j = 0; j < 6; j++) {
            color += letters[Math.floor(Math.random() * 16)];
          }
          return [i + 1, color];
        }).flat(),
        "#000000", // Default color if no match is found
      ],
      "fill-opacity": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        0.8,
        0.45,
      ],
      "fill-outline-color": "#FF0000",
    },
  },
  {
    id: "global-lines",
    type: "line",
    source: {
      type: "vector",
      //url: "mapbox://mapny.7l9apcrc",
      url: "mapbox://mapny.13m8gl2d",
    },
    layout: {
      visibility: document.getElementById("global_layer_lines").checked
        ? "visible"
        : "none",
    },
    //"source-layer": "1920-2010_geacron_reprojected-956e43",
    "source-layer": "geacron_borders",
    paint: {
      "line-color": "#FF0000",
      "line-width": 3,
      "line-opacity": 0.8,
    },
  },
  /*
  {
    id: "global-places",
    type: "circle",
    source: {
      type: "vector",
      url: "mapbox://mapny.91p8c56l",
    },
    layout: {
      visibility: document.getElementById("global_labels_points").checked
        ? "visible"
        : "none",
    },
    "source-layer": "geacron_labels-01fr13",
    paint: {
      "circle-color": "#FF0000",
      "circle-opacity": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        0.5,
        1,
      ],
      "circle-stroke-width": 2,
      "circle-stroke-color": "#FF0000",
      "circle-stroke-opacity": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        1,
        0,
      ],
    },
  },
  */
  {
    id: "global-labels",
    type: "symbol",
    source: {
      type: "vector",
      url: "mapbox://mapny.91p8c56l",
    },
    layout: {
      visibility: document.getElementById("global_labels").checked
        ? "visible"
        : "none",
      "text-field": "{label}",
      //"text-offset": [0, 2],
      "text-size": [
        "interpolate",
        ["linear"],
        ["zoom"],
        2.18,
        11,
        3.18,
        12,
        5.18,
        14,
        6.18,
        16,
      ],
    },
    "source-layer": "geacron_labels-01fr13",
    paint: {
      "text-color": "#000080",
      "text-halo-color": "#ffffff",

      "text-halo-width": [
        "interpolate",
        ["linear"],
        ["zoom"],
        1,
        1,
        2.18,
        2,
        6.18,
        3,
      ],
      "text-halo-width": 5,
      "text-halo-blur": 1,
      "text-opacity": {
        stops: [
          [1, 0],
          [2, 1],
        ],
      },
    },
  },
  {
    // New raster WMS layer
    id: "wms-test-layer",
    type: "raster",
    source: {
      type: "raster",
      tiles: [
        //"https://66.175.239.115/geoserver/HSR_Raster/wms?service=WMS&version=1.1.0&request=GetMap&layers=mappingNY%3AHSR&bbox={bbox-epsg-3857}&width=768&height=481&srs=EPSG%3A3857&styles=&format=image/png&transparent=true",
        "https://dreamy-darwin.66-175-239-115.plesk.page/geoserver/HSR_Raster/wms?service=WMS&version=1.1.0&request=GetMap&layers=mappingNY%3AHSR&bbox={bbox-epsg-3857}&width=768&height=481&srs=EPSG%3A3857&styles=&format=image/png&transparent=true",
      ],
      tileSize: 256,
    },
    layout: {
      visibility: "visible",
    },
    paint: {},
  },
];
