require([
    "esri/portal/Portal",
    "esri/identity/OAuthInfo",
    "esri/identity/IdentityManager",
    "esri/portal/PortalQueryParams",
    "esri/views/SceneView",
    "esri/WebScene",
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
    "esri/geometry/Point",
    "esri/geometry/geometryEngine",
    "esri/widgets/ElevationProfile",
    "esri/core/reactiveUtils",
    "esri/geometry/support/geodesicUtils"
], (
        Portal, OAuthInfo, esriId, PortalQueryParams, SceneView, WebScene, Map, MapView, Graphic, GraphicsLayer,
        FeatureLayer, uniqueValues, ElevationLayer, Draw, LayerList, Sketch, SketchViewModel, Search,
        BasemapGallery, Expand, Editor, webMercatorUtils, Compass, Multipoint, Polyline, Point,
        geometryEngine, ElevationProfile, reactiveUtils, geodesicUtils
    ) => {

    /********** ESRI ArcGIS Online User Authentication **********/

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


    /********** ArcGIS Online Hosted Feature Layers **********/

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
    });

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
        },
        popupTemplate: {
            title: "{route_name}",
            content: [
                {
                    type: "fields",
                    fieldInfos: [
                        {
                            fieldName: "route_name",
                            label: "Name"
                        },
                        {
                            fieldName: "departing_fac",
                            label: "Departure Facility"
                        },
                        {
                            fieldName: "arriving_facility",
                            label: "Arrival Facility"
                        },
                        {
                            fieldName: "route_distance",
                            label: "Distance"
                        }
                    ]
                }
            ],
            actions: [
                {
                    title: "Edit Route",
                    id: "edit-attributes",
                    className: "esri-icon-edit"
                }
            ]
        },
        definitionExpression: "1=0"
    });

    /********** Client-Side Graphics Layers for Drawing **********/

    const lineGraphicsLyr = new GraphicsLayer ({
        title: "Proposed Route",
        graphics: []
    });
    
    const pntGraphicsLyr = new GraphicsLayer ({
        title: "Proposed Route Vertices",
        graphics: []
    });

    /********** 2D and 3D Map View Configurations **********/

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

    const scene = new WebScene ({
        portalItem: {
            id: "7e4b2a879c37418b8cccedc9181009d3"
        }
    });
    
    const mapView = new MapView ({
        map: map2D,
        container: "view-div",
        zoom: 3,
        center: [-97, 39]
    });

    const sceneView = new SceneView ({
        map: scene,
        container: "inset-div"
    });

    const appConfig = {
        mapView: mapView,
        sceneView: sceneView,
        activeView: null,
        container: "view-div"
    };
    appConfig.activeView = appConfig.mapView;

    /********** Map Widgets **********/

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
            console.log(event);
            const id = event.action.id;
            if (id === "item-details") {
                window.open(event.item.layer.url);
            }
        })
    })

    const compass = new Compass ({
        view: mapView
    });

    mapView.ui.add(compass, "top-left");

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

    mapView.ui.add(bgExpand, { position: "bottom-left" });

    const filterDiv = $("#filter-container")[0];

    const filterExpand = new Expand ({
        content: filterDiv,
        expandIconClass: "esri-icon-filter"
    });

    mapView.ui.add(filterExpand, { position: "bottom-left" });

    const switchBtn = $("#switch-btn")[0];

    mapView.ui.add(switchBtn, { position: "bottom-left" });

    mapView.when(() => {
        const sketch = new Sketch ({
            layer: lineGraphicsLyr,
            view: mapView,
            creationMode: "update",
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
                    },
                    {
                        layer: vertiportsLyr,
                        enabled: true
                    }
                ]                
            }
        });

        //mapView.ui.add(sketch, { position: "top-right" });
    });

    /********** Layer Filtering Capabilities **********/

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
    
    /********** Route Creation Tool **********/

    // Drawing variables
    let multipointVertices = [],
        userLineColor = $("#color-picker")[0].value;
    
    $("#color-picker").on("calciteColorPickerChange", (evt) => {
        console.log(evt);
        userLineColor = evt.currentTarget.value;
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

    // Open Creator Toolbar
    $("#create-route").on("click", () => {
        $("#route-toolbar").css("display", "block");
        $("#color-picker").css("display", "block");
        $("#add-route-vertices")[0].disabled = false;
        supernalRoutesLyr.definitionExpression = "1=0";
        multipointVertices = [];
        elevationProfile.input = null;
        $("#waypoint-list").css("display", "none");
        mapView.popup.close();
    });

    $("#add-route-vertices").on("click", () => {
        mapView.focus();
        pointSketchViewModel.create("multipoint", {hasZ: true});
        $("#add-route-vertices")[0].disabled = true;
    });

    pointSketchViewModel.on("create", (evt) => {
        if (evt.state == "complete") {
            console.log("complete feature");
        } else if (evt.state == "start") {
            $("#waypoint-table tbody tr").remove();

            let coords = [evt.toolEventInfo.added[0][0], evt.toolEventInfo.added[0][1], 0];
            createTableRow([coords]);
            multipointVertices.push(coords);
            $("#waypoint-list").css("display", "block");

        } else if (evt.state == "active") {
            if (evt.toolEventInfo.type == "vertex-add") {
                let coords = [evt.toolEventInfo.added[0][0], evt.toolEventInfo.added[0][1], 0];

                createTableRow([coords]);
                multipointVertices.push(coords);
                drawPath(multipointVertices);

                if (multipointVertices.length > 1) {
                    $("#complete-route")[0].disabled = false;
                }
                //$("#edit-vertices")[0].disabled = false;
                $("#cancel-vertices")[0].disabled = false;
            }
        }
    });

    $("#waypoint-table").on("input", (evt) => {

        if (evt.target.cellIndex == 3) {
            // Check if z-values are non-negative numbers
            // true = green & false = red
            if (!isNaN(evt.target.innerHTML) && parseFloat(evt.target.innerHTML) >=0 ) {
                evt.target.bgColor = "#C6EFCE";
            } else {
                evt.target.bgColor = "#FFC7CE";
            }
        } else if (evt.target.cellIndex == 2) {
            // Check if y-values are numbers between -90 and 90
            // true = green & false = red
            if (!isNaN(evt.target.innerHTML) && (parseFloat(evt.target.innerHTML) >= -90 && parseFloat(evt.target.innerHTML) <= 90)) {
                evt.target.bgColor = "#C6EFCE";
            } else {
                evt.target.bgColor = "#FFC7CE";
            }
        } else if (evt.target.cellIndex == 1) {
            // Check if x-values are numbers between -180 and 180
            // true = green & false = red
            if (!isNaN(evt.target.innerHTML) && (parseFloat(evt.target.innerHTML) >= -180 && parseFloat(evt.target.innerHTML) <= 180)) {
                evt.target.bgColor = "#C6EFCE";
            } else {
                evt.target.bgColor = "#FFC7CE";
            }
        }

        let table = document.getElementById('waypoint-table'),
            rows = table.getElementsByTagName("tr"),
            newVertices = [],
            i, j, cells;

        for (i=0, j=rows.length; i<j; ++i) {
            cells = rows[i].getElementsByTagName("td");
            if (!cells.length) {
                continue;
            }
            
            let long = cells[1].innerHTML,
                lat = cells[2].innerHTML,
                alt = cells[3].innerHTML;
            
            let point = new Point ({
                latitude: lat,
                longitude: long,
                z: alt/3.281,
                spatialReference: 3857
            });

            let coord = [point.x, point.y, point.z];

            newVertices.push(coord);
        }
    
        multipointVertices = newVertices;

        let polyline = new Polyline ({
            hasZ: true,
            spatialReference: mapView.spatialReference,
            paths: multipointVertices
        });
    
        const graphic = new Graphic ({
            geometry: polyline,
            symbol: {
                type: "simple-line",
                color: userLineColor,
                width: "3",
                style: "short-dash"
            }
        });

        drawPath(multipointVertices);

        elevationProfile.input = graphic;
    });

    function createTableRow (vertice) {
        let multipoint = new Multipoint ({
            points: vertice,
            spatialReference: mapView.spatialReference
        });

        let mapPt = multipoint.getPoint(0);

        let nextRow = $("#waypoint-table tbody")[0].insertRow(-1);
        let nextVert = nextRow.insertCell(0);
        let nextX = nextRow.insertCell(1);
        let nextY = nextRow.insertCell(2);
        let nextZ = nextRow.insertCell(3);

        nextVert.innerHTML = nextRow.rowIndex
        nextX.innerHTML = mapPt.longitude.toFixed(6);
        nextX.setAttribute("contentEditable", "true");
        nextY.innerHTML = mapPt.latitude.toFixed(6);
        nextY.setAttribute("contentEditable", "true");
        nextZ.innerHTML = (mapPt.z * 3.281).toFixed(0);
        nextZ.setAttribute("contentEditable", "true");
    }

    function drawPath (vertices) {
        mapView.graphics.removeAll();

        let polyline = new Polyline ({
            hasZ: true,
            spatialReference: mapView.spatialReference,
            paths: vertices
        });
    
        const graphic = new Graphic ({
            geometry: polyline,
            symbol: {
                type: "simple-line",
                color: userLineColor,
                width: "3",
                style: "short-dash"
            }
        });

        mapView.graphics.add(graphic);
        elevationProfile.input = graphic;
    } 

    $("#complete-route").on("click", (evt) => {
        evt.currentTarget.disabled = true;
        pointSketchViewModel.complete();
        $("#save")[0].disabled = false;
        $("#edit-vertices")[0].disabled = true;
        $("#cancel-vertices")[0].disabled = true;
    });

    // Open Save Route modal to enter attributes and push route to layer
    $("#save").on("click", (evt) => {
        $("#route-save-modal")[0].open = true;
    });

    $("#route-save").on("click", (evt) => {

        // Get the user entered values for the route attributes
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
                objectId = results.addFeatureResults[0].objectId;
                selectExistingRoute(objectId);

                mapView.graphics.removeAll();

                $("#route-name")[0].value = "";
                $("#route-arr")[0].value = "";
                $("#route-dep")[0].value = "";
                
                // Close modal
                // Reset vertices, sketch, table
                $("#route-save-modal")[0].open = false;
                $("#waypoint-table tbody tr").remove();
                $("#waypoint-list").css("display", "none");
                $("#save")[0].disabled = true;
                $("#route-toolbar").css("display", "none");
                $("#color-picker").css("display", "none");
                multipointVertices = [];
                pntGraphicsLyr.removeAll();
                pointSketchViewModel.cancel();
            });
    });

    // Cancel Create Route
    $("#cancel-vertices").on("click", (evt) => {
        cancelRouteCreation();
    });

    function cancelRouteCreation () {
        pointSketchViewModel.cancel();
        multipointVertices = [];
        $("#waypoint-table tbody tr").remove(); // remove table rows
        $("#waypoint-list").css("display", "none"); // hide table
        // reset route toolbar buttons and hide
        $("#route-toolbar").css("display", "none");
        $("#color-picker").css("display", "none");
        $("#save")[0].disabled = true;
        $("#complete-route")[0].disabled = true;
        $("#edit-vertices")[0].disabled = true;
        $("#cancel-vertices")[0].disabled = true;
        $("#add-route-vertices")[0].disabled = false;
        mapView.graphics.removeAll(); // remove incomplete route
        elevationProfile.input = null; // clear elevation profile graphic
    }

    /********** Pointer Hover X/Y/Z Coordinates **********/

    mapView.when(() => {
        const elevation = new ElevationLayer({
            url: "http://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer"
        });
        return elevation.load();
    }).then((elevation) => {
        elevation.createElevationSampler(mapView.extent)
            .then((sampler) => {
                mapView.on("pointer-move", (move) => {
                    let mapPt = mapView.toMap(move);
                    let coordinates = sampler.queryElevation(mapPt)
                    $("#pointer-coords").html("Lat: " + coordinates.latitude + "  Long: " + coordinates.longitude + "  Elev: " + (coordinates.z) + " ft");
                })
            })
    });

    /********** Existing Routes List **********/

    let selectedFeature,
        editor;

    populateExistingRoutes();

    function populateExistingRoutes () {
        mapView.when(() => {
            const query = {
                where: "1=1",
                outFields: ["*"]
            };
    
            supernalRoutesLyr.queryFeatures(query)
                .then((results) => {
                    for (let f of results.features) {
                        $("#existing-routes").append(
                            "<calcite-list-item value='" + f.attributes.OBJECTID + "' label='" + f.attributes.route_name + "' description='Distance: " + parseFloat(f.attributes.route_distance).toFixed(2) + " nautical miles' value='test'></calcite-list-item>"
                        )
                    }
                    $("#existing-routes")[0].loading = false;
                });
        });
    }

    /********** Editing Existing Routes **********/

    let objectId;

    function selectExistingRoute (objectId) {
        const query = {
            where: "OBJECTID = " + objectId,
            outFields: ["*"],
            returnGeometry: true,
            returnZ: true
        };

        supernalRoutesLyr.queryFeatures(query)
            .then((results) => {
                selectedFeature = results.features[0];
                mapView
                    .goTo(selectedFeature.geometry.extent.expand(2))
                    .then(() => {
                        supernalRoutesLyr.definitionExpression = "OBJECTID = " + objectId;
                        $("#waypoint-list").css("display", "block");
                        selectedFeatureTable(selectedFeature.geometry.paths);
                        selectedFeatureProfile(selectedFeature.geometry.paths);
                        mapView.popup.dockEnabled = true;
                        mapView.popup.set("dockOptions", {
                            position: "bottom-right",
                            buttonEnabled: false
                        });
                        mapView.popup.open({
                            features: [selectedFeature]
                        });
                    })
                    .catch((error) => {
                        if (error.name != "AbortError") {
                            console.log(error);
                        }
                    });
            });

    }

    $("#existing-routes").on("calciteListItemSelect", (evt) => {
        if (editor.viewModel.state !== "editing-existing-feature") {
            objectId = evt.target.value;
            cancelRouteCreation();
            selectExistingRoute(objectId);
        }
    });

    mapView.when(() => {
        editor = new Editor ({
            view: mapView,
            visibleElements: {
                snappingControls: false,
                sketchTooltipControls: false
            },
            container: document.createElement("div"),
            layerInfos: [
                {
                    layer: supernalRoutesLyr,
                    formTemplate: {
                        title: "Route Attributes",
                        description: "Enter or Modify all route attributes below",
                        elements: [
                            {
                                type: "field",
                                fieldName: "route_name",
                                label: "Route Name"
                            },
                            {
                                type: "field",
                                fieldName: "departing_fac",
                                label: "Departure Facility"
                            },
                            {
                                type: "field",
                                fieldName: "arriving_facility",
                                label: "Arrival Facility"
                            }
                        ]
                    }
                }
            ]
        })
    });

    $("#save-vertices").on("click", (evt) => {        
        let table = document.getElementById('waypoint-table'),
            rows = table.getElementsByTagName("tr"),
            newVertices = [],
            i, j, cells;

        for (i=0, j=rows.length; i<j; ++i) {
            cells = rows[i].getElementsByTagName("td");
            if (!cells.length) {
                continue;
            }
            
            let long = cells[1].innerHTML,
                lat = cells[2].innerHTML,
                alt = cells[3].innerHTML;
            
            let point = new Point ({
                latitude: lat,
                longitude: long,
                z: alt/3.281,
                spatialReference: 4326
            });

            let coord = [point.x, point.y, point.z];

            newVertices.push(coord);
        }

        let polyline = {
            type: "polyline",
            paths: newVertices,
            hasZ: true
        };

        let polylineGraphic = new Graphic ({
            geometry: polyline,
            attributes: {
                "OBJECTID": objectId
            }
        });

        let rDistance = geometryEngine.geodesicLength(polylineGraphic.geometry, "nautical-miles");

        polylineGraphic.attributes["route_distance"] = rDistance;

        const edits = {
            updateFeatures: [polylineGraphic]
        };
        mapView.graphics.add(polylineGraphic);

        supernalRoutesLyr
            .applyEdits(edits)
            .then(() => {
                const query = {
                    where: "OBJECTID = " + objectId,
                    outFields: ["*"],
                    returnGeometry: true,
                    returnZ: true
                };
    
                supernalRoutesLyr.queryFeatures(query)
                    .then((results) => {
                        selectedFeature = results.features[0];
                        mapView
                            .goTo(selectedFeature.geometry.extent.expand(2))
                            .then(() => {
                                supernalRoutesLyr.definitionExpression = "OBJECTID = " + objectId;
                                $("#waypoint-list").css("display", "block");
                                selectedFeatureTable(selectedFeature.geometry.paths);
                                selectedFeatureProfile(selectedFeature.geometry.paths);
                                mapView.popup.dockEnabled = true;
                                mapView.popup.set("dockOptions", {
                                    position: "bottom-right",
                                    buttonEnabled: false
                                });
                                mapView.popup.open({
                                    features: [selectedFeature]
                                });
                            })
                            .catch((error) => {
                                if (error.name != "AbortError") {
                                    console.log(error);
                                }
                            });
                    });
            });        
    });

    function selectedFeatureProfile (vertices) {
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
                width: "0",
                style: "short-dash"
            }
        });
        
        elevationProfile.input = graphic;
    }

    function selectedFeatureTable (vertices) {
        $("#waypoint-table tbody tr").remove();

        for (let vert of vertices[0]) {
            let point = new Point ({
                hasZ: true,
                x: vert[0],
                y: vert[1],
                z: vert[2],
                spatialReference: mapView.spatialReference
            });
    
            let nextRow = $("#waypoint-table tbody")[0].insertRow(-1);
            let nextVert = nextRow.insertCell(0);
            let nextX = nextRow.insertCell(1);
            let nextY = nextRow.insertCell(2);
            let nextZ = nextRow.insertCell(3);
    
            nextVert.innerHTML = nextRow.rowIndex
            nextX.innerHTML = point.longitude.toFixed(6);
            nextX.setAttribute("contentEditable", "true");
            nextY.innerHTML = point.latitude.toFixed(6);
            nextY.setAttribute("contentEditable", "true");
            nextZ.innerHTML = (point.z * 3.281).toFixed(0);
            nextZ.setAttribute("contentEditable", "true");
        }
    }

    function editRouteAttributes () {
        if (!editor.activeWorkflow) {
            mapView.popup.visible = false;
            editor.startUpdateWorkflowAtFeatureEdit(
                mapView.popup.selectedFeature
            );
            mapView.ui.add(editor, "bottom-right");
        }

        reactiveUtils.when(
            () => editor.viewModel.state === "ready",
            () => {
                mapView.ui.remove(editor);
               mapView.popup.open({
                    features: [selectedFeature],
                    shouldFocus: true
                });
                $("#save-vertices").css("display", "none");

            }
        );
    }

    function editRoutePath () {
        $("#waypoint-list").css("display", "block");
    }

    reactiveUtils.on(
        () => mapView.popup,
        "trigger-action",
        (event) => {
            if (event.action.id === "edit-attributes") {
                $("#save-vertices").css("display", "block");
                editRouteAttributes();
                editRoutePath();
            }
        }
    );

    reactiveUtils.watch(
      () => mapView.popup?.visible,
      (event) => {
        if (editor.viewModel.state === "editing-existing-feature") {
          mapView.popup.close();
        }
      }
    );
    
    supernalRoutesLyr.on("apply-edits", (evt) => {
        if (evt.edits.addFeatures) {
            // Delete the current list of existing routes
            $("#existing-routes").empty();
            // Repopulate existing routes list with new values after 1 second delay
            setTimeout(()=> {
                populateExistingRoutes();
            }, 1000);
        } else if (evt.edits.updateFeatures) {
            drawPath(selectedFeature.geometry.paths);
            selectedFeatureTable(selectedFeature.geometry.paths);
        } else if (evt.edits.deleteFeatures) {
            //editor.viewModel.cancelWorkflow();
            //mapView.ui.remove(editor);
            // Delete the current list of existing routes
            $("#existing-routes").empty();
            // Repopulate existing routes list with new values after 1 second delay
            setTimeout(()=> {
                populateExistingRoutes();
            }, 10);
        }
    });


    /********** Elevation Profile Widget **********/

    const elevationProfile = new ElevationProfile({
        view: mapView,
        profiles: [
          {
            type: "ground"
          },
          {
            type: "input",
            title: "Flight Plan"
          }
        ],
        visibleElements: {
            legend: false,
            clearButton: false,
            settingsButton: false,
            sketchButton: false,
            selectButton: false,
            uniformChartScalingToggle: false
        },
        container: "elevation-profile",
        unit: "imperial"
    });

    const elevationProfile3D = new ElevationProfile({
        view: sceneView,
        profiles: [
          {
            type: "ground"
          }
        ]
    });

    /********** Synchronize 2D & 3D Views **********/

    const views = [mapView, sceneView];
    let activeView;

    const sync = (source) => {
        if (!activeView || !activeView.viewpoint || activeView !== source) {
            return;
        }

        for (const view of views) {
            if (view !== activeView) {
                view.viewpoint = activeView.viewpoint;
            }
        }
    };

    for (const view of views) {
        view.watch(["interacting", "animation"],
        () => {
            activeView = view;
            sync(activeView);
        });

        view.watch("viewpoint", () => sync(view));
    }

    /********** Conversion From 2D & 3D **********/

    $("#switch-btn").on("click", (evt) => {
        let active = mapView.container.id;
        console.log(evt)
        if (active == "view-div") {
            to3DView();
            evt.currentTarget.value = "2D";
        } else {
            to2DView();
            evt.currentTarget.value = "3D";
        }
    });

    function to2DView () {
        mapView.container = "view-div";
        sceneView.container = "inset-div";
    }

    function to3DView () {
        mapView.container = "inset-div";
        sceneView.container = "view-div";
    }
});