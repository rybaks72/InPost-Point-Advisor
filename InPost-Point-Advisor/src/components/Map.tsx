import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { RecommendedPoint } from "../types/point";
import { useEffect } from "react";

type MapProps = {
    recommendedPoints : RecommendedPoint[];
    selectedPoint: RecommendedPoint | null;
    mapRef: React.RefObject<HTMLElement | null>;
}

function makeNumberedIcon(number: number) {
  return L.divIcon({
    className: "",
    html: `<div style="
      width:32px;height:32px;border-radius:50%;
      background:#172033;color:#f8ce27;
      display:flex;align-items:center;justify-content:center;
      font-weight:800;font-size:14px;font-family:system-ui,sans-serif;
      border:2px solid #f8ce27;box-shadow:0 2px 6px rgba(0,0,0,0.3);
    ">${number}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  });
}

function FlyToPoint({ point }: { point: RecommendedPoint | null }) {
  const map = useMap();
  useEffect(() => {
    if (point) {
      map.flyTo(
        [point.point.location.latitude, point.point.location.longitude],
        18,
        { duration: 1 }
      );
    }
  }, [point, map]);
  return null;
}

const DEFAULT_CENTER: [number, number] = [52.2297, 21.0122];

function Map({ recommendedPoints, selectedPoint, mapRef }: MapProps) {
    const hasPoints = recommendedPoints.length > 0;

  const center: [number, number] = hasPoints
    ? [
        recommendedPoints[0].point.location.latitude,
        recommendedPoints[0].point.location.longitude,
      ]
    : DEFAULT_CENTER;

  return (
    <>
        <section className="card map-card" ref={mapRef}>
            <div className="card-header">
                <h2>Map preview</h2>
                <p>Top 5 recommended points will be shown here.</p>
            </div>

            <MapContainer
                key={center.toString()}
                center={center}
                zoom={13}
                style={{ flex: 1, minHeight: "320px", borderRadius: "14px" }}
                scrollWheelZoom={true}
            >
                <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {recommendedPoints.map((rp, index) => (
                <Marker
                    key={rp.point.name}
                    position={[rp.point.location.latitude, rp.point.location.longitude]}
                    icon={makeNumberedIcon(index + 1)}
                >
                    <Popup>
                    <strong>{rp.point.name}</strong><br />
                    {rp.point.address_details?.street} {rp.point.address_details?.building_number}<br />
                    {rp.distanceKm.toFixed(1)} km · {rp.point.status}
                    </Popup>
                </Marker>
                ))}
                <FlyToPoint point={selectedPoint} />
            </MapContainer>
        </section>
    </>
  )
}

export default Map
