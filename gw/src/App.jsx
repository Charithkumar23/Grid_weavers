import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet.heat/dist/leaflet-heat.js";

import L from "leaflet";

import "./App.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const DEVICE_STATUS_COLORS = {
  CHARGING: "#16a34a",
  DISCHARGING: "#dc2626",
  IDLE: "#2563eb",
  FAULT: "#f59e0b",
};

function getDeviceIcon(state) {
  const normalized = String(state || "UNKNOWN").toUpperCase();
  const color = DEVICE_STATUS_COLORS[normalized] || "#64748b";
  const label = Object.prototype.hasOwnProperty.call(
    DEVICE_STATUS_COLORS,
    normalized
  ) ? normalized : "UNKNOWN";

  return L.divIcon({
    className: "gridweaver-node-icon",
    html: `<div class="gw-map-marker" style="--marker-color: ${color}">
      <span class="gw-map-marker-dot"></span>
      <span class="gw-map-marker-label">${label}</span>
    </div>`,
    iconSize: [124, 30],
    iconAnchor: [7, 15],
    popupAnchor: [0, -12],
  });
}

function HeatmapLayer({ devices, locations }) {
  const map = useMap();

  useEffect(() => {
    if (!devices.length) {
      return;
    }

    const points = devices.map((device, index) => {
      let intensity = 0.2;

      if (device.state === "FAULT") {
        intensity = 1.0;
      } else if (device.state === "DISCHARGING") {
        intensity = 0.8;
      } else if (device.state === "CHARGING") {
        intensity = 0.5;
      } else if (device.state === "IDLE") {
        intensity = 0.2;
      }

      const [lat, lng] =
        locations[index % locations.length];

      return [lat, lng, intensity];
    });

    const heatLayer = L.heatLayer(points, {
      radius: 40,
      blur: 30,
      maxZoom: 12,
      max: 1.0,
      minOpacity: 0.35,
      gradient: {
        0.2: "#3b82f6",
        0.4: "#22c55e",
        0.6: "#facc15",
        0.8: "#f97316",
        1.0: "#ef4444",
      },
    });

    heatLayer.addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [devices, locations, map]);

  return null;
}
function App() {
  const [devices, setDevices] = useState([]);

  const [totalDevices, setTotalDevices] = useState(0);
  const [totalPower, setTotalPower] = useState(0);
  const [averageBattery, setAverageBattery] = useState(0);

  const [chargingDevices, setChargingDevices] = useState(0);
  const [dischargingDevices, setDischargingDevices] = useState(0);
  const [idleDevices, setIdleDevices] = useState(0);
  const [faultDevices, setFaultDevices] = useState(0);

  const [webSocketStatus, setWebSocketStatus] =
    useState("Connecting...");

  useEffect(() => {
    fetch("/api/devices")
      .then((response) => response.json())
      .then((data) => {
        console.log("DEVICES FROM BACKEND:", data);

        setDevices(data);
        setTotalDevices(data.length);

        const power = data.reduce(
          (total, device) =>
            total + Number(device.solarPower || 0),
          0
        );

        const battery =
          data.length > 0
            ? data.reduce(
                (total, device) =>
                  total + Number(device.batteryLevel || 0),
                0
              ) / data.length
            : 0;

        setTotalPower(power);
        setAverageBattery(battery);

        setChargingDevices(
          data.filter(
            (device) => device.state === "CHARGING"
          ).length
        );

        setDischargingDevices(
          data.filter(
            (device) => device.state === "DISCHARGING"
          ).length
        );

        setIdleDevices(
          data.filter(
            (device) => device.state === "IDLE"
          ).length
        );

        setFaultDevices(
          data.filter(
            (device) => device.state === "FAULT"
          ).length
        );
      })
      .catch((error) => {
        console.error("Backend error:", error);
      });

    const client = new Client({
      brokerURL: "ws://localhost:8080/ws",

      reconnectDelay: 5000,

      onConnect: () => {
        console.log("WebSocket connected");

        setWebSocketStatus("Live");

        client.subscribe(
          "/topic/devices",
          (message) => {
            const payload =
              JSON.parse(message.body);

            console.log(
              "LIVE TELEMETRY:",
              payload
            );

            setTotalDevices(
              payload.totalDevices
            );

            setTotalPower(
              payload.totalSolarPower
            );

            setAverageBattery(
              payload.averageBattery
            );

            setChargingDevices(
              payload.charging
            );

            setDischargingDevices(
              payload.discharging
            );

            setIdleDevices(
              payload.idle
            );

            setFaultDevices(
              payload.fault
            );

            setDevices(
              payload.devices
            );
          }
        );
      },

      onDisconnect: () => {
        console.log(
          "WebSocket disconnected"
        );

        setWebSocketStatus(
          "Disconnected"
        );
      },

      onStompError: (frame) => {
        console.error(
          "WebSocket error:",
          frame
        );

        setWebSocketStatus("Error");
      },

      onWebSocketError: (error) => {
        console.error(
          "WebSocket connection error:",
          error
        );

        setWebSocketStatus("Error");
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

  const gridStatus =
    faultDevices > totalDevices * 0.1
      ? "WARNING"
      : "STABLE";

  const locations = [
    [17.385, 78.4867],
    [17.4399, 78.4983],
    [17.4919, 78.3987],
    [17.4483, 78.3915],
    [17.4933, 78.3915],
    [17.5229, 78.3674],
    [17.5497, 78.487],
    [17.533, 78.442],
    [17.5048, 78.466],
    [17.6292, 78.481],
    [17.4965, 78.449],
    [17.4602, 78.353],
    [17.4947, 78.399],
    [17.4535, 78.372],
    [17.518, 78.456],
    [17.568, 78.477],
    [17.4707, 78.429],
    [17.425, 78.523],
    [17.517, 78.393],
    [17.44, 78.412],
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">⚡</span><div><strong>GridWeaver</strong><small>IoT Microgrid</small></div></div>
        <nav className="side-nav">
          <div className="nav-item active"><span>⌂</span> Home</div>
          <div className="nav-item"><span>⌁</span> Devices</div>
          <div className="nav-item"><span>▧</span> Map</div>
          <div className="nav-item"><span>▥</span> Analytics</div>
          <div className="nav-item"><span>⚙</span> Settings</div>
        </nav>
        <div className="sidebar-foot"><span className="status-dot live"></span> Monitoring active</div>
      </aside>
      <main className="dashboard">
      <header className="header">

        <div>

          <h1>
            ⚡ GridWeaver
          </h1>

          <p>
            Virtual Thread IoT Microgrid State Engine
          </p>

        </div>

        <div className="status">

          <span
            className={`status-dot ${
              webSocketStatus === "Live"
                ? "live"
                : "offline"
            }`}
          ></span>

          System {webSocketStatus}

        </div>

      </header>

      <section className="stats">

        <div className="card">

          <h3>
            IoT Devices
          </h3>

          <strong>
            {totalDevices.toLocaleString()}
          </strong>

          <span>
            Virtual Devices Processed
          </span>

        </div>

        <div className="card">

          <h3>
            Solar Power
          </h3>

          <strong>
            {totalPower.toFixed(1)} kW
          </strong>

          <span>
            Total Generation
          </span>

        </div>

        <div className="card">

          <h3>
            Battery Level
          </h3>

          <strong>
            {averageBattery.toFixed(1)}%
          </strong>

          <span>
            Average Battery
          </span>

        </div>

        <div className="card">

          <h3>
            Grid Status
          </h3>

          <strong
            className={
              gridStatus === "STABLE"
                ? "stable"
                : "warning"
            }
          >
            {gridStatus}
          </strong>

          <span>
            Current Condition
          </span>

        </div>

      </section>

      <section className="content">

        <div className="map-section">

          <h2>
            Live Microgrid Map
          </h2>
          <p className="map-subtitle">
            Status labels appear beside each device marker. Select a marker for device details.
          </p>

          <MapContainer
            center={[17.385, 78.4867]}
            zoom={11}
            className="map"
          >

            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <HeatmapLayer
              devices={devices}
              locations={locations}
            />

            {devices.map(
              (device, index) => (

                <Marker
                  key={device.deviceId}
                  position={
                    locations[
                      index % locations.length
                    ]
                  }
                  icon={getDeviceIcon(device.state)}
                >

                  <Popup>

                    <strong>
                      {device.deviceId}
                    </strong>

                    <br />

                    Location:{" "}
                    {device.location}

                    <br />

                    Solar Power:{" "}
                    {device.solarPower} kW

                    <br />

                    Battery:{" "}
                    {device.batteryLevel}%

                    <br />

                    State:{" "}
                    {device.state}

                  </Popup>

                </Marker>

              )
            )}

          </MapContainer>

          <div className="map-legend" aria-label="Device status legend">
            <span><i className="legend-dot charging"></i> Charging</span>
            <span><i className="legend-dot discharging"></i> Discharging</span>
            <span><i className="legend-dot idle"></i> Idle</span>
            <span><i className="legend-dot fault"></i> Fault</span>
            <span><i className="legend-dot unknown"></i> Unknown</span>
          </div>
          <p className="map-note">
            Map positions are illustrative sample locations, not live GPS coordinates.
          </p>

        </div>

        <div className="devices">

          <h2>
            Device Status
          </h2>

          <p
            style={{
              color: "#64748b",
              fontSize: "13px",
              marginTop: "-8px",
              marginBottom: "16px",
            }}
          >
            Showing 20 live sample devices
            from {totalDevices.toLocaleString()}{" "}
            virtual devices
          </p>

          {devices.map(
            (device) => (

              <div
                className="device-card"
                key={device.deviceId}
              >

                <div>

                  <strong>
                    {device.deviceId}
                  </strong>

                  <p>
                    {device.location}
                  </p>

                </div>

                <div className="device-data">

                  <span>
                    ☀️ {device.solarPower} kW
                  </span>

                  <span>
                    🔋 {device.batteryLevel}%
                  </span>

                  <span
                    className={`state ${
                      device.state === "CHARGING"
                        ? "charging"
                        : device.state ===
                          "DISCHARGING"
                        ? "discharging"
                        : device.state ===
                          "FAULT"
                        ? "fault"
                        : ""
                    }`}
                  >
                    {device.state}
                  </span>

                </div>

              </div>

            )
          )}

        </div>

      </section>

      <section className="state-summary">

        <div className="summary-card">

          <h3>
            Charging
          </h3>

          <strong>
            {chargingDevices.toLocaleString()}
          </strong>

          <span>
            Devices
          </span>

        </div>

        <div className="summary-card">

          <h3>
            Discharging
          </h3>

          <strong>
            {dischargingDevices.toLocaleString()}
          </strong>

          <span>
            Devices
          </span>

        </div>

        <div className="summary-card">

          <h3>
            Idle
          </h3>

          <strong>
            {idleDevices.toLocaleString()}
          </strong>

          <span>
            Devices
          </span>

        </div>

        <div className="summary-card">

          <h3>
            Fault
          </h3>

          <strong>
            {faultDevices.toLocaleString()}
          </strong>

          <span>
            Devices
          </span>

        </div>

        <div className="summary-card">

          <h3>
            WebSocket
          </h3>

          <strong>
            {webSocketStatus}
          </strong>

          <span>
            Live Connection
          </span>

        </div>

      </section>
      </main>
    </div>
  );
}

export default App;