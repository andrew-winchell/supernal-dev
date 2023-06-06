require([
    "esri/portal/Portal",
    "esri/identity/OAuthInfo",
    "esri/identity/IdentityManager",
    "esri/portal/PortalQueryParams",
    "esri/views/SceneView",
    "esri/Map",
    "esri/views/MapView",
    "esri/Graphic",
    "esri/widgets/ElevationProfile"

], (Portal, OAuthInfo, esriId, PortalQueryParams, SceneView, Map, MapView, Graphic, ElevationProfile) => {

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

    const map = new Map ({
        basemap: "topo-vector",
        ground: "world-elevation",
        layers: []
    });

    const mapView = new MapView ({
        map: map,
        container: "view-div"
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

    mapView.on("pointer-down", getVertice);
    function getVertice (event) {
        view.hitTest(event)
            .then((response) => {
                if (response.results.length) {
                    console.log(response.results);
                }
            });
    }

});