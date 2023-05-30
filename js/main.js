require([
    "esri/portal/Portal",
    "esri/identity/OAuthInfo",
    "esri/identity/IdentityManager",
    "esri/portal/PortalQueryParams",
    "esri/WebScene",
    "esri/views/SceneView",
    "esri/WebMap",
    "esri/views/MapView",
    "esri/Graphic",
    "esri/widgets/ElevationProfile"

], (Portal, OAuthInfo, esriId, PortalQueryParams, WebScene, SceneView, WebMap, MapView, Graphic, ElevationProfile) => {

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

    const map = new WebMap ({
        portalItem: { id: "171dfe2e5be048fd920a0ece55cbd5b8" }
    });

    const view = new MapView ({
        map: map,
        container: "view-div"
    });

    view.on("pointer-down", getVertice);
    function getVertice (event) {
        view.hitTest(event)
            .then((response) => {
                if (response.results.length) {
                    console.log(response.results);
                }
            });
    }

});