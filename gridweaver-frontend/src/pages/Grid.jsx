import { useEffect, useMemo, useState } from "react";
import { api } from "../service/api";
import Sidebar from "../components/Sidebar";
import "./Grid.css";

function Grid() {

    const [grids, setGrids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        gridId: "",
        gridName: "",
        status: "ONLINE",
        health: "GOOD",
        generation: "",
        consumption: "",
        load: "",
        batteryPower: "",
        voltage: "",
        frequency: "",
        powerFactor: "",
        powerFlow: "NORMAL",
        location: ""
    });

    // =====================================
    // LOAD GRID
    // =====================================

    const loadGrids = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await api.get("/grid");

            const data = response.data;

            if (Array.isArray(data)) {

                setGrids(data);

            } else {

                setGrids(data.grids || []);

            }

        } catch (err) {

            console.error(
                "Grid API Error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load grid data."
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {

        loadGrids();

    }, []);

    // =====================================
    // FILTER
    // =====================================

    const filteredGrids = useMemo(() => {

        return grids.filter(grid => {

            const text = `
                ${grid.gridId || ""}
                ${grid.gridName || ""}
                ${grid.location || ""}
                ${grid.status || ""}
            `.toLowerCase();

            const matchesSearch =
                text.includes(
                    search.toLowerCase()
                );

            const matchesStatus =
                statusFilter === "ALL" ||
                grid.status === statusFilter;

            return (
                matchesSearch &&
                matchesStatus
            );
        });

    }, [
        grids,
        search,
        statusFilter
    ]);

    // =====================================
    // STATISTICS
    // =====================================

    const stats = useMemo(() => {

        const total = grids.length;

        const online = grids.filter(
            grid =>
                grid.status === "ONLINE"
        ).length;

        const offline = grids.filter(
            grid =>
                grid.status === "OFFLINE"
        ).length;

        const fault = grids.filter(
            grid =>
                grid.status === "FAULT"
        ).length;

        const generation =
            grids.reduce(
                (sum, grid) =>
                    sum +
                    Number(
                        grid.generation || 0
                    ),
                0
            );

        const consumption =
            grids.reduce(
                (sum, grid) =>
                    sum +
                    Number(
                        grid.consumption || 0
                    ),
                0
            );

        const avgLoad = total
            ? Math.round(
                grids.reduce(
                    (sum, grid) =>
                        sum +
                        Number(
                            grid.load || 0
                        ),
                    0
                ) / total
            )
            : 0;

        return {
            total,
            online,
            offline,
            fault,
            generation,
            consumption,
            avgLoad
        };

    }, [grids]);

    // =====================================
    // FORM
    // =====================================

    const handleChange = e => {

        const {
            name,
            value
        } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const resetForm = () => {

        setForm({
            gridId: "",
            gridName: "",
            status: "ONLINE",
            health: "GOOD",
            generation: "",
            consumption: "",
            load: "",
            batteryPower: "",
            voltage: "",
            frequency: "",
            powerFactor: "",
            powerFlow: "NORMAL",
            location: ""
        });

        setEditingId(null);
    };

    // =====================================
    // ADD
    // =====================================

    const openAddModal = () => {

        resetForm();

        setShowModal(true);
    };

    // =====================================
    // EDIT
    // =====================================

    const openEditModal = grid => {

        setEditingId(grid.id);

        setForm({
            gridId: grid.gridId || "",
            gridName: grid.gridName || "",
            status: grid.status || "ONLINE",
            health: grid.health || "GOOD",
            generation: grid.generation ?? "",
            consumption: grid.consumption ?? "",
            load: grid.load ?? "",
            batteryPower: grid.batteryPower ?? "",
            voltage: grid.voltage ?? "",
            frequency: grid.frequency ?? "",
            powerFactor: grid.powerFactor ?? "",
            powerFlow: grid.powerFlow || "NORMAL",
            location: grid.location || ""
        });

        setShowModal(true);
    };

    // =====================================
    // CREATE / UPDATE
    // =====================================

    const handleSubmit = async e => {

        e.preventDefault();

        try {

            const payload = {

                gridId: form.gridId,

                gridName:
                    form.gridName,

                status:
                    form.status,

                health:
                    form.health,

                generation:
                    Number(
                        form.generation || 0
                    ),

                consumption:
                    Number(
                        form.consumption || 0
                    ),

                load:
                    Number(
                        form.load || 0
                    ),

                batteryPower:
                    Number(
                        form.batteryPower || 0
                    ),

                voltage:
                    Number(
                        form.voltage || 0
                    ),

                frequency:
                    Number(
                        form.frequency || 0
                    ),

                powerFactor:
                    Number(
                        form.powerFactor || 0
                    ),

                powerFlow:
                    form.powerFlow,

                location:
                    form.location
            };

            if (editingId) {

                await api.put(
                    `/grid/${editingId}`,
                    payload
                );

            } else {

                await api.post(
                    "/grid",
                    payload
                );

            }

            setShowModal(false);

            resetForm();

            await loadGrids();

        } catch (err) {

            console.error(
                "Save Grid Error:",
                err
            );

            alert(
                err.response?.data?.message ||
                "Unable to save grid."
            );
        }
    };

    // =====================================
    // DELETE
    // =====================================

    const deleteGrid = async id => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this grid?"
            );

        if (!confirmed) return;

        try {

            await api.delete(
                `/grid/${id}`
            );

            await loadGrids();

        } catch (err) {

            console.error(
                "Delete Grid Error:",
                err
            );

            alert(
                err.response?.data?.message ||
                "Unable to delete grid."
            );
        }
    };

    // =====================================
    // RENDER
    // =====================================

    return (

        <div className="gridweaver-layout">

            <Sidebar />

            <main className="grid-page">

                {/* HEADER */}

                <div className="grid-header">

                    <div>

                        <div className="page-label">
                            POWER INFRASTRUCTURE
                        </div>

                        <h1>
                            Grid Management
                        </h1>

                        <p>
                            Monitor and manage your
                            microgrid power network.
                        </p>

                    </div>

                    <button
                        className="add-grid-btn"
                        onClick={openAddModal}
                    >
                        <span>+</span>
                        Add Grid
                    </button>

                </div>

                {/* STATS */}

                <div className="grid-stats">

                    <div className="grid-stat-card">

                        <div className="grid-stat-icon">
                            ⚡
                        </div>

                        <div>
                            <span>
                                Total Grids
                            </span>

                            <strong>
                                {stats.total}
                            </strong>
                        </div>

                    </div>

                    <div className="grid-stat-card">

                        <div className="grid-stat-icon online">
                            ●
                        </div>

                        <div>
                            <span>
                                Online
                            </span>

                            <strong>
                                {stats.online}
                            </strong>
                        </div>

                    </div>

                    <div className="grid-stat-card">

                        <div className="grid-stat-icon">
                            ↑
                        </div>

                        <div>
                            <span>
                                Generation
                            </span>

                            <strong>
                                {stats.generation.toFixed(0)}
                                <small> kW</small>
                            </strong>
                        </div>

                    </div>

                    <div className="grid-stat-card">

                        <div className="grid-stat-icon">
                            ↓
                        </div>

                        <div>
                            <span>
                                Consumption
                            </span>

                            <strong>
                                {stats.consumption.toFixed(0)}
                                <small> kW</small>
                            </strong>
                        </div>

                    </div>

                    <div className="grid-stat-card">

                        <div className="grid-stat-icon">
                            %
                        </div>

                        <div>
                            <span>
                                Average Load
                            </span>

                            <strong>
                                {stats.avgLoad}%
                            </strong>
                        </div>

                    </div>

                </div>

                {/* TOOLBAR */}

                <div className="grid-toolbar">

                    <div className="grid-search">

                        <span>⌕</span>

                        <input
                            type="text"
                            placeholder="Search grid..."
                            value={search}
                            onChange={e =>
                                setSearch(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                    <div className="grid-filters">

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
                                        ? "grid-filter active"
                                        : "grid-filter"
                                }
                                onClick={() =>
                                    setStatusFilter(
                                        status
                                    )
                                }
                            >
                                {status}
                            </button>

                        ))}

                    </div>

                    <button
                        className="grid-refresh"
                        onClick={loadGrids}
                    >
                        ↻ Refresh
                    </button>

                </div>

                {/* LOADING */}

                {loading && (

                    <div className="grid-message">

                        <div className="grid-spinner"></div>

                        Loading grid data...

                    </div>

                )}

                {/* ERROR */}

                {!loading && error && (

                    <div className="grid-error">

                        <span>⚠</span>

                        {error}

                        <button
                            onClick={loadGrids}
                        >
                            Retry
                        </button>

                    </div>

                )}

                {/* EMPTY */}

                {!loading &&
                    !error &&
                    filteredGrids.length === 0 && (

                    <div className="grid-empty">

                        <div>
                            ⚡
                        </div>

                        <h3>
                            No grids found
                        </h3>

                        <p>
                            Add your first grid to
                            start monitoring your
                            power infrastructure.
                        </p>

                        <button
                            className="add-grid-btn"
                            onClick={openAddModal}
                        >
                            + Add Grid
                        </button>

                    </div>

                )}

                {/* TABLE */}

                {!loading &&
                    !error &&
                    filteredGrids.length > 0 && (

                    <div className="grid-table-wrapper">

                        <table className="grid-table">

                            <thead>

                                <tr>

                                    <th>GRID</th>

                                    <th>STATUS</th>

                                    <th>HEALTH</th>

                                    <th>GENERATION</th>

                                    <th>CONSUMPTION</th>

                                    <th>LOAD</th>

                                    <th>BATTERY</th>

                                    <th>VOLTAGE</th>

                                    <th>FREQUENCY</th>

                                    <th>POWER FLOW</th>

                                    <th>LOCATION</th>

                                    <th>ACTION</th>

                                </tr>

                            </thead>

                            <tbody>

                                {filteredGrids.map(
                                    grid => (

                                    <tr key={grid.id}>

                                        <td>

                                            <div className="grid-name">

                                                <div className="grid-symbol">
                                                    ⚡
                                                </div>

                                                <div>

                                                    <strong>
                                                        {grid.gridName}
                                                    </strong>

                                                    <span>
                                                        {grid.gridId}
                                                    </span>

                                                </div>

                                            </div>

                                        </td>

                                        <td>

                                            <span
                                                className={`grid-status ${
                                                    grid.status?.toLowerCase()
                                                }`}
                                            >

                                                <i></i>

                                                {grid.status}

                                            </span>

                                        </td>

                                        <td>

                                            <span
                                                className={`health-badge ${
                                                    grid.health?.toLowerCase()
                                                }`}
                                            >
                                                {grid.health}
                                            </span>

                                        </td>

                                        <td>

                                            <strong>
                                                {grid.generation ?? 0}
                                            </strong>

                                            <span className="unit">
                                                kW
                                            </span>

                                        </td>

                                        <td>

                                            <strong>
                                                {grid.consumption ?? 0}
                                            </strong>

                                            <span className="unit">
                                                kW
                                            </span>

                                        </td>

                                        <td>

                                            <div className="load-cell">

                                                <strong>
                                                    {grid.load ?? 0}%
                                                </strong>

                                                <div className="load-track">

                                                    <div
                                                        style={{
                                                            width: `${Math.min(
                                                                100,
                                                                Math.max(
                                                                    0,
                                                                    Number(
                                                                        grid.load || 0
                                                                    )
                                                                )
                                                            )}%`
                                                        }}
                                                    />

                                                </div>

                                            </div>

                                        </td>

                                        <td>
                                            {grid.batteryPower ?? 0}
                                            <span className="unit">
                                                {" "}kW
                                            </span>
                                        </td>

                                        <td>
                                            {grid.voltage ?? 0}
                                            <span className="unit">
                                                {" "}V
                                            </span>
                                        </td>

                                        <td>
                                            {grid.frequency ?? 0}
                                            <span className="unit">
                                                {" "}Hz
                                            </span>
                                        </td>

                                        <td>

                                            <span
                                                className={
                                                    `power-flow ${
                                                        grid.powerFlow
                                                            ?.toLowerCase()
                                                    }`
                                                }
                                            >
                                                {grid.powerFlow}
                                            </span>

                                        </td>

                                        <td>
                                            {grid.location || "—"}
                                        </td>

                                        <td>

                                            <div className="grid-actions">

                                                <button
                                                    onClick={() =>
                                                        openEditModal(
                                                            grid
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="delete"
                                                    onClick={() =>
                                                        deleteGrid(
                                                            grid.id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

                {/* MODAL */}

                {showModal && (

                    <div
                        className="grid-modal-overlay"
                        onMouseDown={e => {

                            if (
                                e.target ===
                                e.currentTarget
                            ) {
                                setShowModal(false);
                            }

                        }}
                    >

                        <div className="grid-modal">

                            <div className="grid-modal-header">

                                <div>

                                    <span>
                                        GRID MANAGEMENT
                                    </span>

                                    <h2>
                                        {editingId
                                            ? "Edit Grid"
                                            : "Add New Grid"}
                                    </h2>

                                </div>

                                <button
                                    className="grid-close"
                                    onClick={() =>
                                        setShowModal(false)
                                    }
                                >
                                    ×
                                </button>

                            </div>

                            <form
                                className="grid-form"
                                onSubmit={handleSubmit}
                            >

                                <div className="grid-form-title">
                                    Basic Information
                                </div>

                                <div className="grid-form-grid">

                                    <div className="grid-field">

                                        <label>
                                            Grid ID
                                        </label>

                                        <input
                                            name="gridId"
                                            value={form.gridId}
                                            onChange={handleChange}
                                            placeholder="GRID-001"
                                            required
                                        />

                                    </div>

                                    <div className="grid-field">

                                        <label>
                                            Grid Name
                                        </label>

                                        <input
                                            name="gridName"
                                            value={form.gridName}
                                            onChange={handleChange}
                                            placeholder="Main Microgrid"
                                            required
                                        />

                                    </div>

                                    <div className="grid-field">

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

                                    <div className="grid-field">

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

                                </div>

                                <div className="grid-form-title">
                                    Power Metrics
                                </div>

                                <div className="grid-form-grid">

                                    <div className="grid-field">

                                        <label>
                                            Generation (kW)
                                        </label>

                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            name="generation"
                                            value={form.generation}
                                            onChange={handleChange}
                                        />

                                    </div>

                                    <div className="grid-field">

                                        <label>
                                            Consumption (kW)
                                        </label>

                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            name="consumption"
                                            value={form.consumption}
                                            onChange={handleChange}
                                        />

                                    </div>

                                    <div className="grid-field">

                                        <label>
                                            Grid Load (%)
                                        </label>

                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            step="0.1"
                                            name="load"
                                            value={form.load}
                                            onChange={handleChange}
                                        />

                                    </div>

                                    <div className="grid-field">

                                        <label>
                                            Battery Power (kW)
                                        </label>

                                        <input
                                            type="number"
                                            step="0.01"
                                            name="batteryPower"
                                            value={form.batteryPower}
                                            onChange={handleChange}
                                        />

                                    </div>

                                </div>

                                <div className="grid-form-title">
                                    Electrical Telemetry
                                </div>

                                <div className="grid-form-grid">

                                    <div className="grid-field">

                                        <label>
                                            Voltage (V)
                                        </label>

                                        <input
                                            type="number"
                                            step="0.01"
                                            name="voltage"
                                            value={form.voltage}
                                            onChange={handleChange}
                                        />

                                    </div>

                                    <div className="grid-field">

                                        <label>
                                            Frequency (Hz)
                                        </label>

                                        <input
                                            type="number"
                                            step="0.01"
                                            name="frequency"
                                            value={form.frequency}
                                            onChange={handleChange}
                                        />

                                    </div>

                                    <div className="grid-field">

                                        <label>
                                            Power Factor
                                        </label>

                                        <input
                                            type="number"
                                            min="0"
                                            max="1"
                                            step="0.01"
                                            name="powerFactor"
                                            value={form.powerFactor}
                                            onChange={handleChange}
                                        />

                                    </div>

                                    <div className="grid-field">

                                        <label>
                                            Health
                                        </label>

                                        <select
                                            name="health"
                                            value={form.health}
                                            onChange={handleChange}
                                        >

                                            <option>
                                                GOOD
                                            </option>

                                            <option>
                                                WARNING
                                            </option>

                                            <option>
                                                CRITICAL
                                            </option>

                                        </select>

                                    </div>

                                </div>

                                <div className="grid-form-title">
                                    Power Flow
                                </div>

                                <div className="grid-form-grid">

                                    <div className="grid-field">

                                        <label>
                                            Power Flow
                                        </label>

                                        <select
                                            name="powerFlow"
                                            value={form.powerFlow}
                                            onChange={handleChange}
                                        >

                                            <option>
                                                NORMAL
                                            </option>

                                            <option>
                                                IMPORT
                                            </option>

                                            <option>
                                                EXPORT
                                            </option>

                                        </select>

                                    </div>

                                </div>

                                <div className="grid-modal-actions">

                                    <button
                                        type="button"
                                        className="grid-cancel"
                                        onClick={() =>
                                            setShowModal(false)
                                        }
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="grid-save"
                                    >
                                        {editingId
                                            ? "Update Grid"
                                            : "Create Grid"}
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

export default Grid;