import { useEffect, useState } from "react";

import {
    User,
    Bell,
    Shield,
    Monitor,
    Globe,
    RefreshCw,
    Save,
    RotateCcw,
    Mail,
    AlertTriangle,
    Wrench,
    Lock,
    CheckCircle2
} from "lucide-react";

import { api } from "../service/api";
import Sidebar from "../components/Sidebar";

import "./Settings.css";

function Settings() {

    const [activeTab, setActiveTab] =
        useState("profile");

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [settings, setSettings] =
        useState({

            userEmail:
                "admin@gridweaver.com",

            fullName:
                "Grid Admin",

            emailNotifications:
                true,

            eventAlerts:
                true,

            criticalAlerts:
                true,

            maintenanceAlerts:
                false,

            autoRefresh:
                true,

            refreshInterval:
                30,

            darkMode:
                false,

            compactMode:
                false,

            timezone:
                "Asia/Kolkata",

            language:
                "English",

            dateFormat:
                "DD/MM/YYYY"
        });


    const loadSettings = async () => {

        try {

            setLoading(true);

            const response =
                await api.get(
                    "/settings?email=admin@gridweaver.com"
                );

            if (response.data) {

                setSettings(prev => ({
                    ...prev,
                    ...response.data
                }));
            }

        } catch (error) {

            console.error(
                "Settings loading error:",
                error
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        loadSettings();

    }, []);


    const handleChange = (event) => {

        const {
            name,
            value,
            type,
            checked
        } = event.target;

        setSettings(prev => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : value
        }));
    };


    const saveSettings = async () => {

        try {

            setSaving(true);

            setMessage("");

            const response =
                await api.put(
                    "/settings?email=admin@gridweaver.com",
                    settings
                );

            if (response.data?.settings) {

                setSettings(prev => ({
                    ...prev,
                    ...response.data.settings
                }));
            }

            setMessage(
                "Settings saved successfully."
            );

            setTimeout(() => {
                setMessage("");
            }, 3000);

        } catch (error) {

            console.error(
                "Settings save error:",
                error
            );

            setMessage(
                "Unable to save settings."
            );

        } finally {

            setSaving(false);
        }
    };


    const resetSettings = async () => {

        const confirmReset =
            window.confirm(
                "Are you sure you want to reset all settings?"
            );

        if (!confirmReset) {
            return;
        }

        try {

            setSaving(true);

            await api.post(
                "/settings/reset?email=admin@gridweaver.com"
            );

            await loadSettings();

            setMessage(
                "Settings reset successfully."
            );

        } catch (error) {

            console.error(
                "Settings reset error:",
                error
            );

            setMessage(
                "Unable to reset settings."
            );

        } finally {

            setSaving(false);
        }
    };


    const tabs = [

        {
            id: "profile",
            label: "Profile",
            icon: User
        },

        {
            id: "notifications",
            label: "Notifications",
            icon: Bell
        },

        {
            id: "appearance",
            label: "Appearance",
            icon: Monitor
        },

        {
            id: "system",
            label: "System",
            icon: Globe
        },

        {
            id: "security",
            label: "Security",
            icon: Shield
        }
    ];


    if (loading) {

        return (

            <div className="settings-layout">

                <Sidebar />

                <main className="settings-main">

                    <div className="settings-loading">

                        <RefreshCw
                            size={32}
                            className="settings-spin"
                        />

                        <p>
                            Loading settings...
                        </p>

                    </div>

                </main>

            </div>
        );
    }


    return (

        <div className="settings-layout">

            <Sidebar />

            <main className="settings-main">

                <div className="settings-page">


                    {/* HEADER */}

                    <div className="settings-header">

                        <div>

                            <div className="settings-heading">

                                <div className="settings-heading-icon">

                                    <Shield size={23} />

                                </div>

                                <div>

                                    <h1>
                                        Settings
                                    </h1>

                                    <p>
                                        Manage your GridWeaver
                                        preferences and system configuration
                                    </p>

                                </div>

                            </div>

                        </div>


                        <div className="settings-header-actions">

                            <button
                                className="reset-button"
                                onClick={resetSettings}
                                disabled={saving}
                            >

                                <RotateCcw size={16} />

                                Reset

                            </button>

                            <button
                                className="save-button"
                                onClick={saveSettings}
                                disabled={saving}
                            >

                                {saving ? (

                                    <RefreshCw
                                        size={16}
                                        className="settings-spin"
                                    />

                                ) : (

                                    <Save size={16} />

                                )}

                                {saving
                                    ? "Saving..."
                                    : "Save Changes"}

                            </button>

                        </div>

                    </div>


                    {/* SUCCESS MESSAGE */}

                    {message && (

                        <div className="settings-message">

                            <CheckCircle2 size={17} />

                            {message}

                        </div>

                    )}


                    {/* SETTINGS CONTENT */}

                    <div className="settings-container">


                        {/* TABS */}

                        <aside className="settings-sidebar">

                            <div className="settings-sidebar-title">
                                Preferences
                            </div>

                            {tabs.map(tab => {

                                const Icon =
                                    tab.icon;

                                return (

                                    <button
                                        key={tab.id}
                                        className={
                                            activeTab === tab.id
                                                ? "settings-tab active"
                                                : "settings-tab"
                                        }
                                        onClick={() =>
                                            setActiveTab(tab.id)
                                        }
                                    >

                                        <Icon size={18} />

                                        <span>
                                            {tab.label}
                                        </span>

                                    </button>
                                );
                            })}

                        </aside>


                        {/* CONTENT */}

                        <section className="settings-content">


                            {/* PROFILE */}

                            {activeTab === "profile" && (

                                <div className="settings-section">

                                    <div className="section-title">

                                        <div className="section-icon profile-icon">
                                            <User size={19} />
                                        </div>

                                        <div>

                                            <h2>
                                                Profile Information
                                            </h2>

                                            <p>
                                                Manage your GridWeaver
                                                administrator profile.
                                            </p>

                                        </div>

                                    </div>


                                    <div className="profile-card">

                                        <div className="profile-avatar">
                                            GW
                                        </div>

                                        <div>

                                            <h3>
                                                {settings.fullName ||
                                                    "Grid Admin"}
                                            </h3>

                                            <p>
                                                {settings.userEmail}
                                            </p>

                                            <span className="admin-badge">
                                                Administrator
                                            </span>

                                        </div>

                                    </div>


                                    <div className="form-grid">

                                        <div className="form-group">

                                            <label>
                                                Full Name
                                            </label>

                                            <input
                                                type="text"
                                                name="fullName"
                                                value={
                                                    settings.fullName
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                placeholder="Enter full name"
                                            />

                                        </div>


                                        <div className="form-group">

                                            <label>
                                                Email Address
                                            </label>

                                            <input
                                                type="email"
                                                value={
                                                    settings.userEmail
                                                }
                                                disabled
                                            />

                                            <small>
                                                Email address cannot
                                                be changed here.
                                            </small>

                                        </div>

                                    </div>

                                </div>
                            )}


                            {/* NOTIFICATIONS */}

                            {activeTab === "notifications" && (

                                <div className="settings-section">

                                    <div className="section-title">

                                        <div className="section-icon notification-icon">
                                            <Bell size={19} />
                                        </div>

                                        <div>

                                            <h2>
                                                Notifications
                                            </h2>

                                            <p>
                                                Control alerts and system
                                                notifications.
                                            </p>

                                        </div>

                                    </div>


                                    <div className="settings-options">


                                        <SettingToggle
                                            icon={<Mail size={18} />}
                                            title="Email Notifications"
                                            description="Receive important system updates through email."
                                            name="emailNotifications"
                                            checked={
                                                settings.emailNotifications
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />


                                        <SettingToggle
                                            icon={<AlertTriangle size={18} />}
                                            title="Event Alerts"
                                            description="Get notified when new grid events are detected."
                                            name="eventAlerts"
                                            checked={
                                                settings.eventAlerts
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />


                                        <SettingToggle
                                            icon={<Shield size={18} />}
                                            title="Critical Alerts"
                                            description="Receive immediate notifications for critical system conditions."
                                            name="criticalAlerts"
                                            checked={
                                                settings.criticalAlerts
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />


                                        <SettingToggle
                                            icon={<Wrench size={18} />}
                                            title="Maintenance Alerts"
                                            description="Receive scheduled maintenance notifications."
                                            name="maintenanceAlerts"
                                            checked={
                                                settings.maintenanceAlerts
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />

                                    </div>

                                </div>
                            )}


                            {/* APPEARANCE */}

                            {activeTab === "appearance" && (

                                <div className="settings-section">

                                    <div className="section-title">

                                        <div className="section-icon appearance-icon">
                                            <Monitor size={19} />
                                        </div>

                                        <div>

                                            <h2>
                                                Appearance
                                            </h2>

                                            <p>
                                                Customize the dashboard
                                                appearance.
                                            </p>

                                        </div>

                                    </div>


                                    <div className="settings-options">

                                        <SettingToggle
                                            icon={<Monitor size={18} />}
                                            title="Dark Mode"
                                            description="Use a darker interface for low-light environments."
                                            name="darkMode"
                                            checked={
                                                settings.darkMode
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />


                                        <SettingToggle
                                            icon={<ActivityIcon />}
                                            title="Compact Mode"
                                            description="Reduce spacing and display more information on screen."
                                            name="compactMode"
                                            checked={
                                                settings.compactMode
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />

                                    </div>


                                    <div className="form-grid">

                                        <div className="form-group">

                                            <label>
                                                Language
                                            </label>

                                            <select
                                                name="language"
                                                value={
                                                    settings.language
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                            >

                                                <option>
                                                    English
                                                </option>

                                                <option>
                                                    Hindi
                                                </option>

                                            </select>

                                        </div>


                                        <div className="form-group">

                                            <label>
                                                Date Format
                                            </label>

                                            <select
                                                name="dateFormat"
                                                value={
                                                    settings.dateFormat
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                            >

                                                <option>
                                                    DD/MM/YYYY
                                                </option>

                                                <option>
                                                    MM/DD/YYYY
                                                </option>

                                                <option>
                                                    YYYY-MM-DD
                                                </option>

                                            </select>

                                        </div>

                                    </div>

                                </div>
                            )}


                            {/* SYSTEM */}

                            {activeTab === "system" && (

                                <div className="settings-section">

                                    <div className="section-title">

                                        <div className="section-icon system-icon">
                                            <RefreshCw size={19} />
                                        </div>

                                        <div>

                                            <h2>
                                                System Preferences
                                            </h2>

                                            <p>
                                                Configure dashboard refresh
                                                and regional settings.
                                            </p>

                                        </div>

                                    </div>


                                    <div className="settings-options">

                                        <SettingToggle
                                            icon={<RefreshCw size={18} />}
                                            title="Auto Refresh"
                                            description="Automatically refresh live microgrid data."
                                            name="autoRefresh"
                                            checked={
                                                settings.autoRefresh
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />

                                    </div>


                                    <div className="form-grid">

                                        <div className="form-group">

                                            <label>
                                                Refresh Interval
                                            </label>

                                            <select
                                                name="refreshInterval"
                                                value={
                                                    settings.refreshInterval
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                            >

                                                <option value="10">
                                                    10 seconds
                                                </option>

                                                <option value="30">
                                                    30 seconds
                                                </option>

                                                <option value="60">
                                                    1 minute
                                                </option>

                                                <option value="300">
                                                    5 minutes
                                                </option>

                                            </select>

                                        </div>


                                        <div className="form-group">

                                            <label>
                                                Timezone
                                            </label>

                                            <select
                                                name="timezone"
                                                value={
                                                    settings.timezone
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                            >

                                                <option value="Asia/Kolkata">
                                                    Asia/Kolkata
                                                </option>

                                                <option value="UTC">
                                                    UTC
                                                </option>

                                                <option value="Asia/Dubai">
                                                    Asia/Dubai
                                                </option>

                                                <option value="Europe/London">
                                                    Europe/London
                                                </option>

                                            </select>

                                        </div>

                                    </div>

                                </div>
                            )}


                            {/* SECURITY */}

                            {activeTab === "security" && (

                                <div className="settings-section">

                                    <div className="section-title">

                                        <div className="section-icon security-icon">
                                            <Lock size={19} />
                                        </div>

                                        <div>

                                            <h2>
                                                Security
                                            </h2>

                                            <p>
                                                Review your account security
                                                configuration.
                                            </p>

                                        </div>

                                    </div>


                                    <div className="security-card">

                                        <div className="security-card-icon">
                                            <Shield size={23} />
                                        </div>

                                        <div className="security-card-content">

                                            <h3>
                                                Account Protection
                                            </h3>

                                            <p>
                                                Your GridWeaver account uses
                                                secure authentication and
                                                protected API access.
                                            </p>

                                        </div>

                                        <span className="security-status">
                                            Active
                                        </span>

                                    </div>


                                    <div className="security-list">

                                        <div className="security-row">

                                            <div>

                                                <strong>
                                                    Password
                                                </strong>

                                                <span>
                                                    Last password update
                                                    managed through account
                                                    security.
                                                </span>

                                            </div>

                                            <button
                                                className="secondary-button"
                                                onClick={() =>
                                                    alert(
                                                        "Password management can be connected to your authentication API."
                                                    )
                                                }
                                            >
                                                Change Password
                                            </button>

                                        </div>


                                        <div className="security-row">

                                            <div>

                                                <strong>
                                                    Session Security
                                                </strong>

                                                <span>
                                                    JWT authentication is
                                                    enabled for API access.
                                                </span>

                                            </div>

                                            <span className="enabled-label">
                                                Enabled
                                            </span>

                                        </div>

                                    </div>

                                </div>
                            )}

                        </section>

                    </div>

                </div>

            </main>

        </div>
    );
}


function SettingToggle({
    icon,
    title,
    description,
    name,
    checked,
    onChange
}) {

    return (

        <div className="setting-toggle-row">

            <div className="setting-toggle-icon">

                {icon}

            </div>

            <div className="setting-toggle-content">

                <strong>
                    {title}
                </strong>

                <span>
                    {description}
                </span>

            </div>

            <label className="switch">

                <input
                    type="checkbox"
                    name={name}
                    checked={Boolean(checked)}
                    onChange={onChange}
                />

                <span className="slider" />

            </label>

        </div>
    );
}


function ActivityIcon() {

    return (
        <span className="mini-bars">
            <i />
            <i />
            <i />
        </span>
    );
}


export default Settings;