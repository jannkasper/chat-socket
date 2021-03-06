import _ from "lodash";
import getStore from "./store/index.js";
import { getIO } from "./index.js";

export default class Socket {
    constructor(opts) {
        const { roomId, socket, room } = opts;
        this._roomId = roomId;
        this.socket = socket;

        if (room.isLocked) {
            this.sendRoomLocked();
            return;
        }

        this.init(roomId, socket);
    }

    async init(roomId, socket) {
        await socket.join(roomId);
        this.handleSocket(socket);
    }

    sendRoomLocked() {
        this.socket.emit("ROOM_LOCKED");
    }

    async saveRoom(room) {
        const json = { ...room, updatedAt: Date.now() };
        return getStore().set("rooms", this._roomId, JSON.stringify(json));
    }

    async destroyRoom() {
        return getStore().del('rooms', this._roomId);
    }

    async fetchRoom() {
        return new Promise(async (resolve, reject) => {
            const res = await getStore().get("rooms", this._roomId);
            resolve(JSON.parse(res || "{}"));
        });
    }

    handleSocket(socket) {
        socket.on('ENCRYPTED_MESSAGE', payload => {
            // console.log('Room: ' + this._roomId + ' | User: ' + payload.username + ' | Message: ' + payload.text);
            socket.to(this._roomId).emit('ENCRYPTED_MESSAGE', payload);
        });

        socket.on("USER_ENTER", async payload => {
            let room = await this.fetchRoom();

            if (_.isEmpty(room)) {
                room = {
                    id: this._roomId,
                    users: [],
                    isLocked: false,
                    createdAt: Date.now(),
                };
            }

            const newRoom = {
                ...room,
                users: [
                    ...(room.users || []),
                    {
                        socketId: socket.id,
                        publicKey: payload.publicKey,
                        isOwner: (room.users || []).length === 0,
                    }
                ],
            };

            await this.saveRoom(newRoom);

            getIO().to(this._roomId).emit("USER_ENTER", newRoom)
        });

        socket.on("TOGGLE_LOCK_ROOM", async (data, callback) => {
            const room = await this.fetchRoom();
            const userOwner = (room.users || []).find(user => user.socketId === socket.id && user.isOwner);

            if (!userOwner) {
                callback({
                    isLocked: room.isLocked,
                })
                return;
            }

            await this.saveRoom({ ...room, isLocked: !room.isLocked });

            socket.to(this._roomId).emit("TOGGLE_LOCK_ROOM", {isLocked: !room.isLocked, publicKey: userOwner && userOwner.publicKey });

            callback({
                isLocked: !room.isLocked,
            });
        })

        socket.on('disconnect', () => this.handleDisconnect(socket));

        socket.on('USER_DISCONNECT', () => this.handleDisconnect(socket));
    }

    async handleDisconnect(socket) {
        let room = await this.fetchRoom();

        const newRoom = {
            ...room,
            users: (room.users || [])
                .filter(user => user.socketId !== socket.id)
                .map((user,index) => ({ ...user, isOwner: index === 0 }))
        };

        await this.saveRoom(newRoom);

        getIO().to(this._roomId).emit("USER_EXIT", newRoom.users);

        if (newRoom.users && newRoom.users.length === 0) {
            await this.destroyRoom();
        }

        socket.disconnect(true);
    }
}