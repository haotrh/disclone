import os from 'os';
import * as dotenv from 'dotenv';
import { TransportProtocol } from 'mediasoup/node/lib/Transport';
dotenv.config();

export const mediasoupConfig = {
  // Number of mediasoup workers to launch.
  numWorkers: 2 || Object.keys(os.cpus()).length,
  // mediasoup WorkerSettings.
  workerSettings: {
    logLevel: 'warn',
    logTags: [
      'info',
      'ice',
      'dtls',
      'rtp',
      'srtp',
      'rtcp',
      'rtx',
      'bwe',
      'score',
      'simulcast',
      'svc',
      'sctp',
    ],
    rtcMinPort: process.env.MEDIASOUP_MIN_PORT || 40000,
    rtcMaxPort: process.env.MEDIASOUP_MAX_PORT || 49999,
  },
  // mediasoup Router options.
  // See https://mediasoup.org/documentation/v3/mediasoup/api/#RouterOptions
  routerOptions: {
    mediaCodecs: [
      {
        kind: 'audio',
        mimeType: 'audio/opus',
        clockRate: 48000,
        channels: 2,
      },
      {
        kind: 'video',
        mimeType: 'video/VP8',
        clockRate: 90000,
        parameters: {
          'x-google-start-bitrate': 1000,
        },
      },
      {
        kind: 'video',
        mimeType: 'video/h264',
        clockRate: 90000,
        parameters: {
          'packetization-mode': 1,
          'profile-level-id': '4d0032',
          'level-asymmetry-allowed': 1,
          'x-google-start-bitrate': 1000,
        },
      },
      {
        kind: 'video',
        mimeType: 'video/h264',
        clockRate: 90000,
        parameters: {
          'packetization-mode': 1,
          'profile-level-id': '42e01f',
          'level-asymmetry-allowed': 1,
          'x-google-start-bitrate': 1000,
        },
      },
    ],
  },
  // mediasoup WebRtcServer options for WebRTC endpoints (mediasoup-client,
  // libmediasoupclient).
  // See https://mediasoup.org/documentation/v3/mediasoup/api/#WebRtcServerOptions
  // NOTE: mediasoup-demo/server/lib/Room.js will increase this port for
  // each mediasoup Worker since each Worker is a separate process.
  webRtcServerOptions: {
    listenInfos: [
      {
        protocol: 'udp' as TransportProtocol,
        ip: process.env.MEDIASOUP_LISTEN_IP || '0.0.0.0',
        announcedIp: process.env.MEDIASOUP_ANNOUNCED_IP,
        port: 44444,
      },
      {
        protocol: 'tcp' as TransportProtocol,
        ip: process.env.MEDIASOUP_LISTEN_IP || '0.0.0.0',
        announcedIp: process.env.MEDIASOUP_ANNOUNCED_IP,
        port: 44444,
      },
    ],
  },
  // mediasoup WebRtcTransport options for WebRTC endpoints (mediasoup-client,
  // libmediasoupclient).
  // See https://mediasoup.org/documentation/v3/mediasoup/api/#WebRtcTransportOptions
  webRtcTransportOptions: {
    initialAvailableOutgoingBitrate: 1000000,
    minimumAvailableOutgoingBitrate: 600000,
    maxIncomingBitrate: 1500000,
  },
};
