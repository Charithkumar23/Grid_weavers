let socket = null;

export function connectWebSocket(onMessage) {

  socket = new WebSocket(
    "ws://localhost:8080/ws/grid"
  );

  socket.onopen = () => {
    console.log("WebSocket connected");
  };

  socket.onmessage = (event) => {

    const data = JSON.parse(event.data);

    onMessage(data);
  };

  socket.onerror = (error) => {
    console.error(
      "WebSocket error:",
      error
    );
  };

  socket.onclose = () => {
    console.log("WebSocket disconnected");
  };
}

export function disconnectWebSocket() {

  if (socket) {
    socket.close();
  }

}