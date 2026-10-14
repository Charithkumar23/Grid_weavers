import { useEffect, useMemo, useState } from "react";
import { api } from "../service/api";
import Sidebar from "../components/Sidebar";
import "./Batteries.css";

function Batteries() {

    const [batteries, setBatteries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        batteryId: "",
        batteryName: "",
        batteryType: "Lithium-Ion",
        capacity: "",
        chargeLevel: "",
        voltage: "",
        current: "",
        temperature: "",
        status: "ONLINE",
        state: "IDLE",
        health: "100",
        location: ""
    });

    // ==============================
    // LOAD BATTERIES
    // ==============================

    const loadBatteries = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get("/batteries");

            const data = response.data;

            if (Array.isArray(data)) {
                setBatteries(data);
            } else {
                setBatteries(data.batteries || []);
            }

        } catch (err) {

            console.error("Battery API Error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load batteries."
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        loadBatteries();
    }, []);

    // ==============================
    // SEARCH + FILTER
    // ==============================

    const filteredBatteries = useMemo(() => {

        return batteries.filter((battery) => {

            const text = `
                ${battery.batteryId || ""}
                ${battery.batteryName || ""}
                ${battery.location || ""}
                ${battery.batteryType || ""}
            `.toLowerCase();

            const matchesSearch =
                text.includes(search.toLowerCase());

            const matchesStatus =
                statusFilter === "ALL" ||
                battery.status === statusFilter;

            return matchesSearch && matchesStatus;
        });

    }, [batteries, search, statusFilter]);

    // ==============================
    // STATISTICS
    // ==============================

    const stats = useMemo(() => {

        const total = batteries.length;

        const online = batteries.filter(
            battery => battery.status === "ONLINE"
        ).length;

        const charging = batteries.filter(
            battery => battery.state === "CHARGING"
        ).length;

        const fault = batteries.filter(
            battery => battery.status === "FAULT"
        ).length;

        const avgCharge = total
            ? Math.round(
                batteries.reduce(
                    (sum, battery) =>
                        sum + Number(battery.chargeLevel || 0),
                    0
                ) / total
            )
            : 0;

        return {
            total,
            online,
            charging,
            fault,
            avgCharge
        };

    }, [batteries]);

    // ==============================
    // FORM
    // ==============================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const resetForm = () => {

        setForm({
            batteryId: "",
            batteryName: "",
            batteryType: "Lithium-Ion",
            capacity: "",
            chargeLevel: "",
            voltage: "",
            current: "",
            temperature: "",
            status: "ONLINE",
            state: "IDLE",
            health: "100",
            location: ""
        });

        setEditingId(null);
    };

    const openAddModal = () => {

        resetForm();
        setShowModal(true);
    };

    const openEditModal = (battery) => {

        setEditingId(battery.id);

        setForm({
            batteryId: battery.batteryId || "",
            batteryName: battery.batteryName || "",
            batteryType: battery.batteryType || "Lithium-Ion",
            capacity: battery.capacity ?? "",
            chargeLevel: battery.chargeLevel ?? "",
            voltage: battery.voltage ?? "",
            current: battery.current ?? "",
            temperature: battery.temperature ?? "",
            status: battery.status || "ONLINE",
            state: battery.state || "IDLE",
            health: battery.health ?? "100",
            location: battery.location || ""
        });

        setShowModal(true);
    };

    // ==============================
    // CREATE / UPDATE
    // ==============================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const payload = {
                batteryId: form.batteryId,
                batteryName: form.batteryName,
                batteryType: form.batteryType,
                capacity: Number(form.capacity || 0),
                chargeLevel: Number(form.chargeLevel || 0),
                voltage: Number(form.voltage || 0),
                current: Number(form.current || 0),
                temperature: Number(form.temperature || 0),
                status: form.status,
                state: form.state,
                health: Number(form.health || 100),
                location: form.location
            };

            if (editingId) {

                await api.put(
                    `/batteries/${editingId}`,
                    payload
                );

            } else {

                await api.post(
                    "/batteries",
                    payload
                );
            }

            setShowModal(false);

            resetForm();

            await loadBatteries();

        } catch (err) {

            console.error("Save Battery Error:", err);

            alert(
                err.response?.data?.message ||
                "Unable to save battery."
            );
        }
    };

    // ==============================
    // DELETE
    // ==============================

    const deleteBattery = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this battery?"
        );

        if (!confirmed) {
            return;
        }

        try {

            await api.delete(`/batteries/${id}`);

            await loadBatteries();

        } catch (err) {

            console.error("Delete Battery Error:", err);

            alert(
                err.response?.data?.message ||
                "Unable to delete battery."
            );
        }
    };

    // ==============================
    // CHARGE COLOR
    // ==============================

    const getChargeClass = (charge) => {

        const value = Number(charge || 0);

        if (value >= 70) return "high";

        if (value >= 30) return "medium";

        return "low";
    };

    return (

        <div className="gridweaver-layout">

            {/* SIDEBAR */}

            <Sidebar />

            {/* MAIN CONTENT */}

            <main className="batteries-page">

                {/* HEADER */}

                <div className="battery-header">

                    <div>

                        <div className="page-label">
                            ENERGY STORAGE
                        </div>

                        <h1>Battery Network</h1>

                        <p>
                            Monitor and manage your microgrid
                            battery infrastructure.
                        </p>

                    </div>

                    <button
                        className="add-battery-btn"
                        onClick={openAddModal}
                    >
                        <span>+</span>
                        Add Battery
                    </button>

                </div>

                {/* STAT CARDS */}

                <div className="battery-stats">

                    <div className="battery-stat-card">

                        <div className="stat-icon battery-icon">
                            🔋
                        </div>

                        <div>
                            <span>Total Batteries</span>
                            <strong>{stats.total}</strong>
                        </div>

                    </div>

                    <div className="battery-stat-card">

                        <div className="stat-icon online-icon">
                            ●
                        </div>

                        <div>
                            <span>Online</span>
                            <strong>{stats.online}</strong>
                        </div>

                    </div>

                    <div className="battery-stat-card">

                        <div className="stat-icon charging-icon">
                            ⚡
                        </div>

                        <div>
                            <span>Charging</span>
                            <strong>{stats.charging}</strong>
                        </div>

                    </div>

                    <div className="battery-stat-card">

                        <div className="stat-icon charge-icon">
                            %
                        </div>

                        <div>
                            <span>Average Charge</span>
                            <strong>{stats.avgCharge}%</strong>
                        </div>

                    </div>

                    <div className="battery-stat-card">

                        <div className="stat-icon fault-icon">
                            !
                        </div>

                        <div>
                            <span>Fault</span>
                            <strong>{stats.fault}</strong>
                        </div>

                    </div>

                </div>

                {/* TOOLBAR */}

                <div className="battery-toolbar">

                    <div className="search-box">

                        <span>⌕</span>

                        <input
                            type="text"
                            placeholder="Search batteries..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                    </div>

                    <div className="filter-group">

                        {[
                            "ALL",
                            "ONLINE",
                            "OFFLINE",
                            "FAULT"
                        ].map(status => (

                            <button
                                key={status}
                                className={
                                    statusFilter === status
                                        ? "filter-btn active"
                                        : "filter-btn"
                                }
                                onClick={() =>
                                    setStatusFilter(status)
                                }
                            >
                                {status}
                            </button>

                        ))}

                    </div>

                    <button
                        className="refresh-btn"
                        onClick={loadBatteries}
                    >
                        ↻ Refresh
                    </button>

                </div>

                {/* LOADING */}

                {loading && (

                    <div className="battery-message">

                        <div className="loading-spinner"></div>

                        Loading batteries...

                    </div>

                )}

                {/* ERROR */}

                {!loading && error && (

                    <div className="battery-error">

                        ⚠

                        <span>{error}</span>

                        <button onClick={loadBatteries}>
                            Retry
                        </button>

                    </div>

                )}

                {/* EMPTY */}

                {!loading &&
                    !error &&
                    filteredBatteries.length === 0 && (

                    <div className="empty-batteries">

                        <div className="empty-icon">
                            🔋
                        </div>

                        <h3>
                            No batteries found
                        </h3>

                        <p>
                            Add your first battery to start
                            monitoring your energy storage network.
                        </p>

                        <button
                            className="add-battery-btn"
                            onClick={openAddModal}
                        >
                            + Add Battery
                        </button>

                    </div>

                )}

{/* BATTERY TABLE */}

{!loading &&
    !error &&
    filteredBatteries.length > 0 && (

    <div className="battery-table-wrapper">

        <table className="battery-table">

            <thead>
                <tr>
                    <th>Battery</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Charge</th>
                    <th>Capacity</th>
                    <th>Voltage</th>
                    <th>Current</th>
                    <th>Temperature</th>
                    <th>State</th>
                    <th>Health</th>
                    <th>Location</th>
                    <th>Actions</th>
                </tr>
            </thead>

            <tbody>

                {filteredBatteries.map((battery) => {

                    const charge = Number(
                        battery.chargeLevel || 0
                    );

                    const health = Number(
                        battery.health || 0
                    );

                    return (

                        <tr key={battery.id}>

                            {/* BATTERY */}

                            <td>

                                <div className="table-battery-info">

                                    <div className="table-battery-icon">
                                        🔋
                                    </div>

                                    <div>

                                        <strong>
                                            {battery.batteryName || "Unnamed Battery"}
                                        </strong>

                                        <span>
                                            {battery.batteryId || "—"}
                                        </span>

                                    </div>

                                </div>

                            </td>

                            {/* TYPE */}

                            <td>

                                <span className="battery-type">
                                    {battery.batteryType || "—"}
                                </span>

                            </td>

                            {/* STATUS */}

                            <td>

                                <span
                                    className={`status-badge ${
                                        battery.status
                                            ?.toLowerCase() || "offline"
                                    }`}
                                >

                                    <i></i>

                                    {battery.status || "OFFLINE"}

                                </span>

                            </td>

                            {/* CHARGE */}

                            <td>

                                <div className="table-charge">

                                    <div className="table-charge-top">

                                        <strong>
                                            {charge.toFixed(0)}%
                                        </strong>

                                    </div>

                                    <div className="table-charge-track">

                                        <div
                                            className={`table-charge-fill ${getChargeClass(
                                                charge
                                            )}`}
                                            style={{
                                                width: `${Math.min(
                                                    100,
                                                    Math.max(
                                                        0,
                                                        charge
                                                    )
                                                )}%`
                                            }}
                                        ></div>

                                    </div>

                                </div>

                            </td>

                            {/* CAPACITY */}

                            <td>
                                <span className="table-value">
                                    {battery.capacity ?? 0}
                                    <small> kWh</small>
                                </span>
                            </td>

                            {/* VOLTAGE */}

                            <td>
                                <span className="table-value">
                                    {battery.voltage ?? 0}
                                    <small> V</small>
                                </span>
                            </td>

                            {/* CURRENT */}

                            <td>
                                <span className="table-value">
                                    {battery.current ?? 0}
                                    <small> A</small>
                                </span>
                            </td>

                            {/* TEMPERATURE */}

                            <td>

                                <span
                                    className={
                                        Number(
                                            battery.temperature || 0
                                        ) > 45
                                            ? "temperature danger"
                                            : "temperature"
                                    }
                                >
                                    {battery.temperature ?? 0}°C
                                </span>

                            </td>

                            {/* STATE */}

                            <td>

                                <span
                                    className={`state-badge ${
                                        battery.state
                                            ?.toLowerCase()
                                            .replace(
                                                /\s+/g,
                                                "-"
                                            ) || "idle"
                                    }`}
                                >
                                    {battery.state || "IDLE"}
                                </span>

                            </td>

                            {/* HEALTH */}

                            <td>

                                <div className="health-value">

                                    <strong>
                                        {health}%
                                    </strong>

                                    <div className="health-track">

                                        <div
                                            className="health-fill"
                                            style={{
                                                width: `${Math.min(
                                                    100,
                                                    Math.max(
                                                        0,
                                                        health
                                                    )
                                                )}%`
                                            }}
                                        ></div>

                                    </div>

                                </div>

                            </td>

                            {/* LOCATION */}

                            <td>

                                <span className="location-value">
                                    {battery.location || "—"}
                                </span>

                            </td>

                            {/* ACTIONS */}

                            <td>

                                <div className="table-actions">

                                    <button
                                        className="table-edit-btn"
                                        onClick={() =>
                                            openEditModal(battery)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="table-delete-btn"
                                        onClick={() =>
                                            deleteBattery(
                                                battery.id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>

                                </div>

                            </td>

                        </tr>

                    );

                })}

            </tbody>

        </table>

    </div>

)}

                {/* MODAL */}

                {showModal && (

                    <div
                        className="modal-overlay"
                        onMouseDown={(e) => {

                            if (
                                e.target === e.currentTarget
                            ) {
                                setShowModal(false);
                            }

                        }}
                    >

                        <div className="battery-modal">

                            <div className="modal-header">

                                <div>

                                    <span>
                                        BATTERY MANAGEMENT
                                    </span>

                                    <h2>
                                        {editingId
                                            ? "Edit Battery"
                                            : "Add New Battery"}
                                    </h2>

                                </div>

                                <button
                                    className="close-btn"
                                    onClick={() =>
                                        setShowModal(false)
                                    }
                                >
                                    ×
                                </button>

                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className="battery-form"
                            >

                                {/* BASIC */}

                                <div className="form-section-title">
                                    Basic Information
                                </div>

                                <div className="form-grid">

                                    <div className="form-field">

                                        <label>
                                            Battery ID
                                        </label>

                                        <input
                                            name="batteryId"
                                            value={form.batteryId}
                                            onChange={handleChange}
                                            placeholder="BAT-001"
                                            required
                                        />

                                    </div>

                                    <div className="form-field">

                                        <label>
                                            Battery Name
                                        </label>

                                        <input
                                            name="batteryName"
                                            value={form.batteryName}
                                            onChange={handleChange}
                                            placeholder="Battery Storage 01"
                                            required
                                        />

                                    </div>

                                    <div className="form-field">

                                        <label>
                                            Battery Type
                                        </label>

                                        <select
                                            name="batteryType"
                                            value={form.batteryType}
                                            onChange={handleChange}
                                        >
                                            <option>
                                                Lithium-Ion
                                            </option>

                                            <option>
                                                Lithium Iron Phosphate
                                            </option>

                                            <option>
                                                Lead Acid
                                            </option>

                                            <option>
                                                Flow Battery
                                            </option>
                                        </select>

                                    </div>

                                    <div className="form-field">

                                        <label>
                                            Capacity (kWh)
                                        </label>

                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            name="capacity"
                                            value={form.capacity}
                                            onChange={handleChange}
                                            placeholder="100"
                                        />

                                    </div>

                                    <div className="form-field">

                                        <label>
                                            Location
                                        </label>

                                        <input
                                            name="location"
                                            value={form.location}
                                            onChange={handleChange}
                                            placeholder="Zone A"
                                        />

                                    </div>

                                </div>

                                {/* TELEMETRY */}

                                <div className="form-section-title">
                                    Battery Telemetry
                                </div>

                                <div className="form-grid">

                                    <div className="form-field">

                                        <label>
                                            Charge Level (%)
                                        </label>

                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="0.1"
                                            name="chargeLevel"
                                            value={form.chargeLevel}
                                            onChange={handleChange}
                                            required
                                        />

                                    </div>

                                    <div className="form-field">

                                        <label>
                                            Voltage (V)
                                        </label>

                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            name="voltage"
                                            value={form.voltage}
                                            onChange={handleChange}
                                        />

                                    </div>

                                    <div className="form-field">

                                        <label>
                                            Current (A)
                                        </label>

                                        <input
                                            type="number"
                                            step="0.01"
                                            name="current"
                                            value={form.current}
                                            onChange={handleChange}
                                        />

                                    </div>

                                    <div className="form-field">

                                        <label>
                                            Temperature (°C)
                                        </label>

                                        <input
                                            type="number"
                                            step="0.1"
                                            name="temperature"
                                            value={form.temperature}
                                            onChange={handleChange}
                                        />

                                    </div>

                                    <div className="form-field">

                                        <label>
                                            Health (%)
                                        </label>

                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            name="health"
                                            value={form.health}
                                            onChange={handleChange}
                                        />

                                    </div>

                                </div>

                                {/* STATUS */}

                                <div className="form-section-title">
                                    Status
                                </div>

                                <div className="form-grid">

                                    <div className="form-field">

                                        <label>
                                            Status
                                        </label>

                                        <select
                                            name="status"
                                            value={form.status}
                                            onChange={handleChange}
                                        >

                                            <option>
                                                ONLINE
                                            </option>

                                            <option>
                                                OFFLINE
                                            </option>

                                            <option>
                                                FAULT
                                            </option>

                                        </select>

                                    </div>

                                    <div className="form-field">

                                        <label>
                                            State
                                        </label>

                                        <select
                                            name="state"
                                            value={form.state}
                                            onChange={handleChange}
                                        >

                                            <option>
                                                IDLE
                                            </option>

                                            <option>
                                                CHARGING
                                            </option>

                                            <option>
                                                DISCHARGING
                                            </option>

                                            <option>
                                                MAINTENANCE
                                            </option>

                                        </select>

                                    </div>

                                </div>

                                {/* BUTTONS */}

                                <div className="modal-actions">

                                    <button
                                        type="button"
                                        className="cancel-btn"
                                        onClick={() =>
                                            setShowModal(false)
                                        }
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="save-btn"
                                    >
                                        {editingId
                                            ? "Update Battery"
                                            : "Create Battery"}
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                )}

            </main>

        </div>
    );
}

export default Batteries;