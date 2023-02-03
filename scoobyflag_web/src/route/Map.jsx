import { MapContainer, TileLayer, useMap, Marker, Popup, Polygon, LayerGroup, Circle, useMapEvents } from 'react-leaflet';
import { useState, useEffect, useMemo, useRef } from 'react';
import "../css/map.css";

export default function Map() {
    const [latitude, setLatitude] = useState(0.0);
    const [longitude, setLongitude] = useState(0.0);
    const [status, setStatus] = useState("");
    const [points, setPoints] = useState([{ lat: 48.53043400000001, lng: 7.7356274 }, { lat: 48.53, lng: 7.7 }, { lat: 48.55, lng: 7.75 }]);
    const markerRef = useRef([null, null, null]);

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

    useEffect(() => {
        getLocation();
    }, [])

    var polygon = [
        points.map((point) => {
            return [point.lat, point.lng]
        })
    ]

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
        console.log(index);
        var pointsTemp = [...points];
        pointsTemp.splice(index, 1);
        setPoints(pointsTemp);
        /*pointsTemp.push({ lat: e.latlng.lat, lng: e.latlng.lng });
        setPoints(pointsTemp);*/
    }

    function MyComponent() {
        const map = useMapEvents({
            click: (e) => {
                console.log(e.latlng);
                var pointsTemp = [...points];
                pointsTemp.push({ lat: e.latlng.lat, lng: e.latlng.lng });
                setPoints(pointsTemp);
                //map.locate(); //Géolocalisation
            },
            /*locationfound: (location) => {
                console.log('location found:', location);
                var pointsTemp = [...points];
                pointsTemp.push({ lat: location.latitude, lng: location.longitude });
                polygon.push({ lat: location.latitude, lng: location.longitude });
                setPoints(pointsTemp);
            },*/
        })
        return null
    }

    return (status == null ? <MapContainer center={[latitude, longitude]} zoom={13} >
        <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LayerGroup>
            <Polygon pathOptions={{ color: 'purple' }} positions={polygon} />
        </LayerGroup>
        <MyComponent />
        {/*<Marker position={[latitude, longitude]} draggable={true} eventHandlers={eventHandlers} ref={markerRef}>
            <Popup>
                C'est ici qu'on est.
            </Popup>
        </Marker>*/}
        {points.map((point, index) => {
            return <Marker position={[point.lat, point.lng]} draggable={true} /*eventHandlers={eventHandlers}*/ eventHandlers={{ drag: () => dragMarker(index), click: () => removeMarker(index) }} ref={el => markerRef.current[index] = el} key={index} />
        })}
        {/*<Marker position={[pointLat, pointLong]} draggable={true} eventHandlers={eventHandlers} ref={markerRef} />*/}
    </MapContainer> : <h1>{status}</h1>)
}