import dotenv from 'dotenv'
dotenv.config()
import http from 'http';
import https from 'https';
import Koa from 'koa';
import Io from 'socket.io';
import cors from 'kcors';
// import Router from 'koa-router';
// import crypto from 'crypto';
import koaStatic from 'koa-static';
import koaSend from 'koa-send';
import Socket from './socket.js';
import getStore from "./store/index.js";

const app = new Koa();
const ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 3001;

// const router = new Router();

const appName = process.env.HEROKU_APP_NAME;
const isReviewApp = /-pr-/.test(appName);
const siteURL = process.env.SITE_URL;

const store = getStore();

if ((siteURL || ENV === 'development') && !isReviewApp) {
    app.use(
        cors({
            origin: ENV === 'development' ? '*' : siteURL,
            allowMethods: ['GET', 'HEAD', 'POST'],
            credentials: true,
        }),
    );
}

// app.use(router.routes());

// app.get('/', (req, res) => {
//     res.send({ response: "I am alive" }).status(200);
// });

const apiHost = process.env.API_HOST;
const cspDefaultSrc = `'self'${apiHost ? ` https://${apiHost} wss://${apiHost}` : ''}`;

function setStaticFileHeaders(ctx) {
    ctx.set({
        'strict-transport-security': 'max-age=31536000',
        'Content-Security-Policy': `default-src ${cspDefaultSrc} 'unsafe-inline'; img-src 'self' data:;`,
        'X-Frame-Options': 'deny',
        'X-XSS-Protection': '1; mode=block',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'no-referrer',
        'Feature-Policy': "geolocation 'none'; vr 'none'; payment 'none'; microphone 'none'",
    });
}

const clientDistDirectory = process.env.CLIENT_DIST_DIRECTORY;
if (clientDistDirectory) {
    app.use(async (ctx, next) => {
        setStaticFileHeaders(ctx);
        await koaStatic(clientDistDirectory, {
            maxage: ctx.req.url === '/' ? 60 * 1000 : 365 * 24 * 60 * 60 * 1000, // one minute in ms for html doc, one year for css, js, etc
        })(ctx, next);
    });

    app.use(async ctx => {
        setStaticFileHeaders(ctx);
        await koaSend(ctx, 'index.html', { root: clientDistDirectory });
    });
} else {
    app.use(async ctx => {
        ctx.body = { ready: true };
    });
}

const protocol = (process.env.PROTOCOL || 'http') === 'http' ? http : https;

const server = protocol.createServer(app.callback());

const io = Io(server, {
    cors: {origin: '*'},
    pingInterval: 20000,
    pingTimeout: 5000,
})

// Only use socket adapter if store has one
if (store.hasSocketAdapter) {
    io.adapter(store.getSocketAdapter())
}

export const getIO = () => io;


io.on('connection', async (socket) => {
    console.log('user connected');
    const roomId = socket.handshake.query.roomId;
    let room = await store.get('rooms', roomId);
    room = JSON.parse(room || '{}');

    new Socket({ roomId, room, socket });
});



const init = async () => {
    server.listen(PORT, () => {console.log(`Darkweb is online at port ${PORT}`);});
};

init();
