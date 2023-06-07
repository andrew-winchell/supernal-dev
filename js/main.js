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
            actions: [
                {
                    id: "add-waypoint",
                    image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAbCAYAAACN1PRVAAAAAXNSR0IArs4c6QAABEhJREFUSEtjZCARzJ8/n4OXl1f5w79/z59cu/ahoaHhH7FGMBJSOHPmTFZ+YeF0fm4+RXZ2DqO///6Ks7KxsjL8Z/jz4+ePfwyMDPd//vi5+/OXr49iIsPW4zMPr2UrV28oFxTgDeYXEFBTlJfj5+HhYeDk5EAx78uXLwwvX71meP367Z2PHz+d+vTx046wsMDF2CzFatnixasdxMQFs8TFxFxUVZUFubi4CAUAWP7+/YcMT549vfn27fuJgf4+09E1YVi2YsU6HUEh/gVqaqrGCvKyRFmCrOjfv38Mp8+e+/z+/Yc5nu6uRchyKJaBfSQh1GtkoG8kIiJMskXIGm7dvvPh1q07G319PBNg4iiW7dy1d5WammooNh/dSHNkkEqrh5vHrW7AwMwrgNdB5y9efnzrxs3ciIjQjSCFcMtWrFpXoa6qUmZgoCuIzQSQZX8+f2D4dvMCXFosKI1ByCOS4dOZAwx8Jg5gjAx+/PjBcPL0mXNvX78KCg4Ofgi2DJS8FZVUjlpbWZjiSgwgy0CG4gIas/ZjWAZS+/Dho78XL14p9vf3ngi2bMWaNTmK8gotZibG/LgMI9cysO9OnTnx6O1rf7BlW7fv6jU1NiwSFRXB6XJyLQMZeO78hYe3b90LAlu2b9+h/RYWpg7oGRbZZkosu37jFsPla9d6GUFlnYyswjkXZwdNfEmLEstevX7DcPbcuVbGNWvWaIuISWywt7VWIcYyDnk1sLIfD2+hKMeVQECKnj57znDhwpVVjEu3bBGU5hU4Zm9nrUHIMlA+gyXvj8d2MLzZvJDh99sXDMy8ggyyhd0MHDLKWI149/49w6lTZ6YyNjQ0MFlY2Vx2d3XWIsUyUoqX+w8fMVy9fK0KnEB27N6zxdrC3BtUquNL+sg+I8Wy23fufjp/7kIM2LKNm7fm62hrTVBSVKCJZUePnbx17+kjD7BlS5avClRWVOyyMDfBmUhgZSN6kUTIhx8+fGQ4cfr0Tk83V4hl4KDcuXepuppKlIKCHFb95Fp27uKlF7dv3IqPiAjdBbds1ar1sRJSYtXWlhbqTExMGBaSYxmoBr9w4dJGD3eXAJCBKFXM+o1bMiUlxTvNTU140W0j1bJ37z4wXLp8+fLzZ6/CoqJCbmBYBhLYvnN3n5KiQqKaqgpKZfVkRgPWagRbmIMsunzl6o0Xz5/ng4IPpgZrG2Tzlm0LpGVknDTUVWU5OVAbOIQSxKtXrxmuXrt55dXLF8XIFmH1GcywFStW+0tKS9YqyMkZiImJMnMQsBSU6u4/ePDy1as3J969/VABCzpkx+Ftyq1du1aehYUjgF+AP4KXl0eSk5NTXlhYiOH3r98MnFwcDJ8+fWb49evXp9ev37749Pnz/Q+fPvdGhQXtxuV7go1UkMZF69aJsf36L8PIyhTFy8314/9/RlVmZsZXv3/+efbt29crPxn/XYkLC7tPKIgBsVLQKzeww5cAAAAASUVORK5CYII=",
                    title: "Add Waypoint"
                }
            ],
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
        mapView.graphics.removeAll();

        mapView.when(() => {
            mapView.popup.watch("selectedFeature", (graphic) => {
                if (graphic) {
                    const graphicTemplate = graphic.getEffectivePopupTemplate();
                    console.log(graphic)
                }
            })
        });
    });

    /*
    const draw = new Draw ({
        view: mapView
    });

    
    $("#create-route").on("click", () => {
        console.log("Open Editing Toolbar");
        $("#route-toolbar").css("display", "block");
        mapView.graphics.removeAll();
    });

    $("#add-pt-btn").on("click", () => {
        const action = draw.create("polyline");

        mapView.focus();

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