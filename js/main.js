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
    "esri/layers/ElevationLayer",
    "esri/views/draw/Draw"

], (Portal, OAuthInfo, esriId, PortalQueryParams, SceneView, Map, MapView, Graphic, FeatureLayer, ElevationLayer, Draw) => {

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
        url: "https://services6.arcgis.com/ssFJjBXIUyZDrSYZ/arcgis/rest/services/NAVAIDSystem/FeatureServer/0"
    });
    
    const obstaclesLyr = new FeatureLayer ({
        url: "https://services6.arcgis.com/ssFJjBXIUyZDrSYZ/arcgis/rest/services/Digital_Obstacle_File/FeatureServer/0"
    });

    const classAirspaceLyr = new FeatureLayer ({
        url: "https://services6.arcgis.com/ssFJjBXIUyZDrSYZ/arcgis/rest/services/Class_Airspace/FeatureServer/0"
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

    const draw = new Draw ({
        view: mapView
    });

    $("#create-route").on("click", () => {
        console.log("Open Editing Toolbar");
        $("#route-toolbar").css("display", "block");
        mapView.graphics.removeAll();
    });

    $("#add-pt-btn").on("click", () => {
        mapView.focus();

        action.on(
            [
                "vertex-add",
                "vertex-remove",
                "cursor-update",
                "redo",
                "undo",
                "draw-complete"
            ]
        );

        function createRoute (evt) {
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
});