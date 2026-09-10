import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup
} from "react-leaflet";

import "leaflet/dist/leaflet.css";


function getStateColor(state) {

  switch (state) {

    case "CHARGING":
      return "green";

    case "DISCHARGING":
      return "orange";

    case "FAULT":
      return "red";

    case "IDLE":
      return "gray";

    default:
      return "blue";
  }
}


function GridMap({ nodes = [] }) {

  return (

    <div className="map-wrapper">

      <div className="map-header">

        <div>

          <h2>
            Live Grid Map
          </h2>

          <p>
            {nodes.length} IoT Nodes
          </p>

        </div>


        <div className="legend">

          <span>🟢 Charging</span>

          <span>🟠 Discharging</span>

          <span>⚪ Idle</span>

          <span>🔴 Fault</span>

        </div>

      </div>


      <MapContainer

        center={[12.9716, 77.5946]}

        zoom={11}

        style={{
          height: "600px",
          width: "100%"
        }}

      >

        <TileLayer

          attribution="&copy; OpenStreetMap contributors"

          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

        />


        {nodes.map((node) => (

          <CircleMarker

            key={node.id}

            center={[
              node.latitude,
              node.longitude
            ]}

            radius={7}

            pathOptions={{
              color: getStateColor(node.state),
              fillColor: getStateColor(node.state),
              fillOpacity: 0.8
            }}

          >

            <Popup>

              <h3>
                {node.name}
              </h3>

              <p>
                <strong>State:</strong>{" "}
                {node.state}
              </p>

              <p>
                <strong>Power:</strong>{" "}
                {node.powerOutput} kW
              </p>

              <p>
                <strong>Battery:</strong>{" "}
                {node.batteryLevel}%
              </p>

              <p>
                <strong>Grid Load:</strong>{" "}
                {node.gridLoad}%
              </p>

              <p>
                <strong>Latitude:</strong>{" "}
                {node.latitude.toFixed(5)}
              </p>

              <p>
                <strong>Longitude:</strong>{" "}
                {node.longitude.toFixed(5)}
              </p>

            </Popup>

          </CircleMarker>

        ))}

      </MapContainer>

    </div>
  );
}

export default GridMap;