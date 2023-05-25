require([
    "esri/portal/Portal",
    "esri/identity/OAuthInfo",
    "esri/identity/IdentityManager",
    "esri/portal/PortalQueryParams",
    "esri/WebScene",
    "esri/views/SceneView",
    "esri/widgets/ElevationProfile"
], (Portal, OAuthInfo, esriId, PortalQueryParams, WebScene, SceneView, ElevationProfile) => {

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

    const webscene = new WebScene({
        portalItem: { id: "d6127f4244ba4c838e726a7c0c1efe40" }
    });

    const view = new SceneView({
        container: "view-div",
        map: webscene,
        camera: {
            position: {
                spatialReference: { latestWkid: 3857, wkid: 102100 },
                x: -8238359,
                y: 4967229,
                z: 686
            },
            heading: 353,
            tilt: 66
        }
    });

    const elevationProfile = new ElevationProfile({
        view: view,
        profiles: [
            {
                type: "ground"
            }
        ],
        visibleElements: {
            selectButton: true
        }
    });

    view.ui.add(elevationProfile, "top-right");
});