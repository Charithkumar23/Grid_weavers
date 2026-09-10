const states = [
  "CHARGING",
  "DISCHARGING",
  "IDLE",
  "FAULT"
];

export function generateNodes(count = 100) {

  const nodes = [];

  for (let i = 1; i <= count; i++) {

    const state =
      states[Math.floor(Math.random() * states.length)];

    const node = {
      id: i,

      name: `NODE-${String(i).padStart(4, "0")}`,

      latitude:
        12.90 + Math.random() * 0.15,

      longitude:
        77.50 + Math.random() * 0.15,

      powerOutput:
        Number((Math.random() * 10).toFixed(2)),

      batteryLevel:
        Math.floor(Math.random() * 101),

      gridLoad:
        Math.floor(Math.random() * 101),

      state: state
    };

    nodes.push(node);
  }

  return nodes;
}