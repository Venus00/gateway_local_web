/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import icon from "@/assets/images/marker-icon.png";
import iconRetina from "@/assets/images/marker-icon-2x.png";
import shadow from "@/assets/images/marker-shadow.png";
// import type { MapContainerProps } from "react-leaflet";
function DevicesMap({ locations }: any) {
  //   const position = [51.505, -0.09]; // Default position (London)
  useEffect(() => {
    import("leaflet").then((L: any) => {
      delete L.Icon.Default.prototype._getIconUrl;
      delete L.Icon.Default.prototype._getIconRetinaUrl;
      delete L.Icon.Default.prototype._getShadowUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: iconRetina,
        iconUrl: icon,
        shadowUrl: shadow,
      });
    });
  }, []);
  return (
    <MapContainer
      center={locations[0].pos}
      zoom={5}
      //   style={{ height: "100%", width: "100%" }}
      className="flex-1 h-[90%] min-h-[400px] z-10 w-full overflow-hidden"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
        // url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {locations.map((loc: any, idx: number) => (
        <Marker key={idx} position={loc.pos}>
          <Popup>{loc.name}</Popup>
        </Marker>
      ))}
      {/* <Marker position={position}>
        <Popup>A sample popup!</Popup>
      </Marker> */}
    </MapContainer>
  );
}

export default DevicesMap;
