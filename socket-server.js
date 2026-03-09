const { Server } = require("socket.io");
const http = require("http");

const httpServer = http.createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const rooms = new Map();

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("create-room", ({ roomID, challenges, category }) => {
        rooms.set(roomID, {
            id: roomID,
            challenges: challenges || [0, 1, 2, 3, 4],
            category: category || 'General',
            players: []
        });
        console.log(`Room registered: ${roomID} (Category: ${category})`);
        socket.emit("room-created", roomID);
    });

    socket.on("join-room", (roomID) => {
        const room = rooms.get(roomID);
        if (room && room.players.length < 2) {
            socket.join(roomID);
            const role = room.players.length === 0 ? 'host' : 'guest';
            room.players.push({ id: socket.id, round: 1, role });

            console.log(`User ${socket.id} joined room ${roomID} as ${role}`);

            if (room.players.length === 2) {
                io.to(roomID).emit("game-start", {
                    roomID,
                    players: room.players,
                    challenges: room.challenges,
                    category: room.category
                });
            } else {
                socket.emit("waiting", { roomID });
            }
        } else {
            socket.emit("error", "Room full or does not exist");
        }
    });

    socket.on("challenge-complete", ({ roomID }) => {
        const room = rooms.get(roomID);
        if (room) {
            const player = room.players.find(p => p.id === socket.id);
            if (player) {
                player.round += 1;
                console.log(`Player ${socket.id} moved to round ${player.round}`);

                // Broadcast progress update to both
                io.to(roomID).emit("progress-update", room.players);

                if (player.round > 5) {
                    io.to(roomID).emit("game-over", { winner: socket.id });
                }
            }
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

const PORT = 3001;
httpServer.listen(PORT, () => {
    console.log(`Code Clash Server (Category Mode) running on port ${PORT}`);
});
