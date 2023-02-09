import { MapContainer, TileLayer, useMap, Marker, Popup, Polygon, LayerGroup, useMapEvents, LayersControl } from 'react-leaflet';
import { useState, useEffect, useMemo, useRef } from 'react';
import L from 'leaflet';
import "../css/map.css";
import test from "../assets/react.svg"

export default function Map() {
    const [latitude, setLatitude] = useState(0.0);
    const [longitude, setLongitude] = useState(0.0);
    const [status, setStatus] = useState("");
    const [points, setPoints] = useState([]);
    const [flags, setFlags] = useState([]);
    const [clickMode, setClickMode] = useState("flag");
    const markerRef = useRef([]);
    const flagsRef = useRef([]);

    var polygon = [
        points.map((point) => {
            return [point.lat, point.lng]
        })
    ]

    useEffect(() => {
        getLocation();
    }, [])

    const getLocation = () => {
        if (!navigator.geolocation) {
            setStatus('Votre navigateur ne supporte pas la géolocalisation');
        }
        else {
            setStatus("Localisation...");
            navigator.geolocation.getCurrentPosition((position) => {
                console.log(position);
                setLatitude(position.coords.latitude);
                setLongitude(position.coords.longitude);
                setStatus(null);
            }, () => {
                setStatus("Impossible de récupérer votre position");
            });
        }
    }

    const markerIcon = new L.icon({
        iconUrl: test,
        iconSize: [25],
        iconAnchor: [0, 0]
    })

    const changeMode = () => {
        if (clickMode == "flag") {
            setClickMode("zone");
            document.getElementById("btnChangeMode").innerText = "Zone de jeu";
        }
        else {
            setClickMode("flag");
            document.getElementById("btnChangeMode").innerText = "Drapeau";
        }
    }

    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current[0]
                if (marker != null) {
                    console.log(marker.getLatLng());
                }
            },
            drag() {
                const marker = markerRef.current[0]
                var pointsTemp = [...points];
                pointsTemp[0] = { lat: marker.getLatLng().lat, lng: marker.getLatLng().lng }
                setPoints(pointsTemp);
            }
        }),
        [],
    )

    const eventHandlersMarker = {
        drag(index) {
            const marker = markerRef.current[index]
            var pointsTemp = [...points];
            pointsTemp[index] = { lat: marker.getLatLng().lat, lng: marker.getLatLng().lng }
            setPoints(pointsTemp);
        },
        click(index) {
            console.log(index);
            var pointsTemp = [...points];
            pointsTemp.splice(index, 1);
            setPoints(pointsTemp);
        }
    }

    const dragMarker = (index) => {
        const marker = markerRef.current[index]
        var pointsTemp = [...points];
        pointsTemp[index] = { lat: marker.getLatLng().lat, lng: marker.getLatLng().lng }
        setPoints(pointsTemp);
    }

    const removeMarker = (index) => {
        var pointsTemp = [...points];
        pointsTemp.splice(index, 1);
        setPoints(pointsTemp);
    }

    const dragFlag = (index) => {
        const marker = flagsRef.current[index]
        var flagsTemp = [...flags];
        flagsTemp[index] = { lat: marker.getLatLng().lat, lng: marker.getLatLng().lng }
        setFlags(flagsTemp);
    }

    const removeFlag = (index) => {
        setTimeout(() => {
            var flagsTemp = [...flags];
            flagsTemp.splice(index, 1);
            setFlags(flagsTemp);
        }, 1)
    }

    const layerListener = {
        add: (e) => {
            console.log("Added Layer:", e.target);
        },
        remove: (e) => {
            console.log("Removed layer:", e.target);
        }
    }

    function ClickController() {
        const map = useMapEvents({
            click: (e) => {
                if (clickMode == "flag") {
                    var flagsTemp = [...flags];
                    flagsTemp.push({ lat: e.latlng.lat, lng: e.latlng.lng });
                    setFlags(flagsTemp);
                }
                else {
                    var pointsTemp = [...points];
                    pointsTemp.push({ lat: e.latlng.lat, lng: e.latlng.lng });
                    setPoints(pointsTemp);
                    //map.locate(); //Géolocalisation
                }
            },
            locationfound: (location) => {
                //console.log('location found:', location);
                /*var pointsTemp = [...points];
                pointsTemp.push({ lat: location.latitude, lng: location.longitude });
                polygon.push({ lat: location.latitude, lng: location.longitude });
                setPoints(pointsTemp);*/
            },
        })
        return null
    }

    return (status == null ? <>
        <MapContainer center={[latitude, longitude]} zoom={16}>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LayersControl position="topright" >
                <LayersControl.Overlay checked name='Zone de jeu'>
                    <LayerGroup eventHandlers={layerListener}>
                        <Polygon pathOptions={{ color: 'purple' }} positions={polygon} />
                        {points.map((point, index) => {
                            return <Marker position={[point.lat, point.lng]} draggable={true} /*eventHandlers={eventHandlers}*/ eventHandlers={{ drag: () => dragMarker(index), click: () => removeMarker(index) }} ref={el => markerRef.current[index] = el} key={index} />
                        })}
                    </LayerGroup>
                </LayersControl.Overlay>
                <LayersControl.Overlay checked name='Drapeaux'>
                    <LayerGroup eventHandlers={layerListener}>
                        {flags.map((flag, index) => {
                            return <Marker position={[flag.lat, flag.lng]} key={index} draggable={true} eventHandlers={{ drag: () => dragFlag(index) }} ref={el => flagsRef.current[index] = el}>
                                <Popup>
                                    <button onClick={() => removeFlag(index)}>Supprimer</button>
                                </Popup>
                            </Marker>
                        })}
                    </LayerGroup>
                </LayersControl.Overlay>
            </LayersControl>
            <ClickController />
        </MapContainer>
        <button id='btnChangeMode' onClick={changeMode} style={{ position: 'absolute', zIndex: 2, marginTop: 10 }}>Drapeau</button>
    </> : <h1>{status}</h1>)
}