package com.gridweaver.model;

public class MicrogridState {

    private double voltage;
    private double frequency;
    private double power;
    private double batteryLevel;
    private boolean gridConnected;

    public MicrogridState(double voltage, double frequency,
                          double power, double batteryLevel,
                          boolean gridConnected) {
        this.voltage = voltage;
        this.frequency = frequency;
        this.power = power;
        this.batteryLevel = batteryLevel;
        this.gridConnected = gridConnected;
    }

    public double getVoltage() {
        return voltage;
    }

    public double getFrequency() {
        return frequency;
    }

    public double getPower() {
        return power;
    }

    public double getBatteryLevel() {
        return batteryLevel;
    }

    public boolean isGridConnected() {
        return gridConnected;
    }

    @Override
    public String toString() {
        return "MicrogridState{" +
                "voltage=" + voltage +
                ", frequency=" + frequency +
                ", power=" + power +
                ", batteryLevel=" + batteryLevel +
                ", gridConnected=" + gridConnected +
                '}';
    }
}