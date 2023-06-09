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
    "esri/widgets/Sketch"

], (Portal, OAuthInfo, esriId, PortalQueryParams, SceneView, Map, MapView, Graphic, GraphicsLayer, FeatureLayer, GeoJSONLayer, ElevationLayer, Draw, LayerList, Sketch) => {

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
        }
    });
    
    const obstaclesSymbol = {
        type: "simple",
        symbol: {
            type: "picture-marker",
            url: "media/obstacle.png",
            contentType: "image/png",
            width: "24px",
            height: "36.66px"
        }
    }
    const obstaclesLyr = new FeatureLayer ({
        url: "https://services6.arcgis.com/ssFJjBXIUyZDrSYZ/arcgis/rest/services/Digital_Obstacle_File/FeatureServer/0",
        title: "OBSTACLES",
        renderer: obstaclesSymbol
    });

    const classAirspaceLyr = new FeatureLayer ({
        url: "https://services6.arcgis.com/ssFJjBXIUyZDrSYZ/arcgis/rest/services/Class_Airspace/FeatureServer/0"
    });
    
    const graphicsLyr = new GraphicsLayer ({
        title: "Proposed Route",
        graphics: [],
        snappingOptions: {
            enabled: true,
            featureSources: [{ layer: navaidsLyr, enabled: true }]
        }
    });

    const route = new GeoJSONLayer ({
        title: "Proposed Route",
        id: "route",
        hasZ: true,
        elevationInfo: {
            mode: "relative-to-ground"
        }
    });

    const map = new Map ({
        basemap: "topo-vector",
        ground: "world-elevation",
        layers: [navaidsLyr, obstaclesLyr, graphicsLyr]
    });

    const mapView = new MapView ({
        map: map,
        container: "view-div",
        zoom: 4,
        center: [-97, 39]
    });

    const sceneView = new SceneView ({
        map: map
    });

    const appConfig = {
        mapView: mapView,
        sceneView: sceneView,
        activeView: null,
        container: "view-div"
    };
    appConfig.activeView = appConfig.mapView;

    let layerlist = new LayerList ({
        view: mapView
    });

    mapView.ui.add(layerlist, { position: "top-right" });

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
        type: "simple-point",
        color: [255, 0, 0],
        size: 4
    }

    $("#create-route").on("click", () => {
        mapView.ui.add(pointSketch, "top-right");
    })

    /*  POLYLINE SKETCH SECTION WORKING
    const sketch = new Sketch ({
        layer: graphicsLyr,
        view: mapView,
        availableCreateTools: ["polyline"],
        snappingOptions: {
            enabled: true,
            featureSources: [
                {
                    layer: navaidsLyr,
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
    sketch.viewModel.polylineSymbol = {
        type: "simple-line",
        color: [0, 200, 200],
        width: 3,
        cap: "round",
        join: "round"
      }

    $("#create-route").on("click", () => {
        //console.log("Open Waypoint List");
        //$("#waypoint-list").css("display", "block");

        mapView.ui.add(sketch, "top-right");
    });

    sketch.on("create", (evt) => {
        if (evt.state === "complete") {
            console.log("Route Complete");
            mapView.ui.remove(sketch);
        } else if (evt.toolEventInfo.type === "vertex-add") {
            let mapPt = evt.graphic.geometry.paths[0].slice(-1);
            selectVertice(mapView.toMap(mapPt))
            console.log(mapPt)
            //console.log(evt.graphic.geometry.paths[0],evt.graphic.geometry.paths[0].slice(-1))
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
    */

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
});