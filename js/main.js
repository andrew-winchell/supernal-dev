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
    "esri/smartMapping/statistics/uniqueValues",
    "esri/layers/ElevationLayer",
    "esri/views/draw/Draw",
    "esri/widgets/LayerList",
    "esri/widgets/Sketch",
    "esri/widgets/Sketch/SketchViewModel",
    "esri/widgets/Search",
    "esri/widgets/BasemapGallery",
    "esri/widgets/Expand",
    "esri/widgets/Editor",
    "esri/geometry/support/webMercatorUtils",
    "esri/widgets/Compass",
    "esri/geometry/Multipoint",
    "esri/geometry/Polyline",
    "esri/geometry/geometryEngine"

], (
        Portal, OAuthInfo, esriId, PortalQueryParams, SceneView, Map, MapView, Graphic, GraphicsLayer,
        FeatureLayer, uniqueValues, ElevationLayer, Draw, LayerList, Sketch, SketchViewModel, Search,
        BasemapGallery, Expand, Editor, webMercatorUtils, Compass, Multipoint, Polyline, geometryEngine
    ) => {

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

    const airportsLyr = new FeatureLayer ({
        url: "https://services6.arcgis.com/ssFJjBXIUyZDrSYZ/arcgis/rest/services/US_Airport/FeatureServer/0",
        title: "Airports",
        outFields: [
            "IDENT",
            "ICAO_ID",
            "NAME",
            "TYPE_CODE",
            "MIL_CODE",
            "SERVCITY",
            "STATE"
        ],
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
        outFields: [
            "IDENT",
            "ICAO_ID",
            "NAME",
            "TYPE_CODE",
            "CLASS",
            "LOCAL_TYPE"
        ],
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

    const vertiportsLyr = new FeatureLayer ({
        url: "https://services3.arcgis.com/rKjecbIat1XHvd9J/arcgis/rest/services/Vertiport/FeatureServer/0",
        title: "Vertiports",
        popupTemplate: {
            title: "Vertiport",
            content: [
                {
                    type: "fields",
                    fieldInfos: [
                        {
                            fieldName: "Name",
                            label: "Name"
                        }
                    ]
                }
            ]
        },
        renderer: {
            type: "simple",
            symbol: {
                type: "picture-marker",
                url: "media/vertiport.png",
                contentType: "image/png",
                width: "15px",
                height: "15px"
            }
        },
        minScale: 2500000 
    });

    const supernalRoutesLyr = new FeatureLayer ({
        url: "https://services3.arcgis.com/rKjecbIat1XHvd9J/arcgis/rest/services/Supernal_Routes/FeatureServer/0",
        title: "Existing Routes",
        renderer: {
            type: "simple",
            symbol: {
                type: "simple-line",
                color: "green",
                width: "3px",
            }
        }
    })
    
    const lineGraphicsLyr = new GraphicsLayer ({
        title: "Proposed Route",
        graphics: []
    });
    
    const pntGraphicsLyr = new GraphicsLayer ({
        title: "Proposed Route Vertices",
        graphics: []
    });

    const map2D = new Map ({
        basemap: "topo-vector",
        ground: "world-elevation",
        layers: [
            navaidsLyr,
            obstaclesLyr,
            desPointsLyr,
            airportsLyr,
            classAirspaceLyr,
            lineGraphicsLyr,
            pntGraphicsLyr,
            vertiportsLyr,
            supernalRoutesLyr
        ]
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
        zoom: 3,
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

    // After map load, create a customized Layer List widget
    // Place in left pane layer-list div
    // Add custom actions for legend and item details
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

    // Create Compass widget instance and place in the top-left UI
    const compass = new Compass ({
        view: mapView
    });
    // Add Compass to UI
    mapView.ui.add(compass, "top-left");

    // Create Search widget instance and place in the search-div container
    const search = new Search ({
        view: mapView,
        container: "search-div"
    });

    // Create BasemapGallery instance
    const basemapGallery = new BasemapGallery ({
        view: mapView
    });
    // Create Expand widget instance and place basemap gallery content inside
    const bgExpand = new Expand ({
        mapView,
        content: basemapGallery,
        expandIconClass: "esri-icon-basemap"
    });
    // Add BG Expand to UI
    mapView.ui.add(bgExpand, { position: "bottom-left" });

    // Get the div container for the custom filter widget
    const filterDiv = $("#filter-container")[0];
    // Create Expand widget instance and place the custom filter div in the content
    const filterExpand = new Expand ({
        content: filterDiv,
        expandIconClass: "esri-icon-filter"
    });
    // Add Filter Expand to UI
    mapView.ui.add(filterExpand, { position: "bottom-left" });

    // Open Route Editor Toolbar
    $("#create-route").on("click", () => {
        $("#route-toolbar").css("display", "block");
    });

    const pointSketchViewModel = new SketchViewModel ({
        layer: pntGraphicsLyr,
        view: mapView,
        pointSymbol: {
            type: "simple-marker",
            style: "circle",
            color: "blue",
            size: "8px"
        },
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
                },
                {
                    layer: vertiportsLyr,
                    enabled: true
                }
            ]
        },
        labelOptions: { enabled: true },
        tooltipOptions: { enabled: true }
    });

    let multipointVertices = [];

    $("#add-route-vertices").on("click", () => {
        mapView.focus();
        
        pointSketchViewModel.create("multipoint");

        pointSketchViewModel.on("create", (evt) => {
            if (evt.state == "complete") {
                console.log("complete feature");
            } else if (evt.state == "start") {
                let altitude = prompt("Enter Altitude:", 0);
                let coords = [evt.toolEventInfo.added[0][0], evt.toolEventInfo.added[0][1], parseInt(altitude)];
                multipointVertices.push(coords);
                createVertice(multipointVertices);
                $("#waypoint-list").css("display", "block");
            } else if (evt.state == "active") {
                if (evt.toolEventInfo.type == "vertex-add") {
                    let altitude = prompt("Enter Altitude:", 0);
                    let coords = [evt.toolEventInfo.added[0][0], evt.toolEventInfo.added[0][1], parseInt(altitude)];
                    multipointVertices.push(coords);
                    createVertice(multipointVertices);
                    drawPath(multipointVertices);
                    if (multipointVertices.length > 1) {
                        $("#complete-route")[0].disabled = false;
                    }
                    $("#edit-vertices")[0].disabled = false;
                    $("#cancel-vertices")[0].disabled = false;
                }
            }
        })
    });

    $("#complete-route").on("click", (evt) => {
        evt.currentTarget.disabled = true;
        pointSketchViewModel.complete();
        $("#save-route")[0].disabled = false;
        $("#edit-vertices")[0].disabled = true;
        $("#cancel-vertices")[0].disabled = true;
    });

    // Open the save route modal
    $("#save-route").on("click", (evt) => {
        $("#route-save-modal")[0].open = true;
    });

    // Save the route with options to the Supernal Exisiting Routes feature class
    $("#route-save").on("click", (evt) => {
        let rName = $("#route-name")[0].value;
        let rArrival = $("#route-arr")[0].value;
        let rDepart = $("#route-dep")[0].value;

        let path = [];

        let multipoint = new Multipoint ({
            points: multipointVertices,
            spatialReference: mapView.spatialReference
        });

        for (let i=0; i<multipoint.points.length; i++) {
            let mapPt = multipoint.getPoint(i);
            let coords = [mapPt.longitude, mapPt.latitude, mapPt.z];
            path.push(coords);
        }

        let polyline = {
            type: "polyline",
            paths: path
        };

        let polylineGraphic = new Graphic ({
            geometry: polyline,
            attributes: {
                "route_name": rName,
                "departing_fac": rDepart,
                "arriving_facility": rArrival
            }
        });

        let rDistance = geometryEngine.geodesicLength(polylineGraphic.geometry, "nautical-miles");

        polylineGraphic.attributes["route_distance"] = rDistance

        const edits = {
            addFeatures: [polylineGraphic]
        };

        supernalRoutesLyr
            .applyEdits(edits)
            .then((results) => {
                console.log(results)
            });

        mapView.graphics.removeAll();
        
        $("#route-save-modal")[0].open = false;
        
        multipointVertices = [];

        pntGraphicsLyr.removeAll();

        $("#waypoints").empty();
        $("#waypoint-list").css("display", "none");

        $("#save-route")[0].disabled = true;
    })

    function drawPath (vertices) {
        let polyline = new Polyline ({
            hasZ: true,
            spatialReference: mapView.spatialReference,
            paths: vertices
        });
    
        const graphic = new Graphic ({
            geometry: polyline,
            symbol: {
                type: "simple-line",
                color: "#008b8b",
                width: "3",
                style: "short-dash"
            }
        })
        mapView.graphics.add(graphic);
    }

    function createVertice (vertices) {

        mapView.graphics.removeAll();

        let multipoint = new Multipoint ({
            points: vertices,
            spatialReference: mapView.spatialReference
        });

        $("#waypoints").empty();

        for (let i=0; i<multipoint.points.length; i++) {
            let mapPt = multipoint.getPoint(i);
            let x = mapPt.longitude.toFixed(4);
            let y = mapPt.latitude.toFixed(4);
            let z = mapPt.z;
            $("#waypoints").append(
                "<calcite-list-item disabled style='opacity:1;' label='Vertice #" + (i+1) + "' description='X: " + x + " Y: " + y +" Z: " + z + "'><calcite-list-item>"
            )
        }
    }    

    // Popuplate filter field dropdowns for each layer
    // Wait for map and layers to load first
    mapView.when(() => {
        $("#airport-field-select").on("calciteComboboxChange", (change) => {
            $("#airport-filter-value").empty();
            let field = change.currentTarget.value;
            uniqueValues({
                layer: airportsLyr,
                field: field
            }).then((response) => {
                let unique = [];
                response.uniqueValueInfos.forEach((val) => {
                    unique.push(val.value);
                });
                unique.sort();
                for (let item of unique) {
                    $("#airport-filter-value").append(
                        "<calcite-combobox-item value='" + item + "' text-label='" + item + "'></calcite-combobox-item>"
                    );
                }
            });
        });
        $("#airspace-field-select").on("calciteComboboxChange", (change) => {
            $("#airspace-filter-value").empty();
            let field = change.currentTarget.value;
            uniqueValues({
                layer: classAirspaceLyr,
                field: field
            }).then((response) => {
                let unique = [];
                response.uniqueValueInfos.forEach((val) => {
                    unique.push(val.value);
                });
                unique.sort();
                for (let item of unique) {
                    $("#airspace-filter-value").append(
                        "<calcite-combobox-item value='" + item + "' text-label='" + item + "'></calcite-combobox-item>"
                    );
                }
            });
        });
        $("#fixes-field-select").on("calciteComboboxChange", (change) => {
            $("#fixes-filter-value").empty();
            let field = change.currentTarget.value;
            uniqueValues({
                layer: desPointsLyr,
                field: field
            }).then((response) => {
                let unique = [];
                response.uniqueValueInfos.forEach((val) => {
                    unique.push(val.value);
                });
                unique.sort();
                for (let item of unique) {
                    $("#fixes-filter-value").append(
                        "<calcite-combobox-item value='" + item + "' text-label='" + item + "'></calcite-combobox-item>"
                    );
                }
            });
        });
        $("#navaids-field-select").on("calciteComboboxChange", (change) => {
            $("#navaids-filter-value").empty();
            let field = change.currentTarget.value;
            uniqueValues({
                layer: navaidsLyr,
                field: field
            }).then((response) => {
                let unique = [];
                response.uniqueValueInfos.forEach((val) => {
                    unique.push(val.value);
                });
                unique.sort();
                for (let item of unique) {
                    $("#navaids-filter-value").append(
                        "<calcite-combobox-item value='" + item + "' text-label='" + item + "'></calcite-combobox-item>"
                    );
                }
            });
        });
        $("#obstacles-field-select").on("calciteComboboxChange", (change) => {
            $("#obstacles-filter-value").empty();
            let field = change.currentTarget.value;
            uniqueValues({
                layer: obstaclesLyr,
                field: field
            }).then((response) => {
                let unique = [];
                response.uniqueValueInfos.forEach((val) => {
                    unique.push(val.value);
                });
                unique.sort();
                for (let item of unique) {
                    $("#obstacles-filter-value").append(
                        "<calcite-combobox-item value='" + item + "' text-label='" + item + "'></calcite-combobox-item>"
                    );
                }
            });
        });
    });

    // Airport Layer listen for filter switch to be turned on
    // If turned on, apply current filter values
    $("#airport-filter-switch").on("calciteSwitchChange", (evtSwitch) => {
        let field = $("#airport-field-select")[0].value;
        let value = $("#airport-filter-value")[0].value;
        if (evtSwitch.currentTarget.checked == true) {
            $("#airport-filter-icon")[0].icon = "filter";
            mapView.whenLayerView(airportsLyr).then((layerView) => {
                layerView.filter = {
                    where: field + " = '" + value + "'"
                }
            });
        } else if (evtSwitch.currentTarget.checked == false) {
            $("#airport-filter-icon")[0].icon = " ";
            mapView.whenLayerView(airportsLyr).then((layerView) => {
                layerView.filter = {
                    where: "1=1"
                }
            });
        }
    });

    // Airspace Layer listen for filter switch to be turned on
    // If turned on, apply current filter values
    $("#airspace-filter-switch").on("calciteSwitchChange", (evtSwitch) => {
        let field = $("#airspace-field-select")[0].value;
        let value = $("#airspace-filter-value")[0].value;
        if (evtSwitch.currentTarget.checked == true) {
            $("#airspace-filter-icon")[0].icon = "filter";
            mapView.whenLayerView(classAirspaceLyr).then((layerView) => {
                layerView.filter = {
                    where: field + " = '" + value + "'"
                }
            });
        } else if (evtSwitch.currentTarget.checked == false) {
            $("#airspace-filter-icon")[0].icon = " ";
            mapView.whenLayerView(classAirspaceLyr).then((layerView) => {
                layerView.filter = {
                    where: "1=1"
                }
            });
        }
    });

    // Fixes Layer listen for filter switch to be turned on
    // If turned on, apply current filter values
    $("#fixes-filter-switch").on("calciteSwitchChange", (evtSwitch) => {
        let field = $("#fixes-field-select")[0].value;
        let value = $("#fixes-filter-value")[0].value;
        if (evtSwitch.currentTarget.checked == true) {
            $("#fixes-filter-icon")[0].icon = "filter";
            mapView.whenLayerView(desPointsLyr).then((layerView) => {
                layerView.filter = {
                    where: field + " = '" + value + "'"
                }
            });
        } else if (evtSwitch.currentTarget.checked == false) {
            $("#fixes-filter-icon")[0].icon = " ";
            mapView.whenLayerView(desPointsLyr).then((layerView) => {
                layerView.filter = {
                    where: "1=1"
                }
            });
        }
    });

    // NAVAIDS Layer listen for filter switch to be turned on
    // If turned on, apply current filter values
    $("#navaids-filter-switch").on("calciteSwitchChange", (evtSwitch) => {
        let field = $("#navaids-field-select")[0].value;
        let value = $("#navaids-filter-value")[0].value;
        if (evtSwitch.currentTarget.checked == true) {
            $("#navaids-filter-icon")[0].icon = "filter";
            mapView.whenLayerView(navaidsLyr).then((layerView) => {
                layerView.filter = {
                    where: field + " = '" + value + "'"
                }
            });
        } else if (evtSwitch.currentTarget.checked == false) {
            $("#navaids-filter-icon")[0].icon = " ";
            mapView.whenLayerView(navaidsLyr).then((layerView) => {
                layerView.filter = {
                    where: "1=1"
                }
            });
        }
    });

    // Obstacles Layer listen for filter switch to be turned on
    // If turned on, apply current filter values
    $("#obstacles-filter-switch").on("calciteSwitchChange", (evtSwitch) => {
        let field = $("#obstacles-field-select")[0].value;
        let value = $("#obstacles-filter-value")[0].value;
        if (evtSwitch.currentTarget.checked == true) {
            $("#obstacles-filter-icon")[0].icon = "filter";
            mapView.whenLayerView(obstaclesLyr).then((layerView) => {
                layerView.filter = {
                    where: field + " = '" + value + "'"
                }
            });
        } else if (evtSwitch.currentTarget.checked == false) {
            $("#obstacles-filter-icon")[0].icon = " ";
            mapView.whenLayerView(obstaclesLyr).then((layerView) => {
                layerView.filter = {
                    where: "1=1"
                }
            });
        }
    });    

    // Airports Layer listen for changes in filter selection
    // Filter based on any matching values
    $("#airport-filter-value").on("calciteComboboxChange", (selection) => {
        let fieldSelect = $("#airport-field-select")[0]
        let field = fieldSelect.value;
        let value = selection.currentTarget.value;
        let valueList = [];
        if (Array.isArray(value)) {
            for (let v of value) {
                valueList.push("'" + v + "'");
            }            
        } else {
            value = "'" + value + "'";
            valueList.push(value)
        }
        if ($("#airport-filter-switch")[0].checked == true) {
            mapView.whenLayerView(airportsLyr).then((layerView) => {
                layerView.filter = {
                    where: field + " IN (" + valueList + ")"
                }
            })
        }
    });

    // Airspace Layer listen for changes in filter selection
    // Filter based on any matching values
    $("#airspace-filter-value").on("calciteComboboxChange", (selection) => {
        let fieldSelect = $("#airspace-field-select")[0]
        let field = fieldSelect.value;
        let value = selection.currentTarget.value;
        let valueList = [];
        if (Array.isArray(value)) {
            for (let v of value) {
                valueList.push("'" + v + "'");
            }            
        } else {
            value = "'" + value + "'";
            valueList.push(value)
        }
        if ($("#airspace-filter-switch")[0].checked == true) {
            mapView.whenLayerView(classAirspaceLyr).then((layerView) => {
                layerView.filter = {
                    where: field + " IN (" + valueList + ")"
                }
                console.log(layerView.filter.where)
            })
        }
    });
    
    // Fixes Layer listen for changes in filter selection
    // Filter based on any matching values
    $("#fixes-filter-value").on("calciteComboboxChange", (selection) => {
        let fieldSelect = $("#fixes-field-select")[0]
        let field = fieldSelect.value;
        let value = selection.currentTarget.value;
        let valueList = [];
        if (Array.isArray(value)) {
            for (let v of value) {
                valueList.push("'" + v + "'");
            }            
        } else {
            value = "'" + value + "'";
            valueList.push(value)
        }
        if ($("#fixes-filter-switch")[0].checked == true) {
            mapView.whenLayerView(desPointsLyr).then((layerView) => {
                layerView.filter = {
                    where: field + " IN (" + valueList + ")"
                }
            })
        }
    });
    
    // NAVAIDS Layer listen for changes in filter selection
    // Filter based on any matching values
    $("#navaids-filter-value").on("calciteComboboxChange", (selection) => {
        let fieldSelect = $("#navaids-field-select")[0]
        let field = fieldSelect.value;
        let value = selection.currentTarget.value;
        let valueList = [];
        if (Array.isArray(value)) {
            for (let v of value) {
                valueList.push("'" + v + "'");
            }            
        } else {
            value = "'" + value + "'";
            valueList.push(value)
        }
        if ($("#navaids-filter-switch")[0].checked == true) {
            mapView.whenLayerView(navaidsLyr).then((layerView) => {
                layerView.filter = {
                    where: field + " IN (" + valueList + ")"
                }
            })
        }
    });
    
    // Obstacles Layer listen for changes in filter selection
    // Filter based on any matching values
    $("#obstacles-filter-value").on("calciteComboboxChange", (selection) => {
        let fieldSelect = $("#obstacles-field-select")[0]
        let field = fieldSelect.value;
        let value = selection.currentTarget.value;
        let valueList = [];
        if (Array.isArray(value)) {
            for (let v of value) {
                valueList.push("'" + v + "'");
            }            
        } else {
            value = "'" + value + "'";
            valueList.push(value)
        }
        if ($("#obstacles-filter-switch")[0].checked == true) {
            mapView.whenLayerView(obstaclesLyr).then((layerView) => {
                layerView.filter = {
                    where: field + " IN (" + valueList + ")"
                }
            })
        }
    });

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