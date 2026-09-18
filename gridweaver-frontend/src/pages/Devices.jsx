import React, { useEffect, useMemo, useState } from "react";

import Sidebar from "../components/Sidebar";
import api from "../service/api";
import "./Devices.css";

function Devices() {

    const [devices, setDevices] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [typeFilter, setTypeFilter] = useState("ALL");

    const [statusFilter, setStatusFilter] = useState("ALL");

    const [showModal, setShowModal] = useState(false);

    const [editingDevice, setEditingDevice] = useState(null);

    const [message, setMessage] = useState("");


    const [formData, setFormData] = useState({
        deviceId: "",
        deviceName: "",
        deviceType: "SOLAR",
        latitude: "",
        longitude: "",
        powerGeneration: 0,
        powerConsumption: 0,
        batteryLevel: 0,
        status: "ONLINE",
    });


    // ========================================
    // LOAD DEVICES FROM DATABASE
    // ========================================

    const loadDevices = async () => {

        try {

            setLoading(true);

            setMessage("");

            console.log("Loading devices from database...");

            const response = await api.get("/devices");

            console.log("Device API response:", response.data);


            /*
             * Backend can return either:
             *
             * 1. { devices: [...] }
             *
             * OR
             *
             * 2. [...]
             *
             * This code supports both.
             */

            let deviceData = [];

            if (Array.isArray(response.data)) {

                deviceData = response.data;

            } else if (
                response.data &&
                Array.isArray(response.data.devices)
            ) {

                deviceData = response.data.devices;

            }


            console.log(
                "Devices loaded from database:",
                deviceData
            );


            setDevices(deviceData);

        } catch (error) {

            console.error(
                "Unable to load devices:",
                error
            );


            if (error.response) {

                console.error(
                    "Backend status:",
                    error.response.status
                );

                console.error(
                    "Backend response:",
                    error.response.data
                );

            }


            setDevices([]);


            setMessage(
                error.response?.data?.message ||
                "Unable to connect to GridWeaver backend."
            );

        } finally {

            setLoading(false);

        }
    };


    // ========================================
    // LOAD DATABASE DATA WHEN PAGE OPENS
    // ========================================

    useEffect(() => {

        loadDevices();

    }, []);


    // ========================================
    // FORM INPUT
    // ========================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

    };


    // ========================================
    // OPEN ADD MODAL
    // ========================================

    const openAddModal = () => {

        setEditingDevice(null);

        setFormData({
            deviceId: "",
            deviceName: "",
            deviceType: "SOLAR",
            latitude: "",
            longitude: "",
            powerGeneration: 0,
            powerConsumption: 0,
            batteryLevel: 0,
            status: "ONLINE",
        });

        setShowModal(true);

    };


    // ========================================
    // OPEN EDIT MODAL
    // ========================================

    const openEditModal = (device) => {

        setEditingDevice(device);

        setFormData({
            deviceId: device.deviceId || "",
            deviceName: device.deviceName || "",
            deviceType: device.deviceType || "SOLAR",

            latitude:
                device.latitude !== null &&
                device.latitude !== undefined
                    ? device.latitude
                    : "",

            longitude:
                device.longitude !== null &&
                device.longitude !== undefined
                    ? device.longitude
                    : "",

            powerGeneration:
                device.powerGeneration !== null &&
                device.powerGeneration !== undefined
                    ? device.powerGeneration
                    : 0,

            powerConsumption:
                device.powerConsumption !== null &&
                device.powerConsumption !== undefined
                    ? device.powerConsumption
                    : 0,

            batteryLevel:
                device.batteryLevel !== null &&
                device.batteryLevel !== undefined
                    ? device.batteryLevel
                    : 0,

            status: device.status || "ONLINE",
        });

        setShowModal(true);

    };


    // ========================================
    // SAVE DEVICE
    // ========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const payload = {

                deviceId: formData.deviceId,

                deviceName: formData.deviceName,

                deviceType: formData.deviceType,

                latitude: Number(
                    formData.latitude
                ),

                longitude: Number(
                    formData.longitude
                ),

                powerGeneration: Number(
                    formData.powerGeneration
                ),

                powerConsumption: Number(
                    formData.powerConsumption
                ),

                batteryLevel: Number(
                    formData.batteryLevel
                ),

                status: formData.status,

            };


            console.log(
                "Sending device to backend:",
                payload
            );


            // ====================================
            // UPDATE DEVICE
            // ====================================

            if (editingDevice) {

                await api.put(
                    `/devices/${editingDevice.id}`,
                    payload
                );

                setMessage(
                    "Device updated successfully."
                );

            }


            // ====================================
            // CREATE DEVICE
            // ====================================

            else {

                await api.post(
                    "/devices",
                    payload
                );

                setMessage(
                    "Device added successfully."
                );

            }


            setShowModal(false);


            // Reload data from MySQL
            await loadDevices();


        } catch (error) {

            console.error(
                "Save device error:",
                error
            );


            setMessage(
                error.response?.data?.message ||
                "Unable to save device."
            );

        }

    };


    // ========================================
    // DELETE DEVICE
    // ========================================

    const deleteDevice = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this device?"
            );


        if (!confirmed) {
            return;
        }


        try {

            await api.delete(
                `/devices/${id}`
            );


            setMessage(
                "Device deleted successfully."
            );


            // Reload from MySQL
            await loadDevices();


        } catch (error) {

            console.error(
                "Delete device error:",
                error
            );


            setMessage(
                error.response?.data?.message ||
                "Unable to delete device."
            );

        }

    };


    // ========================================
    // FILTER DEVICES
    // ========================================

    const filteredDevices = useMemo(() => {

        return devices.filter((device) => {

            const searchText =
                search.toLowerCase().trim();


            const deviceId =
                String(
                    device.deviceId || ""
                ).toLowerCase();


            const deviceName =
                String(
                    device.deviceName || ""
                ).toLowerCase();


            const matchesSearch =
                deviceId.includes(searchText) ||
                deviceName.includes(searchText);


            const matchesType =
                typeFilter === "ALL" ||
                device.deviceType === typeFilter;


            const matchesStatus =
                statusFilter === "ALL" ||
                device.status === statusFilter;


            return (
                matchesSearch &&
                matchesType &&
                matchesStatus
            );

        });

    }, [
        devices,
        search,
        typeFilter,
        statusFilter
    ]);


    // ========================================
    // STATISTICS
    // ========================================

    const totalDevices =
        devices.length;


    const onlineDevices =
        devices.filter(
            (device) =>
                device.status === "ONLINE"
        ).length;


    const offlineDevices =
        devices.filter(
            (device) =>
                device.status === "OFFLINE"
        ).length;


    const faultDevices =
        devices.filter(
            (device) =>
                device.status === "FAULT"
        ).length;


    // ========================================
    // PAGE
    // ========================================

    return (

        <div className="devices-layout">

            <Sidebar />


            <main className="devices-main">


                {/* ================================= */}
                {/* HEADER */}
                {/* ================================= */}

                <header className="devices-header">

                    <div>

                        <div className="page-breadcrumb">
                            GridWeaver / Devices
                        </div>


                        <h1>
                            IoT Devices
                        </h1>


                        <p>
                            Monitor and manage all connected
                            microgrid devices.
                        </p>

                    </div>


                    <button
                        className="add-device-btn"
                        onClick={openAddModal}
                    >

                        <span>
                            +
                        </span>

                        Add Device

                    </button>

                </header>


                {/* ================================= */}
                {/* MESSAGE */}
                {/* ================================= */}

                {message && (

                    <div className="device-message">

                        <span>
                            ✓
                        </span>

                        {message}


                        <button
                            onClick={() =>
                                setMessage("")
                            }
                        >
                            ×
                        </button>

                    </div>

                )}


                {/* ================================= */}
                {/* STATS */}
                {/* ================================= */}

                <section className="device-stats">


                    <div className="device-stat-card">

                        <div className="stat-icon total">
                            ◉
                        </div>


                        <div>

                            <span>
                                Total Devices
                            </span>

                            <strong>
                                {totalDevices}
                            </strong>

                        </div>

                    </div>



                    <div className="device-stat-card">

                        <div className="stat-icon online">
                            ✓
                        </div>


                        <div>

                            <span>
                                Online
                            </span>

                            <strong>
                                {onlineDevices}
                            </strong>

                        </div>

                    </div>



                    <div className="device-stat-card">

                        <div className="stat-icon offline">
                            ○
                        </div>


                        <div>

                            <span>
                                Offline
                            </span>

                            <strong>
                                {offlineDevices}
                            </strong>

                        </div>

                    </div>



                    <div className="device-stat-card">

                        <div className="stat-icon fault">
                            !
                        </div>


                        <div>

                            <span>
                                Faults
                            </span>

                            <strong>
                                {faultDevices}
                            </strong>

                        </div>

                    </div>

                </section>



                {/* ================================= */}
                {/* TOOLBAR */}
                {/* ================================= */}

                <section className="devices-panel">


                    <div className="devices-toolbar">


                        <div className="search-box">

                            <span>
                                ⌕
                            </span>


                            <input
                                type="text"
                                placeholder="Search device ID or name..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />

                        </div>



                        <select
                            value={typeFilter}
                            onChange={(e) =>
                                setTypeFilter(
                                    e.target.value
                                )
                            }
                        >

                            <option value="ALL">
                                All Types
                            </option>


                            <option value="SOLAR">
                                Solar
                            </option>


                            <option value="BATTERY">
                                Battery
                            </option>


                            <option value="GRID">
                                Grid
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


                            <option value="ONLINE">
                                Online
                            </option>


                            <option value="OFFLINE">
                                Offline
                            </option>


                            <option value="FAULT">
                                Fault
                            </option>

                        </select>



                        <button
                            className="refresh-device-btn"
                            onClick={loadDevices}
                            title="Refresh devices"
                        >
                            ↻
                        </button>

                    </div>



                    {/* ================================= */}
                    {/* TABLE */}
                    {/* ================================= */}

                    {loading ? (

                        <div className="device-loading">

                            <div className="loading-spinner"></div>

                            Loading devices...

                        </div>

                    ) : filteredDevices.length === 0 ? (

                        <div className="empty-devices">

                            <div className="empty-icon">
                                ◉
                            </div>


                            <h3>
                                No devices found
                            </h3>


                            <p>
                                No device records were found
                                in the database.
                            </p>


                            <button
                                onClick={openAddModal}
                            >
                                + Add Device
                            </button>

                        </div>

                    ) : (

                        <div className="table-wrapper">

                            <table className="devices-table">


                                <thead>

                                    <tr>

                                        <th>
                                            DEVICE
                                        </th>

                                        <th>
                                            TYPE
                                        </th>

                                        <th>
                                            STATUS
                                        </th>

                                        <th>
                                            GENERATION
                                        </th>

                                        <th>
                                            CONSUMPTION
                                        </th>

                                        <th>
                                            BATTERY
                                        </th>

                                        <th>
                                            LOCATION
                                        </th>

                                        <th>
                                            ACTION
                                        </th>

                                    </tr>

                                </thead>



                                <tbody>

                                    {filteredDevices.map(
                                        (device) => (

                                            <tr
                                                key={device.id}
                                            >


                                                {/* DEVICE */}

                                                <td>

                                                    <div className="device-name-cell">


                                                        <div className="device-avatar">

                                                            {device.deviceType === "SOLAR"

                                                                ? "☀"

                                                                : device.deviceType === "BATTERY"

                                                                    ? "▣"

                                                                    : "⌁"}

                                                        </div>


                                                        <div>

                                                            <strong>

                                                                {
                                                                    device.deviceName ||
                                                                    device.name ||
                                                                    "Unnamed Device"
                                                                }

                                                            </strong>


                                                            <span>

                                                                {
                                                                    device.deviceId ||
                                                                    device.id
                                                                }

                                                            </span>

                                                        </div>

                                                    </div>

                                                </td>



                                                {/* TYPE */}

                                                <td>

                                                    <span className="type-badge">

                                                        {
                                                            device.deviceType ||
                                                            "UNKNOWN"
                                                        }

                                                    </span>

                                                </td>



                                                {/* STATUS */}

                                                <td>

                                                    <span
                                                        className={`status-badge ${
                                                            device.status
                                                                ?.toLowerCase() ||
                                                            "offline"
                                                        }`}
                                                    >

                                                        <span></span>

                                                        {
                                                            device.status ||
                                                            "OFFLINE"
                                                        }

                                                    </span>

                                                </td>



                                                {/* GENERATION */}

                                                <td>

                                                    <strong>

                                                        {Number(
                                                            device.powerGeneration ||
                                                            0
                                                        ).toFixed(1)}

                                                    </strong>


                                                    <small>
                                                        kW
                                                    </small>

                                                </td>



                                                {/* CONSUMPTION */}

                                                <td>

                                                    <strong>

                                                        {Number(
                                                            device.powerConsumption ||
                                                            0
                                                        ).toFixed(1)}

                                                    </strong>


                                                    <small>
                                                        kW
                                                    </small>

                                                </td>



                                                {/* BATTERY */}

                                                <td>

                                                    <div className="battery-cell">


                                                        <div className="battery-bar">

                                                            <div
                                                                style={{
                                                                    width: `${Math.min(
                                                                        100,
                                                                        Math.max(
                                                                            0,
                                                                            Number(
                                                                                device.batteryLevel ||
                                                                                0
                                                                            )
                                                                        )
                                                                    )}%`
                                                                }}
                                                            ></div>

                                                        </div>


                                                        <span>

                                                            {Number(
                                                                device.batteryLevel ||
                                                                0
                                                            ).toFixed(0)}

                                                            %

                                                        </span>

                                                    </div>

                                                </td>



                                                {/* LOCATION */}

                                                <td>

                                                    <span className="location-cell">

                                                        {Number(
                                                            device.latitude ||
                                                            0
                                                        ).toFixed(4)}

                                                        ,

                                                        {Number(
                                                            device.longitude ||
                                                            0
                                                        ).toFixed(4)}

                                                    </span>

                                                </td>



                                                {/* ACTION */}

                                                <td>

                                                    <div className="action-buttons">


                                                        <button
                                                            className="edit-btn"
                                                            onClick={() =>
                                                                openEditModal(
                                                                    device
                                                                )
                                                            }
                                                        >

                                                            Edit

                                                        </button>


                                                        <button
                                                            className="delete-btn"
                                                            onClick={() =>
                                                                deleteDevice(
                                                                    device.id
                                                                )
                                                            }
                                                        >

                                                            Delete

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

                </section>

            </main>



            {/* ================================= */}
            {/* ADD / EDIT MODAL */}
            {/* ================================= */}

            {showModal && (

                <div
                    className="modal-overlay"
                    onClick={() =>
                        setShowModal(false)
                    }
                >


                    <div
                        className="device-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >


                        <div className="modal-header">


                            <div>

                                <span>
                                    DEVICE MANAGEMENT
                                </span>


                                <h2>

                                    {editingDevice
                                        ? "Edit Device"
                                        : "Add New Device"}

                                </h2>

                            </div>


                            <button
                                className="modal-close"
                                onClick={() =>
                                    setShowModal(false)
                                }
                            >
                                ×
                            </button>

                        </div>



                        <form
                            onSubmit={handleSubmit}
                            className="device-form"
                        >


                            <div className="form-grid">


                                {/* DEVICE ID */}

                                <div className="form-group">

                                    <label>
                                        Device ID
                                    </label>


                                    <input
                                        name="deviceId"
                                        value={
                                            formData.deviceId
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="SOLAR-001"
                                        required
                                    />

                                </div>



                                {/* DEVICE NAME */}

                                <div className="form-group">

                                    <label>
                                        Device Name
                                    </label>


                                    <input
                                        name="deviceName"
                                        value={
                                            formData.deviceName
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Solar Panel Alpha"
                                        required
                                    />

                                </div>



                                {/* TYPE */}

                                <div className="form-group">

                                    <label>
                                        Device Type
                                    </label>


                                    <select
                                        name="deviceType"
                                        value={
                                            formData.deviceType
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    >

                                        <option value="SOLAR">
                                            Solar
                                        </option>

                                        <option value="BATTERY">
                                            Battery
                                        </option>

                                        <option value="GRID">
                                            Grid
                                        </option>

                                    </select>

                                </div>



                                {/* STATUS */}

                                <div className="form-group">

                                    <label>
                                        Status
                                    </label>


                                    <select
                                        name="status"
                                        value={
                                            formData.status
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    >

                                        <option value="ONLINE">
                                            Online
                                        </option>

                                        <option value="OFFLINE">
                                            Offline
                                        </option>

                                        <option value="FAULT">
                                            Fault
                                        </option>

                                    </select>

                                </div>



                                {/* LATITUDE */}

                                <div className="form-group">

                                    <label>
                                        Latitude
                                    </label>


                                    <input
                                        type="number"
                                        step="any"
                                        name="latitude"
                                        value={
                                            formData.latitude
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="28.6139"
                                        required
                                    />

                                </div>



                                {/* LONGITUDE */}

                                <div className="form-group">

                                    <label>
                                        Longitude
                                    </label>


                                    <input
                                        type="number"
                                        step="any"
                                        name="longitude"
                                        value={
                                            formData.longitude
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="77.2090"
                                        required
                                    />

                                </div>



                                {/* POWER GENERATION */}

                                <div className="form-group">

                                    <label>
                                        Power Generation (kW)
                                    </label>


                                    <input
                                        type="number"
                                        step="0.1"
                                        name="powerGeneration"
                                        value={
                                            formData.powerGeneration
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                </div>



                                {/* POWER CONSUMPTION */}

                                <div className="form-group">

                                    <label>
                                        Power Consumption (kW)
                                    </label>


                                    <input
                                        type="number"
                                        step="0.1"
                                        name="powerConsumption"
                                        value={
                                            formData.powerConsumption
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                </div>



                                {/* BATTERY */}

                                <div className="form-group full-width">

                                    <label>
                                        Battery Level (%)
                                    </label>


                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        step="1"
                                        name="batteryLevel"
                                        value={
                                            formData.batteryLevel
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                </div>

                            </div>



                            {/* FOOTER */}

                            <div className="modal-footer">


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
                                    className="save-device-btn"
                                >

                                    {editingDevice
                                        ? "Update Device"
                                        : "Create Device"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Devices;