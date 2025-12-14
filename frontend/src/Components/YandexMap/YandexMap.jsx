import React, { useEffect } from "react";
import "./YandexMap.css"
const YandexMap = ({ destination }) => {
    useEffect(() => {
        const loadYandexMaps = () => {
            
            if (window.ymaps) {
                init();
            } else {
                const script = document.createElement("script");
                script.src = "https://api-maps.yandex.ru/2.1/?apikey=73465fcb-e0fe-4f7b-86d2-0032b65994c2&lang=ru_RU";
                script.onload = () => {
                    window.ymaps.ready(init);
                };
                document.body.appendChild(script);
            }
        };

        const init = () => {
            if (document.getElementById("map").children.length === 0) {
                const myMap = new window.ymaps.Map("map", {
                    center: [48.8429545, 2.3143345], 
                    zoom: 11,
                    controls: []
                });

                const routePanelControl = new window.ymaps.control.RoutePanel({
                    options: {
                        showHeader: true,
                        title: "Проложить маршрут",
                        allowSwitch: true,
                        maxWidth: "180px",
                        float: "left"
                    }
                });

                const zoomControl = new window.ymaps.control.ZoomControl({
                    options: {
                        float: "right",
                        position: {
                            top: 245,
                            right: 10
                        }
                    }
                });

                const trafficControl = new window.ymaps.control.TrafficControl({
                    state: {
                        providerKey: "traffic#actual",
                        trafficShown: false
                    }
                });

                myMap.controls.add(routePanelControl).add(zoomControl).add(trafficControl);

                trafficControl.getProvider("traffic#actual").state.set("infoLayerShown", true);

                if (destination) {
                    routePanelControl.routePanel.getRouteAsync().then(function (route) {
                        route.model.setParams({ results: 1 }, true);
                        route.model.setParams({ avoidTrafficJams: true }, true);
                                               
                        route.model.setFrom({ 
                            point: myMap.getCenter() 
                        });
                        route.model.setTo({ 
                            point: destination 
                        });

                        route.model.events.add('requestsuccess', function () {
                            var activeRoute = route.getActiveRoute();
                            if (activeRoute) {
                                activeRoute.balloon.open();
                            }
                        });
                    });
                }
            }
        };

        loadYandexMaps();

        return () => {
            const mapContainer = document.getElementById("map");
            if (mapContainer) {
                mapContainer.innerHTML = "";
            }
        };
    }, [destination]);

    return <div id="map"  className="yandex-map"/>;
};

export default YandexMap;