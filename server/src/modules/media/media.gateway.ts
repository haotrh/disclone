import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import _ from 'lodash';
import * as mediasoup from 'mediasoup';
import { WebRtcServerOptions } from 'mediasoup/node/lib/WebRtcServer';
import { Worker, WorkerSettings } from 'mediasoup/node/lib/Worker';
import { Server } from 'socket.io';
import { mediasoupConfig } from 'src/mediasoup.config';
import { ExtendedSocket } from 'src/types/socket-io.types';
import { TokenService } from '../auth/token.service';
import { Room } from './media.room';

interface SocketHandshakeQuery {
  roomId: string;
  token: string;
  userId: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'media',
})
export class MediaGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private tokenService: TokenService) {
    this.createWorkers();
  }

  @WebSocketServer()
  server: Server;

  public nextMediasoupWorkerIdx = 0;
  //Mediasoup Room aka Voice Channels
  public rooms: Map<string, Room> = new Map();
  //Mediasoup Worker
  public workers: Worker[] = [];

  private async createWorkers(): Promise<void> {
    for (let i = 0; i < mediasoupConfig.numWorkers; i++) {
      const worker = await mediasoup.createWorker(
        mediasoupConfig.workerSettings as WorkerSettings,
      );
      worker.on('died', () => {
        console.log(
          'mediasoup Worker died, exiting  in 2 seconds... [pid:%d]',
          worker.pid,
        );

        setTimeout(() => process.exit(1), 2000);
      });
      this.workers.push(worker);

      //Create WebRtcServer
      const webRtcServerOptions: WebRtcServerOptions = _.cloneDeep(
        mediasoupConfig.webRtcServerOptions,
      );
      const portIncrement = this.workers.length - 1;
      for (const listenInfo of webRtcServerOptions.listenInfos) {
        listenInfo.port += portIncrement;
      }
      const webRtcServer = await worker.createWebRtcServer(webRtcServerOptions);
      worker.appData.webRtcServer = webRtcServer;
    }
  }

  async handleConnection(socket: ExtendedSocket) {
    try {
      const { roomId, token, userId } = socket.handshake
        .query as unknown as SocketHandshakeQuery;
      if (!roomId || !token || !userId) {
        throw new Error();
      }
      socket.emit('asd', 'asdasd');
    } catch {}
  }

  async handleDisconnect() {}

  private getMediasoupWorker() {
    const worker = this.workers[this.nextMediasoupWorkerIdx];
    if (++this.nextMediasoupWorkerIdx === this.workers.length)
      this.nextMediasoupWorkerIdx = 0;
    return worker;
  }

  private async getOrCreateRoom(roomId: string) {
    let room = this.rooms.get(roomId);

    // If the Room does not exist create a new one.
    if (!room) {
      console.log('creating a new Room [roomId:%s]', roomId);
      const worker = this.getMediasoupWorker();
      room = await Room.create(worker, roomId, this.server);
      this.rooms.set(roomId, room);
      room.on('close', () => this.rooms.delete(roomId));
    }

    return room;
  }

  @SubscribeMessage('get')
  handleEvent(@MessageBody('id') id: number): number {
    // id === messageBody.id
    console.log(id);
    return id;
  }
}
