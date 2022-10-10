import EventEmitter from 'events';
import { AudioLevelObserver } from 'mediasoup/node/lib/AudioLevelObserver';
import { Router } from 'mediasoup/node/lib/Router';
import { RtpCodecCapability } from 'mediasoup/node/lib/RtpParameters';
import { WebRtcServer } from 'mediasoup/node/lib/WebRtcServer';
import { Worker } from 'mediasoup/node/lib/Worker';
import { Server } from 'socket.io';
import { mediasoupConfig } from 'src/mediasoup.config';
import { Peer } from './media.peer';

interface RoomConstructor {
  roomId: string;
  socket: Server;
  webRtcServer: WebRtcServer;
  router: Router;
  audioLevelObserver: AudioLevelObserver;
}

export class Room extends EventEmitter {
  private roomId: string;
  private webRtcServer: WebRtcServer;
  private socket: Server;
  private router: Router;
  private audioLevelObserver: AudioLevelObserver;
  private selfDestructTimeout: NodeJS.Timeout;
  private peers: Map<string, Peer>;

  constructor({
    audioLevelObserver,
    roomId,
    router,
    socket,
    webRtcServer,
  }: RoomConstructor) {
    super();
    this.audioLevelObserver = audioLevelObserver;
    this.roomId = roomId;
    this.router = router;
    this.socket = socket;
    this.webRtcServer = webRtcServer;
  }

  static async create(worker: Worker, roomId: string, socket: Server) {
    // Router media codecs.
    const mediaCodecs = mediasoupConfig.routerOptions
      .mediaCodecs as RtpCodecCapability[];
    // Create a mediasoup Router.
    const router = await worker.createRouter({ mediaCodecs });

    // Create a mediasoup AudioLevelObserver.
    const audioLevelObserver = await router.createAudioLevelObserver({
      maxEntries: 1,
      threshold: -80,
      interval: 800,
    });

    return new Room({
      audioLevelObserver,
      roomId,
      router,
      socket,
      webRtcServer: worker.appData.webRtcServer as WebRtcServer,
    });
  }

  close() {
    this.emit('close');
  }

  selfDestructCountdown() {
    console.log('selfDestructCountdown() started', { roomId: this.roomId });

    if (this.selfDestructTimeout) {
      clearTimeout(this.selfDestructTimeout);
    }

    this.selfDestructTimeout = setTimeout(() => {
      if (this.peers.size === 0) {
        console.log('selfDestructCountdown() completed', {
          roomId: this.roomId,
        });
        this.close();
      } else {
        console.log('selfDestructCountdown() aborted; room is not empty!', {
          roomId: this.roomId,
        });
      }
    }, 300000);
  }

  handle;
}
