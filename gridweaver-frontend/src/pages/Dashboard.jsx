import React, { useEffect, useMemo, useState } from "react";

import {
    Zap,
    BatteryCharging,
    ArrowDown,
    AlertTriangle,
    RefreshCw,
    Activity,
    Cpu,
    Wifi,
    Factory,
    Home,
    CheckCircle2,
    XCircle,
    Clock,
    Server,
} from "lucide-react";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import GridMap from "../components/GridMap";

import { api } from "../service/api";

import "./Dashboard.css";


function Dashboard() {

    // =====================================================
    // STATE
    // =====================================================

    const [devices, setDevices] = useState([]);
    const [batteries, setBatteries] = useState([]);
    const [grids, setGrids] = useState([]);
    const [events, setEvents] = useState([]);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const [lastUpdated, setLastUpdated] = useState(
        new Date()
    );


    // =====================================================
    // LOAD ALL DASHBOARD DATA
    // =====================================================

    const loadDashboardData = async () => {

        try {

            setRefreshing(true);
            setError("");

            const [
                devicesResponse,
                batteriesResponse,
                gridResponse,
                eventsResponse
            ] = await Promise.all([
                api.get("/devices"),
                api.get("/batteries"),
                api.get("/grid"),
                api.get("/events")
            ]);


            // -------------------------------
            // DEVICES
            // -------------------------------

            const deviceData = devicesResponse.data;

            if (Array.isArray(deviceData)) {

                setDevices(deviceData);

            } else {

                setDevices(
                    deviceData?.devices || []
                );

            }


            // -------------------------------
            // BATTERIES
            // -------------------------------

            const batteryData = batteriesResponse.data;

            if (Array.isArray(batteryData)) {

                setBatteries(batteryData);

            } else {

                setBatteries(
                    batteryData?.batteries || []
                );

            }


            // -------------------------------
            // GRID
            // -------------------------------

            const gridData = gridResponse.data;

            if (Array.isArray(gridData)) {

                setGrids(gridData);

            } else if (gridData) {

                setGrids([gridData]);

            } else {

                setGrids([]);

            }


            // -------------------------------
            // EVENTS
            // -------------------------------

            const eventData = eventsResponse.data;

            if (Array.isArray(eventData)) {

                setEvents(eventData);

            } else {

                setEvents(
                    eventData?.events || []
                );

            }


            setLastUpdated(new Date());

        } catch (err) {

            console.error(
                "Dashboard API Error:",
                err
            );

            setError(
                "Unable to load dashboard data. Make sure the Spring Boot backend is running."
            );

        } finally {

            setLoading(false);
            setRefreshing(false);

        }
    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadDashboardData();

    }, []);


    // =====================================================
    // DEVICE STATISTICS
    // =====================================================

    const totalNodes = devices.length;

    const onlineNodes = devices.filter(
        device =>
            String(device.status).toUpperCase() === "ONLINE"
    ).length;

    const offlineNodes = devices.filter(
        device =>
            String(device.status).toUpperCase() === "OFFLINE"
    ).length;

    const faultNodes = devices.filter(
        device =>
            ["FAULT", "ERROR", "CRITICAL"].includes(
                String(device.status).toUpperCase()
            )
    ).length;


    // =====================================================
    // POWER CALCULATIONS
    // =====================================================

    const deviceGeneration = devices.reduce(
        (total, device) =>
            total +
            Number(device.powerGeneration || 0),
        0
    );

    const deviceConsumption = devices.reduce(
        (total, device) =>
            total +
            Number(device.powerConsumption || 0),
        0
    );


    // =====================================================
    // GRID DATA
    // =====================================================

    const currentGrid = grids.length > 0
        ? grids[0]
        : null;


    const gridGeneration =
        Number(
            currentGrid?.generation ?? 0
        );

    const gridConsumption =
        Number(
            currentGrid?.consumption ?? 0
        );

    const gridLoad =
        Number(
            currentGrid?.load ?? 0
        );

    const batteryPower =
        Number(
            currentGrid?.batteryPower ?? 0
        );


    // =====================================================
    // USE GRID POWER WHEN AVAILABLE
    // OTHERWISE USE DEVICE TOTAL
    // =====================================================

    const totalGeneration =
        gridGeneration > 0
            ? gridGeneration
            : deviceGeneration;

    const totalConsumption =
        gridConsumption > 0
            ? gridConsumption
            : deviceConsumption;


    // =====================================================
    // BATTERY STATISTICS
    // =====================================================

    const chargingBatteries =
        batteries.filter(
            battery =>
                ["CHARGING", "CHARGE"].includes(
                    String(
                        battery.state ||
                        battery.status
                    ).toUpperCase()
                )
        ).length;


    const dischargingBatteries =
        batteries.filter(
            battery =>
                ["DISCHARGING", "DISCHARGE"].includes(
                    String(
                        battery.state ||
                        battery.status
                    ).toUpperCase()
                )
        ).length;


    const idleBatteries =
        batteries.filter(
            battery =>
                ["IDLE", "STANDBY"].includes(
                    String(
                        battery.state ||
                        battery.status
                    ).toUpperCase()
                )
        ).length;


    const batteryFaults =
        batteries.filter(
            battery =>
                ["FAULT", "ERROR", "CRITICAL"].includes(
                    String(
                        battery.state ||
                        battery.status
                    ).toUpperCase()
                )
        ).length;


    // =====================================================
    // GRID HEALTH
    // =====================================================

    const gridHealth =
        currentGrid?.health ||
        (
            gridLoad <= 80
                ? "GOOD"
                : gridLoad <= 90
                    ? "WARNING"
                    : "CRITICAL"
        );


    const gridStatus =
        currentGrid?.status ||
        (
            onlineNodes > 0
                ? "ONLINE"
                : "OFFLINE"
        );


    // =====================================================
    // CHART DATA
    // =====================================================

    const chartData = useMemo(() => {

        const generation = totalGeneration;
        const consumption = totalConsumption;

        return [
            {
                time: "10:00",
                generation: generation * 0.70,
                consumption: consumption * 0.68,
            },
            {
                time: "10:05",
                generation: generation * 0.78,
                consumption: consumption * 0.73,
            },
            {
                time: "10:10",
                generation: generation * 0.86,
                consumption: consumption * 0.79,
            },
            {
                time: "10:15",
                generation: generation * 0.92,
                consumption: consumption * 0.88,
            },
            {
                time: "10:20",
                generation: generation,
                consumption: consumption * 0.94,
            },
            {
                time: "10:25",
                generation: generation * 0.90,
                consumption: consumption,
            },
            {
                time: "10:30",
                generation: generation * 0.84,
                consumption: consumption * 1.02,
            },
        ];

    }, [
        totalGeneration,
        totalConsumption
    ]);


    // =====================================================
    // RECENT EVENTS
    // =====================================================

    const recentEvents =
        [...events]
            .sort(
                (a, b) =>
                    new Date(
                        b.eventTime || 0
                    ) -
                    new Date(
                        a.eventTime || 0
                    )
            )
            .slice(0, 6);


    // =====================================================
    // FORMAT NUMBER
    // =====================================================

    const formatNumber = (value) => {

        const number = Number(value || 0);

        return number.toLocaleString(
            "en-IN",
            {
                maximumFractionDigits: 1
            }
        );
    };


    // =====================================================
    // FORMAT TIME
    // =====================================================

    const formatTime = (value) => {

        if (!value) {
            return "--";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return date.toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }
        );
    };


    // =====================================================
    // LOADING SCREEN
    // =====================================================

    if (loading) {

        return (

            <div className="dashboard-layout">

                <Sidebar />

                <div className="dashboard-main">

                    <Navbar />

                    <div className="dashboard-loading">

                        <div className="loading-spinner"></div>

                        <h3>
                            Loading GridWeaver
                        </h3>

                        <p>
                            Connecting to microgrid services...
                        </p>

                    </div>

                </div>

            </div>

        );
    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="dashboard-layout">

            {/* SIDEBAR */}

            <Sidebar />


            {/* MAIN */}

            <div className="dashboard-main">

                {/* NAVBAR */}

                <Navbar />


                {/* CONTENT */}

                <main className="dashboard-content">


                    {/* =====================================
                        HEADER
                    ====================================== */}

                    <div className="dashboard-header">

                        <div>

                            <div className="title-row">

                                <h1>
                                    Grid Overview
                                </h1>

                                <span className="live-badge">

                                    <span className="live-dot"></span>

                                    LIVE

                                </span>

                            </div>

                            <p>
                                Real-time microgrid monitoring and control
                            </p>

                        </div>


                        <div className="header-right">

                            <div className="updated-time">

                                <Clock size={14} />

                                Updated{" "}

                                {lastUpdated.toLocaleTimeString(
                                    "en-IN",
                                    {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit"
                                    }
                                )}

                            </div>


                            <button
                                className="storm-btn"
                                onClick={loadDashboardData}
                                disabled={refreshing}
                            >

                                <RefreshCw
                                    size={16}
                                    className={
                                        refreshing
                                            ? "spin"
                                            : ""
                                    }
                                />

                                {refreshing
                                    ? "Refreshing..."
                                    : "Refresh Data"
                                }

                            </button>

                        </div>

                    </div>


                    {/* =====================================
                        ERROR
                    ====================================== */}

                    {error && (

                        <div className="dashboard-error">

                            <AlertTriangle size={18} />

                            <span>
                                {error}
                            </span>

                            <button
                                onClick={
                                    loadDashboardData
                                }
                            >
                                Retry
                            </button>

                        </div>

                    )}


                    {/* =====================================
                        STAT CARDS
                    ====================================== */}

                    <div className="stats-grid">


                        {/* TOTAL NODES */}

                        <StatCard
                            icon={<Cpu size={20} />}
                            iconClass="blue"
                            title="Total Nodes"
                            value={totalNodes}
                            description="All registered IoT nodes"
                        />


                        {/* ONLINE */}

                        <StatCard
                            icon={<Wifi size={20} />}
                            iconClass="green"
                            title="Online Nodes"
                            value={onlineNodes}
                            description={
                                `${onlineNodes} currently connected`
                            }
                        />


                        {/* GENERATION */}

                        <StatCard
                            icon={<Factory size={20} />}
                            iconClass="yellow"
                            title="Power Generation"
                            value={formatNumber(totalGeneration)}
                            unit="kW"
                            description="Current generation"
                        />


                        {/* CONSUMPTION */}

                        <StatCard
                            icon={<Home size={20} />}
                            iconClass="purple"
                            title="Consumption"
                            value={formatNumber(totalConsumption)}
                            unit="kW"
                            description="Current consumption"
                        />


                        {/* GRID LOAD */}

                        <StatCard
                            icon={<Activity size={20} />}
                            iconClass="orange"
                            title="Grid Load"
                            value={formatNumber(gridLoad)}
                            unit="%"
                            description="Current grid load"
                        />


                        {/* FAULTS */}

                        <StatCard
                            icon={<AlertTriangle size={20} />}
                            iconClass="red"
                            title="Faults"
                            value={faultNodes}
                            description={
                                `${batteryFaults} battery faults`
                            }
                        />

                    </div>


                    {/* =====================================
                        BATTERY + HEALTH
                    ====================================== */}

                    <div className="second-grid">


                        {/* BATTERY NETWORK */}

                        <div className="panel">

                            <div className="panel-header">

                                <div>

                                    <h2>
                                        Battery Network
                                    </h2>

                                    <p>
                                        Current battery state distribution
                                    </p>

                                </div>

                                <BatteryCharging
                                    size={20}
                                />

                            </div>


                            <div className="battery-grid">

                                <BatteryCard
                                    icon={
                                        <BatteryCharging
                                            size={22}
                                        />
                                    }
                                    className="charging"
                                    title="Charging"
                                    value={
                                        chargingBatteries
                                    }
                                />

                                <BatteryCard
                                    icon={
                                        <ArrowDown
                                            size={22}
                                        />
                                    }
                                    className="discharging"
                                    title="Discharging"
                                    value={
                                        dischargingBatteries
                                    }
                                />

                                <BatteryCard
                                    icon={
                                        <Activity
                                            size={22}
                                        />
                                    }
                                    className="idle"
                                    title="Idle"
                                    value={
                                        idleBatteries
                                    }
                                />

                                <BatteryCard
                                    icon={
                                        <AlertTriangle
                                            size={22}
                                        />
                                    }
                                    className="fault"
                                    title="Faults"
                                    value={
                                        batteryFaults
                                    }
                                />

                            </div>


                            <div className="battery-total">

                                <BatteryCharging
                                    size={16}
                                />

                                <span>
                                    Total Batteries
                                </span>

                                <strong>
                                    {batteries.length}
                                </strong>

                            </div>

                        </div>


                        {/* GRID HEALTH */}

                        <div className="panel">

                            <div className="panel-header">

                                <div>

                                    <h2>
                                        Grid Health
                                    </h2>

                                    <p>
                                        Current system condition
                                    </p>

                                </div>

                                <Activity
                                    size={20}
                                />

                            </div>


                            <div className="health-container">

                                <div
                                    className={`health-circle ${
                                        gridHealth
                                            .toLowerCase()
                                            .replace(
                                                /\s/g,
                                                "-"
                                            )
                                    }`}
                                >

                                    <div>

                                        <strong>
                                            {formatNumber(
                                                gridLoad
                                            )}%
                                        </strong>

                                        <span>
                                            GRID LOAD
                                        </span>

                                    </div>

                                </div>


                                <div className="health-list">


                                    <HealthRow
                                        dotClass="green-dot"
                                        title="Generation"
                                        value={`${formatNumber(
                                            totalGeneration
                                        )} kW`}
                                    />


                                    <HealthRow
                                        dotClass="blue-dot"
                                        title="Consumption"
                                        value={`${formatNumber(
                                            totalConsumption
                                        )} kW`}
                                    />


                                    <HealthRow
                                        dotClass="orange-dot"
                                        title="Battery Support"
                                        value={`${formatNumber(
                                            batteryPower
                                        )} kW`}
                                    />


                                    <HealthRow
                                        dotClass="red-dot"
                                        title="Faults"
                                        value={faultNodes}
                                    />


                                    <div className="health-status">

                                        {
                                            gridStatus
                                                .toUpperCase()
                                        }

                                        <span>
                                            •
                                        </span>

                                        {
                                            gridHealth
                                                .toUpperCase()
                                        }

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =====================================
                        POWER FLOW
                    ====================================== */}

                    <div className="panel power-panel">

                        <div className="panel-header">

                            <div>

                                <h2>
                                    Power Flow
                                </h2>

                                <p>
                                    Generation vs consumption
                                </p>

                            </div>

                            <span className="period">
                                Live Data
                            </span>

                        </div>


                        <div className="chart">

                            <ResponsiveContainer
                                width="100%"
                                height="100%"
                            >

                                <AreaChart
                                    data={chartData}
                                >

                                    <defs>

                                        <linearGradient
                                            id="generationGradient"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopOpacity={0.3}
                                            />

                                            <stop
                                                offset="95%"
                                                stopOpacity={0}
                                            />

                                        </linearGradient>

                                        <linearGradient
                                            id="consumptionGradient"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopOpacity={0.25}
                                            />

                                            <stop
                                                offset="95%"
                                                stopOpacity={0}
                                            />

                                        </linearGradient>

                                    </defs>


                                    <CartesianGrid
                                        strokeDasharray="4 4"
                                    />


                                    <XAxis
                                        dataKey="time"
                                    />


                                    <YAxis />


                                    <Tooltip />


                                    <Legend />


                                    <Area
                                        type="monotone"
                                        dataKey="generation"
                                        name="Generation"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#generationGradient)"
                                    />


                                    <Area
                                        type="monotone"
                                        dataKey="consumption"
                                        name="Consumption"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#consumptionGradient)"
                                    />

                                </AreaChart>

                            </ResponsiveContainer>

                        </div>

                    </div>


                    {/* =====================================
                        NODE OVERVIEW
                    ====================================== */}

                    <div className="panel">

                        <div className="panel-header">

                            <div>

                                <h2>
                                    Node Overview
                                </h2>

                                <p>
                                    Connected IoT infrastructure
                                </p>

                            </div>

                            <Server size={20} />

                        </div>


                        <div className="node-summary">

                            <div className="node-summary-card">

                                <div className="node-summary-icon">
                                    <CheckCircle2 />
                                </div>

                                <div>

                                    <span>
                                        Online
                                    </span>

                                    <strong>
                                        {onlineNodes}
                                    </strong>

                                </div>

                            </div>


                            <div className="node-summary-card">

                                <div className="node-summary-icon offline">
                                    <XCircle />
                                </div>

                                <div>

                                    <span>
                                        Offline
                                    </span>

                                    <strong>
                                        {offlineNodes}
                                    </strong>

                                </div>

                            </div>


                            <div className="node-summary-card">

                                <div className="node-summary-icon fault">
                                    <AlertTriangle />
                                </div>

                                <div>

                                    <span>
                                        Fault
                                    </span>

                                    <strong>
                                        {faultNodes}
                                    </strong>

                                </div>

                            </div>


                            <div className="node-summary-card">

                                <div className="node-summary-icon total">
                                    <Cpu />
                                </div>

                                <div>

                                    <span>
                                        Total
                                    </span>

                                    <strong>
                                        {totalNodes}
                                    </strong>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =====================================
                        MICROGRID MAP
                    ====================================== */}

                    <div className="panel grid-map-panel">

                        <div className="panel-header">

                            <div>

                                <h2>
                                    Microgrid Map
                                </h2>

                                <p>
                                    Real-time IoT node locations
                                </p>

                            </div>

                            <span className="map-live">

                                <span></span>

                                Live Nodes

                            </span>

                        </div>


                        <div className="grid-map-container">

                            <GridMap />

                        </div>

                    </div>


                    {/* =====================================
                        RECENT EVENTS
                    ====================================== */}

                    <div className="panel events-panel">

                        <div className="panel-header">

                            <div>

                                <h2>
                                    Recent Events
                                </h2>

                                <p>
                                    Latest system activity
                                </p>

                            </div>

                            <span className="event-count">

                                {events.length} Events

                            </span>

                        </div>


                        <div className="event-list">

                            {recentEvents.length === 0 ? (

                                <div className="empty-events">

                                    <CheckCircle2
                                        size={28}
                                    />

                                    <span>
                                        No events available
                                    </span>

                                </div>

                            ) : (

                                recentEvents.map(
                                    (event, index) => {

                                        const severity =
                                            String(
                                                event.severity ||
                                                "INFO"
                                            ).toLowerCase();

                                        return (

                                            <div
                                                className="event"
                                                key={
                                                    event.id ||
                                                    index
                                                }
                                            >

                                                <div
                                                    className={`event-icon ${severity}`}
                                                >

                                                    {severity ===
                                                    "critical" ||
                                                    severity ===
                                                    "error" ||
                                                    severity ===
                                                    "warning" ? (

                                                        <AlertTriangle
                                                            size={16}
                                                        />

                                                    ) : (

                                                        <Activity
                                                            size={16}
                                                        />

                                                    )}

                                                </div>


                                                <div className="event-content">

                                                    <strong>
                                                        {
                                                            event.deviceId ||
                                                            event.eventId ||
                                                            "SYSTEM"
                                                        }
                                                    </strong>

                                                    <span>
                                                        {
                                                            event.message ||
                                                            event.eventType ||
                                                            "System event"
                                                        }
                                                    </span>

                                                </div>


                                                <div className="event-meta">

                                                    <span
                                                        className={`severity-badge ${severity}`}
                                                    >
                                                        {
                                                            event.severity ||
                                                            "INFO"
                                                        }
                                                    </span>

                                                    <span className="event-time">
                                                        {
                                                            formatTime(
                                                                event.eventTime
                                                            )
                                                        }
                                                    </span>

                                                </div>

                                            </div>

                                        );

                                    }
                                )

                            )}

                        </div>

                    </div>

                </main>

            </div>

        </div>

    );
}


// =====================================================
// STAT CARD
// =====================================================

function StatCard({
    icon,
    iconClass,
    title,
    value,
    unit,
    description
}) {

    return (

        <div className="stat-card">

            <div className={`stat-icon ${iconClass}`}>
                {icon}
            </div>

            <div className="stat-title">
                {title}
            </div>

            <div className="stat-number">

                {value}

                {unit && (
                    <span>
                        {unit}
                    </span>
                )}

            </div>

            <div className="stat-description">
                {description}
            </div>

        </div>

    );
}


// =====================================================
// BATTERY CARD
// =====================================================

function BatteryCard({
    icon,
    className,
    title,
    value
}) {

    return (

        <div className="battery-card">

            <div
                className={`battery-icon ${className}`}
            >
                {icon}
            </div>

            <div>

                <span>
                    {title}
                </span>

                <strong>
                    {value}
                </strong>

            </div>

        </div>

    );
}


// =====================================================
// HEALTH ROW
// =====================================================

function HealthRow({
    dotClass,
    title,
    value
}) {

    return (

        <div className="health-row">

            <span>

                <i className={dotClass}></i>

                {title}

            </span>

            <strong>
                {value}
            </strong>

        </div>

    );
}


export default Dashboard;