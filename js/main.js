require([
    "esri/portal/Portal",
    "esri/identity/OAuthInfo",
    "esri/identity/IdentityManager",
    "esri/portal/PortalQueryParams",
    "esri/views/SceneView",
    "esri/Map",
    "esri/views/MapView",
    "esri/Graphic",
    "esri/layers/GraphicsLayer",
    "esri/layers/FeatureLayer",
    "esri/layers/GeoJSONLayer",
    "esri/layers/ElevationLayer",
    "esri/views/draw/Draw",
    "esri/widgets/LayerList",
    "esri/widgets/Sketch",
    "esri/widgets/Search",
    "esri/widgets/BasemapGallery",
    "esri/widgets/Expand",
    "esri/widgets/Editor",
    "esri/geometry/support/webMercatorUtils"

], (Portal, OAuthInfo, esriId, PortalQueryParams, SceneView, Map, MapView, Graphic, GraphicsLayer, FeatureLayer, GeoJSONLayer, ElevationLayer, Draw, LayerList, Sketch, Search, BasemapGallery, Expand, Editor, webMercatorUtils) => {

    // Esri AGOL Authorization
    const info = new OAuthInfo({
        appId: "VciB4pGjVFKkH1Og",
        portalUrl: "https://cobecconsulting.maps.arcgis.com",
        authNamespace: "portal_oauth_inline",
        flowType: "auto",
        popup: false
    });
    esriId.registerOAuthInfos([info]);
    esriId.getCredential(info.portalUrl + "/sharing");
    esriId.checkSignInStatus(info.portalUrl + "/sharing")
        .then(() => {
            console.log("Sign In Successful.");
        }).catch(() => {
            console.log("User not signed in.")
        });

    const navaidsLyr = new FeatureLayer ({
        url: "https://services6.arcgis.com/ssFJjBXIUyZDrSYZ/arcgis/rest/services/NAVAIDSystem/FeatureServer/0",
        title: "NAVAIDS",
        popupTemplate: {
            title: "NAVAIDS",
            content: [
                {
                    type: "fields",
                    fieldInfos: [
                        {
                            fieldName: "IDENT",
                            label: "Identifier"
                        },
                        {
                            fieldName: "CHANNEL",
                            label: "Channel"
                        },
                        {
                            fieldName: "NAS_USE",
                            label: "NAS Use"
                        },
                        {
                            fieldName: "US_LOW",
                            label: "US LOW"
                        },
                        {
                            fieldName: "US_HIGH",
                            label: "US HIGH"
                        }
                    ]
                }
            ]
        },
        minScale: 1500000
    });

    const obstaclesLyr = new FeatureLayer ({
        url: "https://services6.arcgis.com/ssFJjBXIUyZDrSYZ/arcgis/rest/services/Digital_Obstacle_File/FeatureServer/0",
        title: "Obstacles",
        popupTemplate: {
            title: "Obstacles",
            content: [
                {
                    type: "fields",
                    fieldInfos: [
                        {
                            fieldName: "Type_Code",
                            label: "Type"
                        },
                        {
                            fieldName: "OAS_Number",
                            label: "OAS Number"
                        },
                        {
                            fieldName: "Quantity",
                            label: "Quantity"
                        },
                        {
                            fieldName: "AMSL",
                            label: "AMSL"
                        }
                    ]
                }
            ]
        },
        renderer: {
            type: "simple",
            symbol: {
                type: "picture-marker",
                url: "media/obstacle.png",
                contentType: "image/png",
                width: "12px",
                height: "18.33px"
            }
        },
        labelingInfo: {
            symbol: {
                type: "text",
                color: "black",
                font: {
                    family: "Playfair Display",
                    size: 10,
                    weight: "normal"
                }
            },
            labelPlacement: "above-center",
            labelExpressionInfo: {
                expression: "$feature.AMSL + TextFormatting.NewLine + '(' + $feature.AGL + ')'"
            }
        },
        minScale: 500000 
    });

    const desPointsLyr = new FeatureLayer ({
        url: "https://services6.arcgis.com/ssFJjBXIUyZDrSYZ/arcgis/rest/services/DesignatedPoints/FeatureServer/0",
        title: "Designated Points",
        popupTemplate: {
            title: "Designated Points",
            content: [
                {
                    type: "fields",
                    fieldInfos: [
                        {
                            fieldName: "IDENT",
                            label: "Identifier"
                        },
                        {
                            fieldName: "TYPE_CODE",
                            label: "Type"
                        },
                        {
                            fieldName: "MIL_CODE",
                            label: "Military Code"
                        },
                        {
                            fieldName: "NOTES_ID",
                            label: "Notes ID"
                        }
                    ]
                }
            ]
        },
        renderer: {
            type: "unique-value",
            field: "TYPE_CODE",
            uniqueValueInfos: [
                {
                    label: "Regular Public Transport",
                    value: "RPT",
                    symbol: {
                        type: "simple-marker",
                        size: 4,
                        color: [255, 0, 0]
                    }
                },
                {
                    label: "Waypoint",
                    value: "WPT",
                    symbol: {
                        type: "simple-marker",
                        size: 4,
                        color: [255, 180, 0]
                    }
                },
                {
                    label: "Other",
                    value: "OTHER",
                    symbol: {
                        type: "simple-marker",
                        size: 4,
                        color: [200, 200, 200]
                    }
                },
                {
                    label: "Navigation Reference System",
                    value: "NRS",
                    symbol: {
                        type: "simple-marker",
                        size: 4,
                        color: [255, 0, 0]
                    }
                },
                {
                    label: "Area Navigation",
                    value: "RNAV",
                    symbol: {
                        type: "simple-marker",
                        size: 4,
                        color: [255, 158, 244]
                    }
                },
                {
                    label: "Computer Navigation Fix",
                    value: "CNF",
                    symbol: {
                        type: "simple-marker",
                        size: 4,
                        color: [181, 0, 161]
                    }
                },
                {
                    label: "Ground Movement Control",
                    value: "GND",
                    symbol: {
                        type: "simple-marker",
                        size: 4,
                        color: [0, 207, 3]
                    }
                },
                {
                    value: "MRPT",
                    symbol: {
                        type: "simple-marker",
                        size: 4,
                        color: [33, 52, 255]
                    }
                }
            ]
        },
        minScale: 1500000
    });

    const airportsLyr = new FeatureLayer ({
        url: "https://services6.arcgis.com/ssFJjBXIUyZDrSYZ/arcgis/rest/services/US_Airport/FeatureServer/0",
        title: "Airports",
        popupTemplate: {
            title: "Airports",
            content: [
                {
                    type: "fields",
                    fieldInfos: [
                        {
                            fieldName: "IDENT",
                            label: "Identifier"
                        },
                        {
                            fieldName: "TYPE_CODE",
                            label: "Type"
                        },
                        {
                            fieldName: "MIL_CODE",
                            label: "Military Code"
                        },
                        {
                            fieldName: "NAME",
                            label: "Name"
                        }
                    ]
                }
            ]
        },
        renderer: {
            type: "unique-value",
            field: "TYPE_CODE",
            uniqueValueInfos: [
                {
                    label: "Aerodrome",
                    value: "AD",
                    symbol: {
                        type: "picture-marker",
                        url: "media/aerodrome_civil.png",
                        contentType: "image/png",
                        width: "15px",
                        height: "15px"
                    }
                },
                {
                    label: "Heliport",
                    value: "HP",
                    symbol: {
                        type: "picture-marker",
                        url: "media/heliport.png",
                        contentType: "image/png",
                        width: "15px",
                        height: "15px"
                    }
                },
                {
                    label: "Seaplane Base",
                    value: "SP",
                    symbol: {
                        type: "picture-marker",
                        url: "media/seaplane_base.png",
                        contentType: "image/png",
                        width: "15px",
                        height: "17.1875px"
                    }
                },
                {
                    label: "Ultralite",
                    value: "UL",
                    symbol: {
                        type: "picture-marker",
                        url: "media/ultralite_port.png",
                        contentType: "image/png",
                        width: "15px",
                        height: "15px"
                    }
                },
                {
                    label: "Glider",
                    value: "GL",
                    symbol: {
                        type: "picture-marker",
                        url: "media/gliderport.png",
                        contentType: "image/png",
                        width: "15px",
                        height: "15px"
                    }
                },
                {
                    label: "Balloonport",
                    value: "BP",
                    symbol: {
                        type: "picture-marker",
                        url: "media/balloonport.png",
                        contentType: "image/png",
                        width: "15px",
                        height: "15px"
                    }
                }
            ]
        },
        minScale: 2500000
    })

    const classAirspaceLyr = new FeatureLayer ({
        url: "https://services6.arcgis.com/ssFJjBXIUyZDrSYZ/arcgis/rest/services/Class_Airspace/FeatureServer/0",
        definitionExpression: "LOCAL_TYPE = 'CLASS_B' OR LOCAL_TYPE = 'CLASS_C' OR LOCAL_TYPE = 'CLASS_D'",
        popupTemplate: {
            title: "Class Airspace",
            content: [
                {
                    type: "fields",
                    fieldInfos: [
                        {
                            fieldName: "IDENT",
                            label: "Identifier"
                        },
                        {
                            fieldName: "TYPE_CODE",
                            label: "Type"
                        },
                        {
                            fieldName: "LOCAL_TYPE",
                            label: "Local Type"
                        },
                        {
                            fieldName: "ICAO_ID",
                            label: "ICAO ID"
                        }
                    ]
                }
            ]
        }
    });
    
    const graphicsLyr = new GraphicsLayer ({
        title: "Proposed Route",
        graphics: []
    });

    /*
    const routesLyr = new FeatureLayer ({
        url: "",
        title: "Supernal Routes"
    });
    */

    const map2D = new Map ({
        basemap: "topo-vector",
        ground: "world-elevation",
        layers: [navaidsLyr, obstaclesLyr, desPointsLyr, airportsLyr, classAirspaceLyr, graphicsLyr]
    });

    /*
    const map3D = new Map ({
        basemap: "topo-vector",
        ground: "world-elevation",
        layers: [navaidsLyr, desPointsLyr, graphicsLyr]
    });
    */

    const mapView = new MapView ({
        map: map2D,
        container: "view-div",
        zoom: 4,
        center: [-97, 39]
    });

    const sceneView = new SceneView ({
        map: map2D,
        container: "inset-div"
    });

    const appConfig = {
        mapView: mapView,
        sceneView: sceneView,
        activeView: null,
        container: "view-div"
    };
    appConfig.activeView = appConfig.mapView;

    mapView.when(() => {
        const layerList = new LayerList({
            view: mapView,
            container: "layer-list",
            listItemCreatedFunction: (event) => {
                const item = event.item;
                if (item.layer.url != null) {
                    item.actionsSections = [
                        [
                            {
                                title: "Item Details",
                                className: "esri-icon-description",
                                id: "item-details"
                            }
                        ]
                    ]
                };

                if (item.layer.type != "group") {
                    item.panel = {
                        content: "legend",
                        open: true
                    };
                }

            }
        });

        layerList.on("trigger-action", (event) => {
            const id = event.action.id;
            if (id === "item-details") {
                window.open(event.item.layer.url);
            }
        })
    })

    /*
    let layerlist = new LayerList ({
        view: mapView,
        container: "layer-list",
        listItemCreatedFunction: (event) => {
            const item = event.item;
            item.actionsSections = [
                [
                    {
                        title: "Filter",
                        className: "esri-icon-filter",
                        id: "filter"
                    },
                    {
                        title: "Item Details",
                        className: "esri-icon-description",
                        id: "item-details"
                    }
                ]
            ];
            if (item.layer.type != "group") {
                item.panel = {
                    content: "legend",
                    open: true
                };
            }
        }
    });
    */

    const search = new Search ({
        view: mapView,
        container: "search-div"
    });

    const basemapGallery = new BasemapGallery ({
        view: mapView
    });
    const bgExpand = new Expand ({
        mapView,
        content: basemapGallery,
        expandIconClass: "esri-icon-basemap"
    });
    mapView.ui.add(bgExpand, { position: "top-left" });

    const filterDiv = $("#filter-container")[0];
    const filterExpand = new Expand ({
        content: filterDiv,
        expandIconClass: "esri-icon-filter"
    });
    mapView.ui.add(filterExpand, { position: "top-left" });

    // Popuplate filter field dropdowns for each layer
    // Wait for map and layers to load first
    mapView.when(() => {
        for (let field of airportsLyr.fields) {
            $("#airport-field-select").append(
                "<calcite-option value='" + field.name + "'>" + field.name + "</calcite-option>"
            )
        };
        for (let field of classAirspaceLyr.fields) {
            $("#airspace-field-select").append(
                "<calcite-option value='" + field.name + "'>" + field.name + "</calcite-option>"
            )
        };
        for (let field of desPointsLyr.fields) {
            $("#fixes-field-select").append(
                "<calcite-option value='" + field.name + "'>" + field.name + "</calcite-option>"
            )
        };
        for (let field of navaidsLyr.fields) {
            $("#navaids-field-select").append(
                "<calcite-option value='" + field.name + "'>" + field.name + "</calcite-option>"
            )
        };
        for (let field of obstaclesLyr.fields) {
            $("#obstacles-field-select").append(
                "<calcite-option value='" + field.name + "'>" + field.name + "</calcite-option>"
            )
        };
    });

    // Listen to each filter switch and turn on/off the filter indicator icon
    // On switch on/off filter/unfilter the data layer
    $("#airport-filter-switch").on("calciteSwitchChange", (evtSwitch) => {
        let field = $("#airport-field-select")[0].value;
        let value = $("#airport-filter-value")[0].value;
        if (evtSwitch.currentTarget.checked == true) {
            $("#airport-filter-icon")[0].icon = "filter";
            mapView.whenLayerView(airportsLyr).then((layerView) => {
                layerView.filter = {
                    where: field + " = '" + value + "'"
                }
            })
        } else if (evtSwitch.currentTarget.checked == false) {
            $("#airport-filter-icon")[0].icon = " ";
            mapView.whenLayerView(airportsLyr).then((layerView) => {
                layerView.filter = {
                    where: "1=1"
                }
            })
        }
    });
    $("#airspace-filter-switch").on("calciteSwitchChange", (evtSwitch) => {
        if (evtSwitch.currentTarget.checked == true) {
            $("#airspace-filter-icon")[0].icon = "filter";
        } else if (evtSwitch.currentTarget.checked == false) {
            $("#airspace-filter-icon")[0].icon = " ";
        }
    });
    $("#fixes-filter-switch").on("calciteSwitchChange", (evtSwitch) => {
        if (evtSwitch.currentTarget.checked == true) {
            $("#fixes-filter-icon")[0].icon = "filter";
        } else if (evtSwitch.currentTarget.checked == false) {
            $("#fixes-filter-icon")[0].icon = " ";
        }
    });
    $("#navaids-filter-switch").on("calciteSwitchChange", (evtSwitch) => {
        if (evtSwitch.currentTarget.checked == true) {
            $("#navaids-filter-icon")[0].icon = "filter";
        } else if (evtSwitch.currentTarget.checked == false) {
            $("#navaids-filter-icon")[0].icon = " ";
        }
    });
    $("#obstacles-filter-switch").on("calciteSwitchChange", (evtSwitch) => {
        if (evtSwitch.currentTarget.checked == true) {
            $("#obstacles-filter-icon")[0].icon = "filter";
        } else if (evtSwitch.currentTarget.checked == false) {
            $("#obstacles-filter-icon")[0].icon = " ";
        }
    });
    


    $("#layer-select").on("calciteSelectChange", (select) => {
        let layerId = select.currentTarget.value;
        getFilterFields(layerId)
    })

    $("#airport-filter-value").on("calciteInputInput", (textEntry) => {
        let fieldSelect = $("#airport-field-select")[0]
        let field = fieldSelect.value;
        let value = textEntry.currentTarget.value;
        if ($("#airport-filter-switch")[0].checked == true) {
            mapView.whenLayerView(airportsLyr).then((layerView) => {
                layerView.filter = {
                    where: field + " = '" + value + "'"
                }
            })
        }
    })

    mapView.when(() => {
        const elevation = new ElevationLayer ({
            url: "http://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer"
        });
        return elevation.load();
    }).then((elevation) => {
        elevation.createElevationSampler(mapView.extent)
            .then((sampler) => {
                mapView.on("pointer-move", (move) => {
                    let mapPt = mapView.toMap(move);
                    let coordinates = sampler.queryElevation(mapPt)
                    $("#pointer-coords").html("Lat: " + coordinates.latitude + "  Long: " + coordinates.longitude + "  Elev: " + (coordinates.z * 3.28084) + " ft");
                })
            })
    });

    /*
        mapView.when(() => {
            const elevation = new ElevationLayer ({
                url: "http://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer"
            });
            return elevation.load();
        }).then((elevation) => {
            elevation.createElevationSampler(mapView.extent)
                .then((sampler) => {
                    mapView.on("pointer-down", (e) => {
                        const opts = {
                            include: [navaidsLyr]
                        };
                        mapView.hitTest(e, opts)
                            .then((response) => {
                                if (response.results.length) {
                                    const mapPt = mapView.toMap(e);
                                    const values = sampler.queryElevation(mapPt);
                                    const vertice = [values.longitude, values.latitude, values.z];
                                    console.log(vertice);
                                }
                            })
                    })
                })
        });
    });
    */


    /* POINT SKETCH SECTION WORKING
    const pointSketch = new Sketch ({
        layer: graphicsLyr,
        view: mapView,
        availableCreateTools: ["point"],
        snappingOptions: {
            enabled: true,
            featureSources: [
                {
                    layer: navaidsLyr,
                    enabled: true
                },
                {
                    layer: desPointsLyr,
                    enabled: true
                }
            ]
        },
        visibleElements: {
            createTools: {
                polygon: false,
                polyline: false,
                circle: false,
                rectangle: false,
            },
            selectionTools: {
                "lasso-selection": false,
                "rectangle-selection": false
            },
            settingsMenu: false
        }
    });
    pointSketch.viewModel.pointSymbol = {
        type: "simple-marker",
        color: [255, 0, 0],
        size: 6
    }

    $("#create-route").on("click", () => {
        mapView.ui.add(pointSketch, "top-right");
    })
    */
    
    const lineSketch = new Sketch ({
        layer: graphicsLyr,
        view: mapView,
        availableCreateTools: ["polyline"],
        snappingOptions: {
            enabled: true,
            featureSources: [
                {
                    layer: navaidsLyr,
                    enabled: true
                },
                {
                    layer: desPointsLyr,
                    enabled: true
                },
                {
                    layer: airportsLyr,
                    enabled: true
                }
            ]
        },
        visibleElements: {
            createTools: {
                point: false,
                circle: false,
                polygon: false,
                rectangle: false
            },
            selectionTools: {
                "lasso-selection": false,
                "rectangle-selection": false
            },
            settingsMenu: false
        }
    });
    lineSketch.viewModel.polylineSymbol = {
        type: "simple-line",
        color: [0, 200, 200],
        width: 3,
        cap: "round",
        join: "round"
    }

    $("#create-route").on("click", () => {
        console.log("Open Waypoint List");
        $("#waypoint-list").css("display", "block");

        mapView.ui.add(lineSketch, "top-right");
    });

    lineSketch.on("click", (evt) => {
        console.log(evt)
    });

    lineSketch.on("create", (evt) => {
        if (evt.state === "complete") {
            console.log("Route Complete");
        } else if (evt.toolEventInfo.type === "vertex-add") {
            let webMercPt = evt.toolEventInfo.added[0];
            let wgsPt = webMercatorUtils.geographicToWebMercator(webMercPt);
            console.log(webMercPt)
            console.log(wgsPt)

        }
    })

    function selectVertice (geom) {
        const query = {
            geometry: geom,
            spatialRelationship: "intersects",
            returnGeometry: true,
            outFields: ["*"]
        };

        navaidsLyr.queryFeatures(query)
            .then((results) => {
                //console.log(results)
            })
    }

    function getFilterFields (layer) {
        $("#field-select").empty();
        if (layer === "airspace") {
            for (let field of classAirspaceLyr.fields) {
                $("#field-select").append(
                    "<calcite-option value='" + field.name + "'>" + field.name + "</calcite-option>"
                )
            }
        } else if (layer === "airports") {
            for (let field of airportsLyr.fields) {
                $("#field-select").append(
                    "<calcite-option value='" + field.name + "'>" + field.name + "</calcite-option>"
                )
            }
        } else if (layer === "fixes") {
            for (let field of desPointsLyr.fields) {
                $("#field-select").append(
                    "<calcite-option value='" + field.name + "'>" + field.name + "</calcite-option>"
                )
            }
        } else if (layer === "navaids") {
            for (let field of navaidsLyr.fields) {
                $("#field-select").append(
                    "<calcite-option value='" + field.name + "'>" + field.name + "</calcite-option>"
                )
            }
        } else if (layer === "obstacles") {
            for (let field of obstaclesLyr.fields) {
                $("#field-select").append(
                    "<calcite-option value='" + field.name + "'>" + field.name + "</calcite-option>"
                )
            }
        } else if (layer === "routes") {
            console.log("routes");
        }
    }
    
    function filterLayer (layer, field, value, checked) {
        let featureLyr;
        switch (layer) {
            case "airports":
                featureLyr = airportsLyr;
                break;
            case "airspace":
                featureLyr = classAirspaceLyr;
                break;
            case "fixes":
                featureLyr = desPointsLyr;
                break;
            case "navaids":
                featureLyr = navaidsLyr;
                break;
            case "obstacles":
                featureLyr = obstaclesLyr;
                break;
        };
        if (checked == true) {
            mapView.whenLayerView(featureLyr).then((layerView) => {
                layerView.filter = {
                    where: field + " = '" + value + "'"
                }
            })
        } else {
            mapView.whenLayerView(featureLyr).then((layerView) => {
                layerView.filter = {
                    where: "1 = 1"
                }
            })
        }
    }
});