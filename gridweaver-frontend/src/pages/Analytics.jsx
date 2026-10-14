import { useEffect, useMemo, useState } from "react";
import {
    Activity,
    BatteryCharging,
    Bolt,
    CalendarDays,
    Download,
    Gauge,
    RefreshCw,
    Server,
    TrendingDown,
    TrendingUp,
    Zap
} from "lucide-react";

import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    CartesianGrid,
    Cell,
    LineChart,
    Line,
    PieChart,
    Pie,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

import { api } from "../service/api";
import Sidebar from "../components/Sidebar";

import "./Analytics.css";

function Analytics() {

    const [analytics, setAnalytics] = useState([]);
    const [loading, setLoading] = useState(true);

    const [range, setRange] = useState("24H");

    const [customStart, setCustomStart] = useState("");
    const [customEnd, setCustomEnd] = useState("");

    const loadAnalytics = async () => {

        try {

            setLoading(true);

            let response;

            if (
                range === "CUSTOM" &&
                customStart &&
                customEnd
            ) {

                response = await api.get(
                    `/analytics/range?start=${customStart}&end=${customEnd}`
                );

            } else {

                response = await api.get("/analytics");
            }

            const data = response.data;

            if (Array.isArray(data)) {

                setAnalytics(data);

            } else if (Array.isArray(data.analytics)) {

                setAnalytics(data.analytics);

            } else {

                setAnalytics([]);
            }

        } catch (error) {

            console.error(
                "Analytics loading error:",
                error
            );

            setAnalytics([]);

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {

        loadAnalytics();

    }, [range, customStart, customEnd]);

    const latest = analytics.length
        ? analytics[analytics.length - 1]
        : {};

    const stats = useMemo(() => {

        if (!analytics.length) {

            return {
                generation: 0,
                consumption: 0,
                load: 0,
                battery: 0,
                health: 0,
                online: 0
            };
        }

        const generation =
            analytics.reduce(
                (sum, item) =>
                    sum + Number(item.generation || 0),
                0
            ) / analytics.length;

        const consumption =
            analytics.reduce(
                (sum, item) =>
                    sum + Number(item.consumption || 0),
                0
            ) / analytics.length;

        const load =
            analytics.reduce(
                (sum, item) =>
                    sum + Number(item.gridLoad || 0),
                0
            ) / analytics.length;

        const battery =
            analytics.reduce(
                (sum, item) =>
                    sum + Number(item.batteryLevel || 0),
                0
            ) / analytics.length;

        const health =
            analytics.reduce(
                (sum, item) =>
                    sum + Number(item.health || 0),
                0
            ) / analytics.length;

        const online =
            Math.max(
                ...analytics.map(
                    item => Number(item.onlineDevices || 0)
                )
            );

        return {
            generation,
            consumption,
            load,
            battery,
            health,
            online
        };

    }, [analytics]);

    const chartData = useMemo(() => {

        return analytics.map((item, index) => {

            const date = item.recordTime
                ? new Date(item.recordTime)
                : null;

            return {

                name: date
                    ? date.toLocaleTimeString(
                        "en-IN",
                        {
                            hour: "2-digit",
                            minute: "2-digit"
                        }
                    )
                    : `T${index + 1}`,

                generation:
                    Number(item.generation || 0),

                consumption:
                    Number(item.consumption || 0),

                load:
                    Number(item.gridLoad || 0),

                battery:
                    Number(item.batteryLevel || 0),

                batteryPower:
                    Number(item.batteryPower || 0),

                voltage:
                    Number(item.voltage || 0),

                frequency:
                    Number(item.frequency || 0),

                health:
                    Number(item.health || 0)
            };

        });

    }, [analytics]);

    const deviceStatusData = useMemo(() => {

        const online = latest.onlineDevices || 0;
        const offline = latest.offlineDevices || 0;
        const fault = latest.faultDevices || 0;

        return [
            {
                name: "Online",
                value: Number(online)
            },
            {
                name: "Offline",
                value: Number(offline)
            },
            {
                name: "Fault",
                value: Number(fault)
            }
        ];

    }, [latest]);

    const formatNumber = (value) => {

        return Number(value || 0).toLocaleString(
            "en-IN",
            {
                maximumFractionDigits: 1
            }
        );
    };

    const exportCSV = () => {

        if (!analytics.length) {

            alert("No analytics data available");

            return;
        }

        const headers = [
            "Record Time",
            "Generation",
            "Consumption",
            "Grid Load",
            "Battery Level",
            "Battery Power",
            "Voltage",
            "Frequency",
            "Power Factor",
            "Online Devices",
            "Offline Devices",
            "Fault Devices",
            "Health"
        ];

        const rows = analytics.map(item => [

            item.recordTime || "",

            item.generation || 0,

            item.consumption || 0,

            item.gridLoad || 0,

            item.batteryLevel || 0,

            item.batteryPower || 0,

            item.voltage || 0,

            item.frequency || 0,

            item.powerFactor || 0,

            item.onlineDevices || 0,

            item.offlineDevices || 0,

            item.faultDevices || 0,

            item.health || 0

        ]);

        const csv = [
            headers,
            ...rows
        ]
            .map(row =>
                row
                    .map(value =>
                        `"${String(value).replaceAll('"', '""')}"`
                    )
                    .join(",")
            )
            .join("\n");

        const blob = new Blob(
            [csv],
            {
                type: "text/csv;charset=utf-8;"
            }
        );

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;

        link.download =
            `gridweaver-analytics-${Date.now()}.csv`;

        link.click();

        URL.revokeObjectURL(url);
    };

    return (

        <div className="analytics-layout">

            <Sidebar />

            <main className="analytics-main">

                <div className="analytics-page">

                    {/* HEADER */}

                    <section className="analytics-header">

                        <div>

                            <div className="analytics-title-row">

                                <div className="analytics-title-icon">
                                    <Activity size={24} />
                                </div>

                                <div>

                                    <h1>
                                        Energy Analytics
                                    </h1>

                                    <p>
                                        Real-time microgrid performance and
                                        energy intelligence
                                    </p>

                                </div>

                            </div>

                        </div>

                        <div className="analytics-actions">

                            <button
                                className="analytics-refresh"
                                onClick={loadAnalytics}
                                disabled={loading}
                            >

                                <RefreshCw
                                    size={17}
                                    className={
                                        loading
                                            ? "spin"
                                            : ""
                                    }
                                />

                                Refresh

                            </button>

                            <button
                                className="analytics-export"
                                onClick={exportCSV}
                            >

                                <Download size={17} />

                                Export CSV

                            </button>

                        </div>

                    </section>


                    {/* FILTER */}

                    <section className="analytics-filter">

                        <div className="filter-left">

                            <CalendarDays size={18} />

                            <span>
                                Time Range
                            </span>

                            <div className="range-buttons">

                                {[
                                    "24H",
                                    "7D",
                                    "30D",
                                    "CUSTOM"
                                ].map(item => (

                                    <button
                                        key={item}
                                        className={
                                            range === item
                                                ? "active"
                                                : ""
                                        }
                                        onClick={() =>
                                            setRange(item)
                                        }
                                    >
                                        {item}
                                    </button>

                                ))}

                            </div>

                        </div>

                        {range === "CUSTOM" && (

                            <div className="custom-date">

                                <input
                                    type="date"
                                    value={customStart}
                                    onChange={e =>
                                        setCustomStart(
                                            e.target.value
                                        )
                                    }
                                />

                                <span>to</span>

                                <input
                                    type="date"
                                    value={customEnd}
                                    onChange={e =>
                                        setCustomEnd(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                        )}

                    </section>


                    {/* KPI CARDS */}

                    <section className="analytics-stats">

                        <div className="analytics-stat-card">

                            <div className="stat-icon generation">
                                <Zap size={21} />
                            </div>

                            <div className="stat-content">

                                <span>
                                    Avg Generation
                                </span>

                                <strong>
                                    {formatNumber(
                                        stats.generation
                                    )}
                                    <small> kW</small>
                                </strong>

                                <div className="stat-trend positive">
                                    <TrendingUp size={14} />
                                    Live production
                                </div>

                            </div>

                        </div>


                        <div className="analytics-stat-card">

                            <div className="stat-icon consumption">
                                <TrendingDown size={21} />
                            </div>

                            <div className="stat-content">

                                <span>
                                    Avg Consumption
                                </span>

                                <strong>
                                    {formatNumber(
                                        stats.consumption
                                    )}
                                    <small> kW</small>
                                </strong>

                                <div className="stat-trend">
                                    Current demand
                                </div>

                            </div>

                        </div>


                        <div className="analytics-stat-card">

                            <div className="stat-icon load">
                                <Gauge size={21} />
                            </div>

                            <div className="stat-content">

                                <span>
                                    Grid Load
                                </span>

                                <strong>
                                    {formatNumber(
                                        stats.load
                                    )}
                                    <small> %</small>
                                </strong>

                                <div className="progress-line">

                                    <span
                                        style={{
                                            width: `${Math.min(
                                                stats.load,
                                                100
                                            )}%`
                                        }}
                                    />

                                </div>

                            </div>

                        </div>


                        <div className="analytics-stat-card">

                            <div className="stat-icon battery">
                                <BatteryCharging size={21} />
                            </div>

                            <div className="stat-content">

                                <span>
                                    Battery Level
                                </span>

                                <strong>
                                    {formatNumber(
                                        stats.battery
                                    )}
                                    <small> %</small>
                                </strong>

                                <div className="progress-line battery-progress">

                                    <span
                                        style={{
                                            width: `${Math.min(
                                                stats.battery,
                                                100
                                            )}%`
                                        }}
                                    />

                                </div>

                            </div>

                        </div>


                        <div className="analytics-stat-card">

                            <div className="stat-icon health">
                                <Activity size={21} />
                            </div>

                            <div className="stat-content">

                                <span>
                                    Grid Health
                                </span>

                                <strong>
                                    {formatNumber(
                                        stats.health
                                    )}
                                    <small> %</small>
                                </strong>

                                <div className="stat-trend positive">
                                    Stable
                                </div>

                            </div>

                        </div>


                        <div className="analytics-stat-card">

                            <div className="stat-icon devices">
                                <Server size={21} />
                            </div>

                            <div className="stat-content">

                                <span>
                                    Online Devices
                                </span>

                                <strong>
                                    {formatNumber(
                                        stats.online
                                    )}
                                </strong>

                                <div className="stat-trend positive">
                                    Connected
                                </div>

                            </div>

                        </div>

                    </section>


                    {loading ? (

                        <div className="analytics-loading">

                            <RefreshCw
                                size={30}
                                className="spin"
                            />

                            <p>
                                Loading analytics...
                            </p>

                        </div>

                    ) : analytics.length === 0 ? (

                        <div className="analytics-empty">

                            <div>
                                <Activity size={38} />
                            </div>

                            <h2>
                                No analytics data
                            </h2>

                            <p>
                                Add analytics records from the backend
                                to display performance charts.
                            </p>

                            <button
                                onClick={loadAnalytics}
                            >
                                Refresh Data
                            </button>

                        </div>

                    ) : (

                        <>

                            {/* MAIN CHART */}

                            <section className="chart-card chart-large">

                                <div className="chart-header">

                                    <div>

                                        <h2>
                                            Energy Performance
                                        </h2>

                                        <p>
                                            Generation versus consumption
                                        </p>

                                    </div>

                                    <div className="chart-legend">

                                        <span>
                                            <i className="legend-dot generation-dot" />
                                            Generation
                                        </span>

                                        <span>
                                            <i className="legend-dot consumption-dot" />
                                            Consumption
                                        </span>

                                    </div>

                                </div>

                                <div className="chart-container">

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
                                                        offset="0%"
                                                        stopOpacity={0.35}
                                                    />

                                                    <stop
                                                        offset="100%"
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
                                                        offset="0%"
                                                        stopOpacity={0.25}
                                                    />

                                                    <stop
                                                        offset="100%"
                                                        stopOpacity={0}
                                                    />

                                                </linearGradient>

                                            </defs>

                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                vertical={false}
                                            />

                                            <XAxis
                                                dataKey="name"
                                                tickLine={false}
                                                axisLine={false}
                                            />

                                            <YAxis
                                                tickLine={false}
                                                axisLine={false}
                                            />

                                            <Tooltip />

                                            <Area
                                                type="monotone"
                                                dataKey="generation"
                                                strokeWidth={3}
                                                fill="url(#generationGradient)"
                                            />

                                            <Area
                                                type="monotone"
                                                dataKey="consumption"
                                                strokeWidth={3}
                                                fill="url(#consumptionGradient)"
                                            />

                                        </AreaChart>

                                    </ResponsiveContainer>

                                </div>

                            </section>


                            {/* TWO CHARTS */}

                            <section className="analytics-grid-2">

                                <div className="chart-card">

                                    <div className="chart-header">

                                        <div>

                                            <h2>
                                                Grid Load
                                            </h2>

                                            <p>
                                                Load utilization over time
                                            </p>

                                        </div>

                                        <div className="chart-value">
                                            {formatNumber(stats.load)}%
                                        </div>

                                    </div>

                                    <div className="chart-container">

                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >

                                            <LineChart
                                                data={chartData}
                                            >

                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    vertical={false}
                                                />

                                                <XAxis
                                                    dataKey="name"
                                                    tickLine={false}
                                                    axisLine={false}
                                                />

                                                <YAxis
                                                    tickLine={false}
                                                    axisLine={false}
                                                />

                                                <Tooltip />

                                                <Line
                                                    type="monotone"
                                                    dataKey="load"
                                                    strokeWidth={3}
                                                    dot={false}
                                                />

                                            </LineChart>

                                        </ResponsiveContainer>

                                    </div>

                                </div>


                                <div className="chart-card">

                                    <div className="chart-header">

                                        <div>

                                            <h2>
                                                Battery Performance
                                            </h2>

                                            <p>
                                                Battery charge level
                                            </p>

                                        </div>

                                        <div className="chart-value">
                                            {formatNumber(stats.battery)}%
                                        </div>

                                    </div>

                                    <div className="chart-container">

                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >

                                            <AreaChart
                                                data={chartData}
                                            >

                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    vertical={false}
                                                />

                                                <XAxis
                                                    dataKey="name"
                                                    tickLine={false}
                                                    axisLine={false}
                                                />

                                                <YAxis
                                                    domain={[0, 100]}
                                                    tickLine={false}
                                                    axisLine={false}
                                                />

                                                <Tooltip />

                                                <Area
                                                    type="monotone"
                                                    dataKey="battery"
                                                    fillOpacity={0.2}
                                                    strokeWidth={3}
                                                />

                                            </AreaChart>

                                        </ResponsiveContainer>

                                    </div>

                                </div>

                            </section>


                            {/* BOTTOM GRID */}

                            <section className="analytics-grid-3">

                                {/* DEVICE STATUS */}

                                <div className="chart-card">

                                    <div className="chart-header">

                                        <div>

                                            <h2>
                                                Device Status
                                            </h2>

                                            <p>
                                                Infrastructure health
                                            </p>

                                        </div>

                                    </div>

                                    <div className="device-chart">

                                        <ResponsiveContainer
                                            width="100%"
                                            height={210}
                                        >

                                            <PieChart>

                                                <Pie
                                                    data={deviceStatusData}
                                                    dataKey="value"
                                                    nameKey="name"
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={55}
                                                    outerRadius={80}
                                                    paddingAngle={4}
                                                >

                                                    {deviceStatusData.map(
                                                        (entry, index) => (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                            />
                                                        )
                                                    )}

                                                </Pie>

                                                <Tooltip />

                                            </PieChart>

                                        </ResponsiveContainer>

                                        <div className="device-center">

                                            <strong>
                                                {formatNumber(
                                                    deviceStatusData.reduce(
                                                        (sum, item) =>
                                                            sum + item.value,
                                                        0
                                                    )
                                                )}
                                            </strong>

                                            <span>
                                                Devices
                                            </span>

                                        </div>

                                    </div>

                                    <div className="device-status-list">

                                        {deviceStatusData.map(
                                            item => (

                                                <div
                                                    className="device-status-item"
                                                    key={item.name}
                                                >

                                                    <span>
                                                        {item.name}
                                                    </span>

                                                    <strong>
                                                        {item.value}
                                                    </strong>

                                                </div>

                                            )
                                        )}

                                    </div>

                                </div>


                                {/* POWER QUALITY */}

                                <div className="chart-card">

                                    <div className="chart-header">

                                        <div>

                                            <h2>
                                                Power Quality
                                            </h2>

                                            <p>
                                                Electrical parameters
                                            </p>

                                        </div>

                                    </div>

                                    <div className="quality-list">

                                        <div className="quality-item">

                                            <div>
                                                <span>
                                                    Voltage
                                                </span>

                                                <small>
                                                    Nominal 230V
                                                </small>
                                            </div>

                                            <strong>
                                                {formatNumber(
                                                    latest.voltage
                                                )} V
                                            </strong>

                                        </div>

                                        <div className="quality-item">

                                            <div>
                                                <span>
                                                    Frequency
                                                </span>

                                                <small>
                                                    Nominal 50Hz
                                                </small>
                                            </div>

                                            <strong>
                                                {formatNumber(
                                                    latest.frequency
                                                )} Hz
                                            </strong>

                                        </div>

                                        <div className="quality-item">

                                            <div>
                                                <span>
                                                    Power Factor
                                                </span>

                                                <small>
                                                    Efficiency indicator
                                                </small>
                                            </div>

                                            <strong>
                                                {formatNumber(
                                                    latest.powerFactor
                                                )}
                                            </strong>

                                        </div>

                                        <div className="quality-item">

                                            <div>
                                                <span>
                                                    Battery Power
                                                </span>

                                                <small>
                                                    Current storage output
                                                </small>
                                            </div>

                                            <strong>
                                                {formatNumber(
                                                    latest.batteryPower
                                                )} kW
                                            </strong>

                                        </div>

                                    </div>

                                </div>


                                {/* LATEST DATA */}

                                <div className="chart-card">

                                    <div className="chart-header">

                                        <div>

                                            <h2>
                                                Latest Reading
                                            </h2>

                                            <p>
                                                Most recent system snapshot
                                            </p>

                                        </div>

                                    </div>

                                    <div className="latest-reading">

                                        <div className="reading-main">

                                            <div className="reading-icon">
                                                <Bolt size={25} />
                                            </div>

                                            <div>

                                                <span>
                                                    Generation
                                                </span>

                                                <strong>
                                                    {formatNumber(
                                                        latest.generation
                                                    )} kW
                                                </strong>

                                            </div>

                                        </div>

                                        <div className="reading-row">

                                            <span>
                                                Consumption
                                            </span>

                                            <strong>
                                                {formatNumber(
                                                    latest.consumption
                                                )} kW
                                            </strong>

                                        </div>

                                        <div className="reading-row">

                                            <span>
                                                Grid Load
                                            </span>

                                            <strong>
                                                {formatNumber(
                                                    latest.gridLoad
                                                )}%
                                            </strong>

                                        </div>

                                        <div className="reading-row">

                                            <span>
                                                Grid Health
                                            </span>

                                            <strong>
                                                {formatNumber(
                                                    latest.health
                                                )}%
                                            </strong>

                                        </div>

                                    </div>

                                </div>

                            </section>


                            {/* DATA TABLE */}

                            <section className="chart-card analytics-table-card">

                                <div className="chart-header">

                                    <div>

                                        <h2>
                                            Analytics Records
                                        </h2>

                                        <p>
                                            Recent system measurements
                                        </p>

                                    </div>

                                </div>

                                <div className="analytics-table-wrapper">

                                    <table className="analytics-table">

                                        <thead>

                                            <tr>

                                                <th>Time</th>

                                                <th>Generation</th>

                                                <th>Consumption</th>

                                                <th>Load</th>

                                                <th>Battery</th>

                                                <th>Voltage</th>

                                                <th>Frequency</th>

                                                <th>Health</th>

                                            </tr>

                                        </thead>

                                        <tbody>

                                            {[...analytics]
                                                .reverse()
                                                .slice(0, 10)
                                                .map(item => (

                                                    <tr key={item.id}>

                                                        <td>
                                                            {item.recordTime
                                                                ? new Date(
                                                                    item.recordTime
                                                                ).toLocaleString(
                                                                    "en-IN"
                                                                )
                                                                : "--"}
                                                        </td>

                                                        <td>
                                                            <strong>
                                                                {formatNumber(
                                                                    item.generation
                                                                )} kW
                                                            </strong>
                                                        </td>

                                                        <td>
                                                            {formatNumber(
                                                                item.consumption
                                                            )} kW
                                                        </td>

                                                        <td>

                                                            <span className="load-badge">

                                                                {formatNumber(
                                                                    item.gridLoad
                                                                )}%

                                                            </span>

                                                        </td>

                                                        <td>
                                                            {formatNumber(
                                                                item.batteryLevel
                                                            )}%
                                                        </td>

                                                        <td>
                                                            {formatNumber(
                                                                item.voltage
                                                            )} V
                                                        </td>

                                                        <td>
                                                            {formatNumber(
                                                                item.frequency
                                                            )} Hz
                                                        </td>

                                                        <td>

                                                            <span className="health-badge">

                                                                <i />

                                                                {formatNumber(
                                                                    item.health
                                                                )}%

                                                            </span>

                                                        </td>

                                                    </tr>

                                                ))}

                                        </tbody>

                                    </table>

                                </div>

                            </section>

                        </>

                    )}

                </div>

            </main>

        </div>
    );
}

export default Analytics;