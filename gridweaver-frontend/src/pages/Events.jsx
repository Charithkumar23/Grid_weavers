import { useEffect, useMemo, useState } from "react";
import { api } from "../service/api";
import Sidebar from "../components/Sidebar";
import "./Events.css";

function Events() {

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [severityFilter, setSeverityFilter] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const [showModal, setShowModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);

    const [form, setForm] = useState({
        eventId: "",
        eventType: "",
        severity: "INFO",
        message: "",
        deviceId: "",
        location: "",
        status: "OPEN"
    });

    /* =========================
       LOAD EVENTS
    ========================= */

    const loadEvents = async () => {

        try {

            setLoading(true);

            const response = await api.get("/events");

            const data = response.data;

            if (Array.isArray(data)) {
                setEvents(data);
            } else if (Array.isArray(data.events)) {
                setEvents(data.events);
            } else {
                setEvents([]);
            }

        } catch (error) {

            console.error("Failed to load events:", error);

            setEvents([]);

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        loadEvents();
    }, []);

    /* =========================
       STATISTICS
    ========================= */

    const statistics = useMemo(() => {

        const total = events.length;

        const critical = events.filter(
            event =>
                event.severity?.toUpperCase() === "CRITICAL"
        ).length;

        const warning = events.filter(
            event =>
                event.severity?.toUpperCase() === "WARNING"
        ).length;

        const info = events.filter(
            event =>
                event.severity?.toUpperCase() === "INFO"
        ).length;

        const open = events.filter(
            event =>
                event.status?.toUpperCase() === "OPEN"
        ).length;

        const resolved = events.filter(
            event =>
                event.status?.toUpperCase() === "RESOLVED"
        ).length;

        return {
            total,
            critical,
            warning,
            info,
            open,
            resolved
        };

    }, [events]);

    /* =========================
       FILTER EVENTS
    ========================= */

    const filteredEvents = useMemo(() => {

        return events.filter(event => {

            const searchText =
                search.trim().toLowerCase();

            const matchesSearch =
                !searchText ||
                event.eventId
                    ?.toLowerCase()
                    .includes(searchText) ||
                event.eventType
                    ?.toLowerCase()
                    .includes(searchText) ||
                event.message
                    ?.toLowerCase()
                    .includes(searchText) ||
                event.deviceId
                    ?.toLowerCase()
                    .includes(searchText) ||
                event.location
                    ?.toLowerCase()
                    .includes(searchText);

            const matchesSeverity =
                severityFilter === "ALL" ||
                event.severity?.toUpperCase() ===
                    severityFilter;

            const matchesStatus =
                statusFilter === "ALL" ||
                event.status?.toUpperCase() ===
                    statusFilter;

            return (
                matchesSearch &&
                matchesSeverity &&
                matchesStatus
            );
        });

    }, [
        events,
        search,
        severityFilter,
        statusFilter
    ]);

    /* =========================
       CREATE MODAL
    ========================= */

    const openCreateModal = () => {

        setEditingEvent(null);

        setForm({
            eventId: "",
            eventType: "",
            severity: "INFO",
            message: "",
            deviceId: "",
            location: "",
            status: "OPEN"
        });

        setShowModal(true);
    };

    /* =========================
       EDIT MODAL
    ========================= */

    const openEditModal = (event) => {

        setEditingEvent(event);

        setForm({
            eventId: event.eventId || "",
            eventType: event.eventType || "",
            severity: event.severity || "INFO",
            message: event.message || "",
            deviceId: event.deviceId || "",
            location: event.location || "",
            status: event.status || "OPEN"
        });

        setShowModal(true);
    };

    /* =========================
       CLOSE MODAL
    ========================= */

    const closeModal = () => {

        setShowModal(false);
        setEditingEvent(null);

    };

    /* =========================
       FORM CHANGE
    ========================= */

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value
        }));

    };

    /* =========================
       SAVE EVENT
    ========================= */

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            if (editingEvent) {

                await api.put(
                    `/events/${editingEvent.id}`,
                    form
                );

                alert("Event updated successfully");

            } else {

                await api.post(
                    "/events",
                    form
                );

                alert("Event created successfully");
            }

            closeModal();

            await loadEvents();

        } catch (error) {

            console.error(
                "Event save error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to save event"
            );
        }
    };

    /* =========================
       DELETE EVENT
    ========================= */

    const deleteEvent = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this event?"
            );

        if (!confirmDelete) {
            return;
        }

        try {

            await api.delete(
                `/events/${id}`
            );

            await loadEvents();

        } catch (error) {

            console.error(
                "Delete error:",
                error
            );

            alert(
                "Unable to delete event"
            );
        }
    };

    /* =========================
       DATE FORMAT
    ========================= */

    const formatDate = (date) => {

        if (!date) {
            return "--";
        }

        try {

            return new Date(date).toLocaleString(
                "en-IN",
                {
                    dateStyle: "medium",
                    timeStyle: "short"
                }
            );

        } catch {

            return date;

        }
    };

    /* =========================
       SEVERITY ICON
    ========================= */

    const getSeverityIcon = (severity) => {

        switch (
            severity?.toUpperCase()
        ) {

            case "CRITICAL":
                return "🚨";

            case "WARNING":
                return "⚠️";

            case "INFO":
                return "ℹ️";

            default:
                return "●";
        }
    };

    return (

        <div className="events-layout">

            {/* =========================
                SIDEBAR
            ========================= */}

            <Sidebar />

            {/* =========================
                MAIN CONTENT
            ========================= */}

            <main className="events-main">

                <div className="events-page">

                    {/* =========================
                        HEADER
                    ========================= */}

                    <div className="events-header">

                        <div className="events-title-row">

                            <div className="events-title-icon">
                                ⚡
                            </div>

                            <div>

                                <h1>
                                    Events
                                </h1>

                                <p>
                                    Real-time microgrid event
                                    monitoring and system alerts
                                </p>

                            </div>

                        </div>

                        <div className="events-header-actions">

                            <button
                                className="events-refresh-btn"
                                onClick={loadEvents}
                                disabled={loading}
                            >
                                <span>↻</span>
                                Refresh
                            </button>

                            <button
                                className="events-add-btn"
                                onClick={openCreateModal}
                            >
                                <span>+</span>
                                Add Event
                            </button>

                        </div>

                    </div>

                    {/* =========================
                        STATISTICS
                    ========================= */}

                    <div className="event-stats">

                        <div className="event-stat-card">

                            <div className="event-stat-icon total">
                                ⚡
                            </div>

                            <div className="event-stat-content">

                                <span>
                                    Total Events
                                </span>

                                <strong>
                                    {statistics.total}
                                </strong>

                            </div>

                        </div>

                        <div className="event-stat-card">

                            <div className="event-stat-icon critical">
                                🚨
                            </div>

                            <div className="event-stat-content">

                                <span>
                                    Critical
                                </span>

                                <strong>
                                    {statistics.critical}
                                </strong>

                            </div>

                        </div>

                        <div className="event-stat-card">

                            <div className="event-stat-icon warning">
                                ⚠
                            </div>

                            <div className="event-stat-content">

                                <span>
                                    Warnings
                                </span>

                                <strong>
                                    {statistics.warning}
                                </strong>

                            </div>

                        </div>

                        <div className="event-stat-card">

                            <div className="event-stat-icon info">
                                ℹ
                            </div>

                            <div className="event-stat-content">

                                <span>
                                    Information
                                </span>

                                <strong>
                                    {statistics.info}
                                </strong>

                            </div>

                        </div>

                        <div className="event-stat-card">

                            <div className="event-stat-icon open">
                                ◉
                            </div>

                            <div className="event-stat-content">

                                <span>
                                    Open Events
                                </span>

                                <strong>
                                    {statistics.open}
                                </strong>

                            </div>

                        </div>

                    </div>

                    {/* =========================
                        FILTER TOOLBAR
                    ========================= */}

                    <div className="events-toolbar">

                        <div className="event-search">

                            <span className="search-icon">
                                ⌕
                            </span>

                            <input
                                type="text"
                                placeholder="Search event, device, location..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />

                            {search && (
                                <button
                                    className="clear-search"
                                    onClick={() =>
                                        setSearch("")
                                    }
                                >
                                    ×
                                </button>
                            )}

                        </div>

                        <select
                            value={severityFilter}
                            onChange={(e) =>
                                setSeverityFilter(
                                    e.target.value
                                )
                            }
                        >

                            <option value="ALL">
                                All Severity
                            </option>

                            <option value="CRITICAL">
                                Critical
                            </option>

                            <option value="WARNING">
                                Warning
                            </option>

                            <option value="INFO">
                                Info
                            </option>

                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(
                                    e.target.value
                                )
                            }
                        >

                            <option value="ALL">
                                All Status
                            </option>

                            <option value="OPEN">
                                Open
                            </option>

                            <option value="RESOLVED">
                                Resolved
                            </option>

                        </select>

                        {(search ||
                            severityFilter !== "ALL" ||
                            statusFilter !== "ALL") && (

                            <button
                                className="reset-filters"
                                onClick={() => {

                                    setSearch("");
                                    setSeverityFilter("ALL");
                                    setStatusFilter("ALL");

                                }}
                            >
                                Reset
                            </button>

                        )}

                    </div>

                    {/* =========================
                        EVENT PANEL
                    ========================= */}

                    <div className="events-panel">

                        <div className="events-panel-header">

                            <div className="event-log-heading">

                                <div>

                                    <h2>
                                        Event Log
                                    </h2>

                                    <span>
                                        Showing{" "}
                                        {filteredEvents.length}{" "}
                                        of {events.length} events
                                    </span>

                                </div>

                            </div>

                            <div className="live-indicator">

                                <span></span>

                                LIVE MONITORING

                            </div>

                        </div>

                        {/* LOADING */}

                        {loading ? (

                            <div className="events-loading">

                                <div className="loading-spinner"></div>

                                <p>
                                    Loading events...
                                </p>

                            </div>

                        ) : filteredEvents.length === 0 ? (

                            /* EMPTY */

                            <div className="events-empty">

                                <div className="empty-icon">
                                    ⚡
                                </div>

                                <h3>
                                    No events found
                                </h3>

                                <p>
                                    There are no events matching
                                    your current filters.
                                </p>

                                <button
                                    onClick={openCreateModal}
                                >
                                    + Create Event
                                </button>

                            </div>

                        ) : (

                            /* TABLE */

                            <div className="events-table-wrapper">

                                <table className="events-table">

                                    <thead>

                                        <tr>

                                            <th>
                                                EVENT
                                            </th>

                                            <th>
                                                TYPE
                                            </th>

                                            <th>
                                                SEVERITY
                                            </th>

                                            <th>
                                                MESSAGE
                                            </th>

                                            <th>
                                                DEVICE
                                            </th>

                                            <th>
                                                LOCATION
                                            </th>

                                            <th>
                                                STATUS
                                            </th>

                                            <th>
                                                TIME
                                            </th>

                                            <th>
                                                ACTION
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {filteredEvents.map(
                                            event => (

                                                <tr
                                                    key={
                                                        event.id
                                                    }
                                                >

                                                    <td>

                                                        <div className="event-id-cell">

                                                            <div className="event-row-icon">

                                                                {getSeverityIcon(
                                                                    event.severity
                                                                )}

                                                            </div>

                                                            <div>

                                                                <strong>
                                                                    {
                                                                        event.eventId
                                                                    }
                                                                </strong>

                                                                <small>
                                                                    ID
                                                                </small>

                                                            </div>

                                                        </div>

                                                    </td>

                                                    <td>

                                                        <span className="event-type">

                                                            {event.eventType
                                                                ?.replace(
                                                                    /_/g,
                                                                    " "
                                                                )}

                                                        </span>

                                                    </td>

                                                    <td>

                                                        <span
                                                            className={`severity-badge ${
                                                                event.severity?.toLowerCase()
                                                            }`}
                                                        >

                                                            <span></span>

                                                            {
                                                                event.severity
                                                            }

                                                        </span>

                                                    </td>

                                                    <td>

                                                        <div className="event-message">

                                                            {
                                                                event.message
                                                            }

                                                        </div>

                                                    </td>

                                                    <td>

                                                        <span className="device-text">

                                                            {event.deviceId ||
                                                                "--"}

                                                        </span>

                                                    </td>

                                                    <td>

                                                        <span className="location-text">

                                                            <span>
                                                                📍
                                                            </span>

                                                            {event.location ||
                                                                "--"}

                                                        </span>

                                                    </td>

                                                    <td>

                                                        <span
                                                            className={`status-badge ${
                                                                event.status?.toLowerCase()
                                                            }`}
                                                        >
                                                            {
                                                                event.status
                                                            }
                                                        </span>

                                                    </td>

                                                    <td>

                                                        <span className="event-time">

                                                            {formatDate(
                                                                event.eventTime
                                                            )}

                                                        </span>

                                                    </td>

                                                    <td>

                                                        <div className="event-actions">

                                                            <button
                                                                className="edit-event-btn"
                                                                onClick={() =>
                                                                    openEditModal(
                                                                        event
                                                                    )
                                                                }
                                                                title="Edit Event"
                                                            >
                                                                ✎
                                                            </button>

                                                            <button
                                                                className="delete-event-btn"
                                                                onClick={() =>
                                                                    deleteEvent(
                                                                        event.id
                                                                    )
                                                                }
                                                                title="Delete Event"
                                                            >
                                                                🗑
                                                            </button>

                                                        </div>

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                </div>

            </main>

            {/* =========================
                MODAL
            ========================= */}

            {showModal && (

                <div
                    className="event-modal-overlay"
                    onMouseDown={(e) => {

                        if (
                            e.target.classList.contains(
                                "event-modal-overlay"
                            )
                        ) {
                            closeModal();
                        }

                    }}
                >

                    <div className="event-modal">

                        <div className="event-modal-header">

                            <div className="modal-header-left">

                                <div className="modal-title-icon">
                                    ⚡
                                </div>

                                <div>

                                    <h2>
                                        {editingEvent
                                            ? "Edit Event"
                                            : "Create Event"}
                                    </h2>

                                    <p>
                                        Configure microgrid
                                        event details
                                    </p>

                                </div>

                            </div>

                            <button
                                className="modal-close"
                                onClick={closeModal}
                            >
                                ×
                            </button>

                        </div>

                        <form
                            onSubmit={handleSubmit}
                        >

                            <div className="event-form-grid">

                                <div className="form-group">

                                    <label>
                                        Event ID *
                                    </label>

                                    <input
                                        name="eventId"
                                        value={form.eventId}
                                        onChange={handleChange}
                                        placeholder="EVT-001"
                                        disabled={
                                            !!editingEvent
                                        }
                                        required
                                    />

                                </div>

                                <div className="form-group">

                                    <label>
                                        Event Type *
                                    </label>

                                    <select
                                        name="eventType"
                                        value={form.eventType}
                                        onChange={handleChange}
                                        required
                                    >

                                        <option value="">
                                            Select event type
                                        </option>

                                        <option value="POWER_FAILURE">
                                            Power Failure
                                        </option>

                                        <option value="HIGH_LOAD">
                                            High Load
                                        </option>

                                        <option value="BATTERY_LOW">
                                            Battery Low
                                        </option>

                                        <option value="BATTERY_FAULT">
                                            Battery Fault
                                        </option>

                                        <option value="DEVICE_OFFLINE">
                                            Device Offline
                                        </option>

                                        <option value="VOLTAGE_ALERT">
                                            Voltage Alert
                                        </option>

                                        <option value="TEMPERATURE_ALERT">
                                            Temperature Alert
                                        </option>

                                        <option value="SYSTEM_CHECK">
                                            System Check
                                        </option>

                                    </select>

                                </div>

                                <div className="form-group">

                                    <label>
                                        Severity
                                    </label>

                                    <select
                                        name="severity"
                                        value={form.severity}
                                        onChange={handleChange}
                                    >

                                        <option value="INFO">
                                            Info
                                        </option>

                                        <option value="WARNING">
                                            Warning
                                        </option>

                                        <option value="CRITICAL">
                                            Critical
                                        </option>

                                    </select>

                                </div>

                                <div className="form-group">

                                    <label>
                                        Status
                                    </label>

                                    <select
                                        name="status"
                                        value={form.status}
                                        onChange={handleChange}
                                    >

                                        <option value="OPEN">
                                            Open
                                        </option>

                                        <option value="RESOLVED">
                                            Resolved
                                        </option>

                                    </select>

                                </div>

                                <div className="form-group">

                                    <label>
                                        Device ID
                                    </label>

                                    <input
                                        name="deviceId"
                                        value={form.deviceId}
                                        onChange={handleChange}
                                        placeholder="DEV-001"
                                    />

                                </div>

                                <div className="form-group">

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

                                <div className="form-group full">

                                    <label>
                                        Event Message *
                                    </label>

                                    <textarea
                                        name="message"
                                        value={form.message}
                                        onChange={handleChange}
                                        placeholder="Enter event details..."
                                        rows="4"
                                        required
                                    />

                                </div>

                            </div>

                            <div className="event-modal-footer">

                                <button
                                    type="button"
                                    className="cancel-event-btn"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="save-event-btn"
                                >
                                    {editingEvent
                                        ? "Update Event"
                                        : "Create Event"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Events;