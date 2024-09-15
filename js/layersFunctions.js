function setupLayerEvents(map, layers) {
  layers.forEach((layer) => {
    if (layer.type === "raster") {
      // Skip setting up event listeners for raster layers
      return;
    }

    let hoveredId = null;

    console.log(layer.id);

    if (layer.id == "global") {
      setTimeout(function () {
        $("#global_layer_items").prop("disabled", false);
        $(".global_layer").prop("disabled", false);
      }, 750);
    }

    if (layer.id == "global-places") {
      setTimeout(function () {
        $("#global_labels_items").prop("disabled", false);
        $(".global-labels").prop("disabled", false);
      }, 250);
    }

    map.on("mouseenter", layer.id, (e) => {
      const popup = getPopupByName(layer.popup);
      if (popup) {
        popup.setLngLat(e.lngLat).addTo(map);
      }
    });

    map.on(
      layer.id === "global-places" ? "mouseenter" : "mousemove",
      layer.id,
      (e) => {
        map.getCanvas().style.cursor = "pointer";

        if (e.features.length > 0) {
          if (hoveredId) {
            map.setFeatureState(
              { source: layer.id, id: hoveredId, sourceLayer: layer.sourceId },
              { hover: false }
            );
          }

          hoveredId = e.features[0].id;

          map.setFeatureState(
            { source: layer.id, id: hoveredId, sourceLayer: layer.sourceId },
            { hover: true }
          );

          if (layer.id === "global-places") {
            var coordinates = e.features[0].geometry.coordinates.slice();

            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            getPopupByName(layer.popup)
              .setLngLat(coordinates)
              .setHTML(generatePopupContent(layer.id, e.features, map))
              .addTo(map);
          } else {
            const popup = getPopupByName(layer.popup);
            if (popup) {
              const content = generatePopupContent(layer.id, e.features, map);
              popup.setLngLat(e.lngLat).setHTML(content);
            }
          }
        }
      }
    );

    map.on("mouseleave", layer.id, () => {
      map.getCanvas().style.cursor = "";

      if (hoveredId) {
        map.setFeatureState(
          { source: layer.id, id: hoveredId, sourceLayer: layer.sourceId },
          { hover: false }
        );
        hoveredId = null;
      }

      const popup = getPopupByName(layer.popup);
      if (popup && popup.isOpen()) {
        popup.remove();
      }
    });
  });
}

function addMapLayers(map, layers, date) {
  layers.forEach((layer) => {
    if (map === beforeMap || map === afterMap) {
      if (layer.type === "raster") {
        map.addLayer({
          id: layer.id,
          type: "raster",
          source: layer.sourceId,
          paint: layer.paint || {},
        });
      } else {
        addMapLayer(map, getLayer(layer.id), date);
      }
    }
  });
}

function addAllLayers(yr, date) {
  ["", ""].forEach((position, index) => {
    const map = index === 0 ? beforeMap : afterMap;
    const popupMap = index === 0 ? "beforeMap" : "afterMap";

    removeMapSourceLayer(map, [
      { type: "layer", id: `germany` },
      { type: "source", id: "geacron_shps_testing-89qva4" },
      { type: "layer", id: `germany-lines` },
      { type: "source", id: "geacron_shps_testing-89qva4" },
    ]);

    addMapLayers(
      map,
      [
        { id: `germany-highlighted` },
        { id: `germany` },
        { id: `germany-lines` },
        { id: `global-highlighted` },
        { id: `global` },
        { id: `global-lines` },
        { id: `global-places` },
        { id: `global-labels` },
        { id: "wms-test-layer" }, // Add raster layer here
      ],
      date
    );

    setupLayerEvents(map, [
      {
        id: `germany`,
        popup: `${popupMap}DutchGrantPopUp`,
        sourceId: "geacron_shps_testing-89qva4",
      },
      {
        id: `global`,
        popup: `${popupMap}DutchGrantPopUp`,
        sourceId: "geacron_mapbox",
      },
      {
        id: "wms-test-layer", // No event setup for raster layers
        sourceId: "wms-test-source",
      },
    ]);
  });
}
