let readyPlayerCount = 0;

function listen(io) {
  const pongNamespace = io.of("/pong");
  pongNamespace.on("connection", (socket) => {
    let room;
    const winningScore = 5;
    console.log("A user connected", socket.id);

    socket.on("ready", () => {
      room = "room" + Math.floor(readyPlayerCount / 2);
      socket.join(room);

      console.log("Player ready", socket.id, room);

      readyPlayerCount++;

      if (readyPlayerCount % 2 === 0) {
        pongNamespace.in(room).emit("startGame", socket.id); // pasa el id del ultimo para que sea el arbitro
      }
    });

    socket.on("paddleMove", (paddleData) => {
      socket.to(room).emit("paddleMove", paddleData); // envia a todos menos al socket que lo emite
    });

    socket.on("ballMove", (ballData) => {
      socket.to(room).emit("ballMove", ballData); // envia a todos menos al socket que lo emite
      if (ballData.score.includes(winningScore)) {
        const paddleWinner = ballData.score.indexOf(winningScore);
        pongNamespace.in(room).emit("gameOver", paddleWinner);
        // socket.leave(room);
        pongNamespace.in(room).disconnectSockets(true);
      }
    });

    socket.on("disconnect", (reason) => {
      console.log(`Client ${socket.id} disconnected: ${reason}`);
      socket.leave(room);
    });
  });
}

module.exports = {
  listen,
};
