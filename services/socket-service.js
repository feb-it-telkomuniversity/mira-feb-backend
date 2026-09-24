import { Server } from "socket.io";

let io = null;

export const initSocket = (httpServer, allowedOrigins = []) => {
    io = new Server(httpServer, {
        cors: {
            origin: function (origin, callback) {
                if (!origin) return callback(null, true);
                if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
                    callback(null, true);
                } else {
                    callback(new Error(`Origin ${origin} not allowed by CORS`));
                }
            },
            credentials: true,
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log(`[Socket.io] Client connected: ${socket.id}`);

        socket.on("disconnect", (reason) => {
            console.log(`[Socket.io] Client disconnected: ${socket.id} (${reason})`);
        });
    });

    return io;
};

export const getIO = () => {
    return io;
};

export const emitActivityChange = (action, data = null) => {
    if (io) {
        console.log(`[Socket.io] Emitting activity:changed (${action})`);
        io.emit("activity:changed", {
            action,
            data,
            timestamp: new Date().toISOString()
        });
    }
};

export const emitNotificationChange = (data = null) => {
    if (io) {
        console.log(`[Socket.io] Emitting notification:new`);
        io.emit("notification:new", {
            data,
            timestamp: new Date().toISOString()
        });
    }
};
