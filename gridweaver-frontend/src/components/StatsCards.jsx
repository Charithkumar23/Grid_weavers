function StatsCards({ nodes = [] }) {

  const totalNodes = nodes.length;

  const charging = nodes.filter(
    node => node.state === "CHARGING"
  ).length;

  const discharging = nodes.filter(
    node => node.state === "DISCHARGING"
  ).length;

  const idle = nodes.filter(
    node => node.state === "IDLE"
  ).length;

  const faults = nodes.filter(
    node => node.state === "FAULT"
  ).length;


  const stats = [

    {
      title: "Total Nodes",
      value: totalNodes,
      icon: "⚡"
    },

    {
      title: "Charging",
      value: charging,
      icon: "🔋"
    },

    {
      title: "Discharging",
      value: discharging,
      icon: "↘"
    },

    {
      title: "Faults",
      value: faults,
      icon: "⚠"
    }

  ];


  return (

    <div className="stats-container">

      {stats.map((stat) => (

        <div
          className="stat-card"
          key={stat.title}
        >

          <div className="stat-icon">
            {stat.icon}
          </div>

          <div>

            <p>
              {stat.title}
            </p>

            <h2>
              {stat.value}
            </h2>

          </div>

        </div>

      ))}

    </div>
  );
}

export default StatsCards;