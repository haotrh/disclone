import EventEmitter from 'events';
import { Consumer } from 'mediasoup/node/lib/Consumer';
import { Producer } from 'mediasoup/node/lib/Producer';
import { Transport } from 'mediasoup/node/lib/Transport';
import { DtlsParameters } from 'mediasoup/node/lib/WebRtcTransport';
import { Socket } from 'socket.io';
import { User } from 'src/modules/user/entities/user.entity';

export class Peer extends EventEmitter {
  private transports: Map<string, Transport>;
  private consumers: Map<string, Consumer>;
  private producers: Map<string, Producer>;

  constructor(private user: User, private socket: Socket) {
    super();
  }

  addTransport(transport: Transport) {
    this.transports.set(transport.id, transport);
  }

  async connectTransport(transportId: string, dtlsParameters: DtlsParameters) {
    if (!this.transports.has(transportId)) {
      throw new Error(`transport with id "${transportId}" not found`);
    }
    await this.transports.get(transportId).connect({
      dtlsParameters,
    });
  }

  getTransport(id: string) {
    return this.transports.get(id);
  }

  getConsumerTransports() {
    return [...this.transports.values()].find(
      (transport) => transport.appData?.consuming,
    );
  }

  addProducer(producer: Producer) {
    this.producers.set(producer.id, producer);
  }

  getProducer(producerId: string) {
    return this.producers.get(producerId);
  }

  removeProducer(producerId: string) {
    this.producers.delete(producerId);
  }

  addConsumer(consumer: Consumer) {
    this.consumers.set(consumer.id, consumer);
  }

  getConsumer(consumerId: string) {
    return this.consumers.get(consumerId);
  }

  closeConsumer(consumerId: string) {
    this.getConsumer(consumerId)?.close();
    this.consumers.delete(consumerId);
  }

  closeConsumers() {
    this.consumers.forEach((consumer) => consumer.close());
    this.consumers = new Map();
  }

  close() {
    this.transports.forEach((transport) => transport.close());
    this.socket.disconnect();
  }
}
