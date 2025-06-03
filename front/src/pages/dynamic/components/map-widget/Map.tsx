/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
// import icon from "@/assets/images/marker-icon.png";
// import iconRetina from "@/assets/images/marker-icon-2x.png";
// import shadow from "@/assets/images/marker-shadow.png";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

function WidgetMap({ locations }: any) {
  const [zoom, setZoom] = useState(17);
  const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
  });

  L.Marker.prototype.options.icon = DefaultIcon;
  useEffect(() => {
    setZoom(17);
  }, [locations]);
  // useEffect(() => {
  //   import("leaflet").then((L: any) => {
  //     delete L.Icon.Default.prototype._getIconUrl;
  //     delete L.Icon.Default.prototype._getIconRetinaUrl;
  //     delete L.Icon.Default.prototype._getShadowUrl;
  //     L.Icon.Default.mergeOptions({
  //       iconRetinaUrl: iconRetina,
  //       iconUrl: icon,
  //       shadowUrl: shadow,
  //     });
  //   });
  // }, []);

  return (
    <MapContainer
      center={[
        locations[0][locations[0].latitude],
        locations[0][locations[0].longitude],
      ]}
      zoom={zoom}
      //   style={{ height: "100%", width: "100%" }}
      className="flex-1 h-[90%] z-10 w-full overflow-hidden"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
        // url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <RecenterMap
        center={[
          locations[0][locations[0].latitude],
          locations[0][locations[0].longitude],
        ]}
        zoom={zoom}
      />
      {locations.map((loc: any, idx: number) => (
        <Marker key={idx} position={[loc[loc.latitude], loc[loc.longitude]]}>
          <Popup>{loc.label}</Popup>
        </Marker>
      ))}
      {/* <Marker position={position}>
        <Popup>A sample popup!</Popup>
      </Marker> */}
    </MapContainer>
  );
}

export default WidgetMap;

function RecenterMap({
  center,
  zoom,
}: {
  center: [number, number];
  zoom?: number;
}) {
  const map = useMap();

  useEffect(() => {
    map.setView(center);
    map.setZoom(zoom || 5);
  }, [center, map]);

  return null;
}
