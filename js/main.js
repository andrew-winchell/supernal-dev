require([
    "esri/portal/Portal",
    "esri/identity/OAuthInfo",
    "esri/identity/IdentityManager",
    "esri/portal/PortalQueryParams",
    "esri/views/SceneView",
    "esri/Map",
    "esri/views/MapView",
    "esri/Graphic",
    "esri/layers/FeatureLayer",
    "esri/layers/GeoJSONLayer",
    "esri/layers/ElevationLayer",
    "esri/views/draw/Draw"

], (Portal, OAuthInfo, esriId, PortalQueryParams, SceneView, Map, MapView, Graphic, FeatureLayer, GeoJSONLayer, ElevationLayer, Draw) => {

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
    
    const obstaclesLyr = new FeatureLayer ({
        url: "https://services6.arcgis.com/ssFJjBXIUyZDrSYZ/arcgis/rest/services/Digital_Obstacle_File/FeatureServer/0"
    });

    const classAirspaceLyr = new FeatureLayer ({
        url: "https://services6.arcgis.com/ssFJjBXIUyZDrSYZ/arcgis/rest/services/Class_Airspace/FeatureServer/0"
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
        layers: [navaidsLyr]
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

    $("#create-route").on("click", () => {
        console.log("Open Waypoint List");
        $("#waypoint-list").css("display", "block");
        $("#route-toolbar").css("display", "block");
        mapView.graphics.removeAll();        
    });

    const draw = new Draw ({
        view: mapView
    });

    $("#add-pt-btn").on("click", () => {
        mapView.focus();

        const action = draw.create("polyline");
        action.on (
            [
                "vertex-add"
            ],
            createVertice
        )
    });

    function createVertice () {
        mapView.when(() => {
            mapView.on("pointer-down", (e) => {
                const opts = {
                    include: [navaidsLyr]
                };
                mapView.hitTest(e, opts)
                    .then((response) => {
                        if (response.results.length == 1) {
                        
                            console.log(response.results[0].graphic.geometry);
                        } else if (response.results.length > 1) {
                            $("#hittest_many")[0].open = true;
                        } else {
                            $("#hittest_zero")[0].open = true;
                        }
                    })
            })
        });
    }

    /*
    $("#add-pt-btn").on("click", () => {
        action.on(
            [
                "vertex-add",
                "vertex-remove",
                "cursor-update",
                "redo",
                "undo",
                "draw-complete"
            ],
            createRoute
        );

        function createRoute (evt) {
            console.log(evt)
            const vertices = evt.vertices;
            mapView.graphics.removeAll();

            const graphic = new Graphic ({
                geometry: {
                    type: "polyline",
                    paths: vertices,
                    spatialReference: mapView.spatialReference
                },
                symbol: {
                    type: "simple-line",
                    color: [0,0,0],
                    width: 4,
                    cap: "round",
                    join: "round"
                }
            });

            mapView.graphics.add(graphic);
        }

        
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