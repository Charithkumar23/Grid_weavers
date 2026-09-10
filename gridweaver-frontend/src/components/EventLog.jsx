function EventLog({ nodes = [] }) {

  const events = nodes
    .slice(0, 10)
    .map((node, index) => ({

      node: node.name,

      state: node.state,

      time: `15:20:${String(
        index + 1
      ).padStart(2, "0")}`

    }));


  return (

    <div className="event-log">

      <div className="section-title">

        <h2>
          Event Log
        </h2>

        <span>
          LIVE
        </span>

      </div>


      {events.map((event, index) => (

        <div
          className="event"
          key={index}
        >

          <div>

            <strong>
              {event.node}
            </strong>

            <p>
              {event.time}
            </p>

          </div>


          <span
            className={`state ${event.state.toLowerCase()}`}
          >

            {event.state}

          </span>

        </div>

      ))}

    </div>
  );
}

export default EventLog;