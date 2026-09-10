import React from "react";
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
} from "lucide-react";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

import { api } from "../service/api";
import StatsCards from "../components/StatsCards";
      

import "./Dashboard.css";


function Dashboard() {

    // ==============================
    // CHART DATA
    // ==============================

    const chartData = [
        {
            time: "10:00",
            generation: 420,
            consumption: 350,
        },
        {
            time: "10:05",
            generation: 460,
            consumption: 370,
        },
        {
            time: "10:10",
            generation: 510,
            consumption: 410,
        },
        {
            time: "10:15",
            generation: 490,
            consumption: 450,
        },
        {
            time: "10:20",
            generation: 530,
            consumption: 470,
        },
        {
            time: "10:25",
            generation: 480,
            consumption: 500,
        },
        {
            time: "10:30",
            generation: 450,
            consumption: 520,
        },
    ];


    // ==============================
    // RECENT EVENTS
    // ==============================

    const events = [
        {
            device: "SOLAR-1042",
            message: "Power output reduced",
            time: "10:35:42",
            type: "warning",
        },
        {
            device: "BAT-2045",
            message: "IDLE → DISCHARGING",
            time: "10:35:18",
            type: "discharging",
        },
        {
            device: "SOLAR-0931",
            message: "Telemetry received",
            time: "10:34:57",
            type: "online",
        },
        {
            device: "BAT-3012",
            message: "CHARGING → IDLE",
            time: "10:34:31",
            type: "idle",
        },
        {
            device: "SOLAR-0881",
            message: "Connection restored",
            time: "10:33:49",
            type: "online",
        },
    ];


    return (

        <div className="dashboard">

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

                        <RefreshCw size={14} />

                        Updated just now

                    </div>


                    <button className="storm-btn">

                        <Zap size={16} />

                        Storm Simulation

                    </button>

                </div>

            </div>


            {/* =====================================
                STAT CARDS
            ====================================== */}

            <div className="stats-grid">

                {/* TOTAL NODES */}

                <div className="stat-card">

                    <div className="stat-icon blue">
                        <Cpu size={20} />
                    </div>

                    <div className="stat-title">
                        Total Nodes
                    </div>

                    <div className="stat-number">
                        0
                    </div>

                    <div className="stat-description">
                        All registered IoT nodes
                    </div>

                </div>


                {/* ONLINE NODES */}

                <div className="stat-card">

                    <div className="stat-icon green">
                        <Wifi size={20} />
                    </div>

                    <div className="stat-title">
                        Online Nodes
                    </div>

                    <div className="stat-number">
                        0
                    </div>

                    <div className="stat-description">
                        Currently connected
                    </div>

                </div>


                {/* POWER GENERATION */}

                <div className="stat-card">

                    <div className="stat-icon yellow">
                        <Factory size={20} />
                    </div>

                    <div className="stat-title">
                        Power Generation
                    </div>

                    <div className="stat-number">
                        0
                        <span> MW</span>
                    </div>

                    <div className="stat-description">
                        Current generation
                    </div>

                </div>


                {/* CONSUMPTION */}

                <div className="stat-card">

                    <div className="stat-icon purple">
                        <Home size={20} />
                    </div>

                    <div className="stat-title">
                        Consumption
                    </div>

                    <div className="stat-number">
                        0
                        <span> MW</span>
                    </div>

                    <div className="stat-description">
                        Current consumption
                    </div>

                </div>


                {/* GRID LOAD */}

                <div className="stat-card">

                    <div className="stat-icon orange">
                        <Activity size={20} />
                    </div>

                    <div className="stat-title">
                        Grid Load
                    </div>

                    <div className="stat-number">
                        0
                        <span>%</span>
                    </div>

                    <div className="stat-description">
                        Current grid load
                    </div>

                </div>


                {/* FAULTS */}

                <div className="stat-card">

                    <div className="stat-icon red">
                        <AlertTriangle size={20} />
                    </div>

                    <div className="stat-title">
                        Faults
                    </div>

                    <div className="stat-number">
                        0
                    </div>

                    <div className="stat-description">
                        Active system faults
                    </div>

                </div>

            </div>


            {/* =====================================
                SECOND ROW
            ====================================== */}

            <div className="second-grid">

                {/* BATTERY SUMMARY */}

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

                        <BatteryCharging size={20} />

                    </div>


                    <div className="battery-grid">


                        {/* CHARGING */}

                        <div className="battery-card">

                            <div className="battery-icon charging">
                                <BatteryCharging size={22} />
                            </div>

                            <div>

                                <span>
                                    Charging
                                </span>

                                <strong>
                                    0
                                </strong>

                            </div>

                        </div>


                        {/* DISCHARGING */}

                        <div className="battery-card">

                            <div className="battery-icon discharging">
                                <ArrowDown size={22} />
                            </div>

                            <div>

                                <span>
                                    Discharging
                                </span>

                                <strong>
                                    0
                                </strong>

                            </div>

                        </div>


                        {/* IDLE */}

                        <div className="battery-card">

                            <div className="battery-icon idle">
                                <Activity size={22} />
                            </div>

                            <div>

                                <span>
                                    Idle
                                </span>

                                <strong>
                                    0
                                </strong>

                            </div>

                        </div>


                        {/* FAULT */}

                        <div className="battery-card">

                            <div className="battery-icon fault">
                                <AlertTriangle size={22} />
                            </div>

                            <div>

                                <span>
                                    Faults
                                </span>

                                <strong>
                                    0
                                </strong>

                            </div>

                        </div>

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

                        <Activity size={20} />

                    </div>


                    <div className="health-container">

                        <div className="health-circle">

                            <div>

                                <strong>
                                    0%
                                </strong>

                                <span>
                                    GRID LOAD
                                </span>

                            </div>

                        </div>


                        <div className="health-list">

                            <div className="health-row">

                                <span>
                                    <i className="green-dot"></i>
                                    Generation
                                </span>

                                <strong>
                                    0 MW
                                </strong>

                            </div>


                            <div className="health-row">

                                <span>
                                    <i className="blue-dot"></i>
                                    Consumption
                                </span>

                                <strong>
                                    0 MW
                                </strong>

                            </div>


                            <div className="health-row">

                                <span>
                                    <i className="orange-dot"></i>
                                    Battery Support
                                </span>

                                <strong>
                                    0 MW
                                </strong>

                            </div>


                            <div className="health-row">

                                <span>
                                    <i className="red-dot"></i>
                                    Faults
                                </span>

                                <strong>
                                    0
                                </strong>

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
                        Last 40 minutes
                    </span>

                </div>


                <div className="chart">

                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >

                        <AreaChart data={chartData}>

                            <CartesianGrid
                                strokeDasharray="3 3"
                            />

                            <XAxis
                                dataKey="time"
                            />

                            <YAxis />

                            <Tooltip />

                            <Area
                                type="monotone"
                                dataKey="generation"
                                name="Generation"
                                fillOpacity={0.2}
                                strokeWidth={2}
                            />

                            <Area
                                type="monotone"
                                dataKey="consumption"
                                name="Consumption"
                                fillOpacity={0.2}
                                strokeWidth={2}
                            />

                        </AreaChart>

                    </ResponsiveContainer>

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

                    {events.map((event, index) => (

                        <div
                            className="event"
                            key={index}
                        >

                            <div className={`event-icon ${event.type}`}>

                                {event.type === "warning" ? (
                                    <AlertTriangle size={16} />
                                ) : (
                                    <Activity size={16} />
                                )}

                            </div>


                            <div className="event-content">

                                <strong>
                                    {event.device}
                                </strong>

                                <span>
                                    {event.message}
                                </span>

                            </div>


                            <span className="event-time">
                                {event.time}
                            </span>

                        </div>

                    ))}

                </div>

            </div>

        </div>
    );
}

export default Dashboard;