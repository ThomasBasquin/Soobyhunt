import { MapContainer, TileLayer, Marker, Popup, Polygon, LayerGroup, useMapEvents, LayersControl } from 'react-leaflet';
import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import "../css/map.css";
import flag from "../assets/react.svg";
import point from "../assets/vite.svg";
import pointInPolygon from "point-in-polygon";

export default function Map() {
    const [latitude, setLatitude] = useState(0.0);
    const [longitude, setLongitude] = useState(0.0);
    const [status, setStatus] = useState("");
    const [points, setPoints] = useState([]);
    const [flags, setFlags] = useState([]);
    const [clickMode, setClickMode] = useState("flag");
    const markerRef = useRef([]);
    const flagsRef = useRef([]);

    var polygon = points.map((point) => {
        return [point.lat, point.lng]
    })

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

    const flagIcon = new L.icon({
        iconUrl: flag,
        iconSize: [25, 25],
        iconAnchor: [12.5, 12.5]
    })

    const markerIcon = new L.icon({
        iconUrl: point,
        iconSize: [25, 25],
        iconAnchor: [12.5, 12.5]
    })

    const changeMode = (mode) => {
        if (mode == "flag") {
            setClickMode("flag");
        }
        else if (mode == "zone") {
            setClickMode("zone");
        }
        else if (mode == "items") {
            setClickMode("items");
        }
    }

    const dragMarker = (index) => {
        setTimeout(() => {
            const marker = markerRef.current[index]
            var pointsTemp = [...points];
            pointsTemp[index] = { lat: marker.getLatLng().lat, lng: marker.getLatLng().lng }
            setPoints(pointsTemp);
        }, 1)
    }

    const removeMarker = (index) => {
        var pointsTemp = [...points];
        pointsTemp.splice(index, 1);
        setPoints(pointsTemp);
    }

    const dragFlag = (index) => {
        setTimeout(() => {
            const marker = flagsRef.current[index]
            var flagsTemp = [...flags];
            flagsTemp[index] = { lat: marker.getLatLng().lat, lng: marker.getLatLng().lng }
            setFlags(flagsTemp);

            console.log(pointInPolygon([marker.getLatLng().lat, marker.getLatLng().lng], polygon))
        }, 1)
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
                            return <Marker position={[point.lat, point.lng]} draggable={true} eventHandlers={{ dragend: () => dragMarker(index), click: () => removeMarker(index) }} ref={el => markerRef.current[index] = el} key={index} icon={markerIcon} />
                        })}
                    </LayerGroup>
                </LayersControl.Overlay>
                <LayersControl.Overlay checked name='Drapeaux'>
                    <LayerGroup eventHandlers={layerListener}>
                        {flags.map((flag, index) => {
                            return <Marker position={[flag.lat, flag.lng]} key={index} draggable={true} eventHandlers={{ dragend: () => dragFlag(index) }} ref={el => flagsRef.current[index] = el} icon={flagIcon}>
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
        <div className='sideBar'>
            <div onClick={() => changeMode("zone")} className='btnSideBar'>Zone</div>
            <div onClick={() => changeMode("flag")} className='btnSideBar'>Drapeaux</div>
            <div onClick={() => changeMode("items")} className='btnSideBar'>Items</div>
        </div>
    </> : <h1>{status}</h1>)
}