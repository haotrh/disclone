import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { EventsGateway } from '../ws/events.gateway';
import { Relationship, RelationshipType, User } from './entities/user.entity';

@Injectable()
export class RelationshipService {
  constructor(
    @InjectRepository(User) private userRepository: EntityRepository<User>,
    private eventsGateway: EventsGateway,
  ) {}

  addRelationship(user: User, relationship: Relationship) {
    if (user.relationships) {
      const index = user.relationships.findIndex(
        (r) => r.id === relationship.id,
      );
      if (index !== -1) {
        user.relationships[index] = relationship;
      } else {
        user.relationships.push(relationship);
      }
    } else {
      user.relationships = [relationship];
    }
  }

  async getRelationships(user: User) {
    const { relationships } = await this.userRepository.findOneOrFail(user, {
      fields: ['relationships'],
      populate: ['relationships', 'relationships.user'],
    });

    return (relationships ?? []) as Relationship[];
  }

  async createRelationship(
    user: User,
    id: string,
    type: RelationshipType = RelationshipType.FRIEND,
  ) {
    const peer = await this.userRepository.findOneOrFail(id);
    if (type === RelationshipType.FRIEND) {
      const relationshipIndex = user.relationships.findIndex(
        (relationship) => relationship.id === id,
      );
      const peerRelationshipIndex = peer.relationships.findIndex(
        (relationship) => relationship.id === user.id,
      );
      const relationship: Relationship = {
        id,
        nickname: null,
        type: RelationshipType.OUTGOING,
        user: peer,
      };
      const peerRelationship: Relationship = {
        id: user.id,
        nickname: null,
        type: RelationshipType.INCOMING,
        user,
      };
      if (peerRelationshipIndex !== -1) {
        const currentPeerRelationship =
          peer.relationships[peerRelationshipIndex];
        const isPeerBlocked =
          currentPeerRelationship.type === RelationshipType.BLOCK;
        if (isPeerBlocked) {
          throw new BadRequestException('Not found');
        }
        const isFriend =
          currentPeerRelationship.type === RelationshipType.FRIEND;
        if (isFriend) {
          return;
        }
        const currentMyRelationship = user.relationships[relationshipIndex];
        if (
          currentMyRelationship.type === RelationshipType.INCOMING &&
          currentPeerRelationship.type === RelationshipType.OUTGOING
        ) {
          relationship.type = RelationshipType.FRIEND;
          peerRelationship.type = RelationshipType.FRIEND;
        }
      }
      this.addRelationship(user, relationship);
      this.addRelationship(peer, peerRelationship);
      await this.userRepository.persistAndFlush(user);
      this.eventsGateway.emitRelationshipAdd(user.id, relationship);
      this.eventsGateway.emitRelationshipAdd(peer.id, peerRelationship);
    } else if (type === RelationshipType.BLOCK) {
      const banRelationship: Relationship = {
        id,
        nickname: null,
        type,
        user: peer,
      };
      this.addRelationship(user, banRelationship);
      const peerRelationshipIndex = peer.relationships.findIndex(
        (relationship) => relationship.id === user.id,
      );
      if (peerRelationshipIndex !== -1) {
        const peerRelationship = peer.relationships[peerRelationshipIndex];
        if (peerRelationship.type !== RelationshipType.BLOCK) {
          peer.relationships.splice(peerRelationshipIndex, 1);
        }
      }
      this.eventsGateway.emitRelationshipAdd(user.id, banRelationship);
      this.eventsGateway.emitRelationshipRemove(peer.id, { id: user.id });
      await this.userRepository.persistAndFlush(user);
    }
    return;
  }

  async updateFriendNickname(
    user: User,
    peerId: string,
    nickname: string | null,
  ) {
    const relationshipIndex = user.relationships.findIndex(
      (relationship) => relationship.id === peerId,
    );
    if (relationshipIndex === -1) {
      throw new BadRequestException('Invalid request');
    }
    const relationship = user.relationships[relationshipIndex];
    user.relationships[relationshipIndex] = {
      ...relationship,
      nickname,
    };
    await this.userRepository.persistAndFlush(user);
    this.eventsGateway.emitRelationshipAdd(user.id, relationship);
  }

  async deleteRelationship(user: User, peerId: string) {
    const relationshipIndex = user.relationships.findIndex(
      (relationship) => relationship.id === peerId,
    );
    if (relationshipIndex === -1) {
      throw new BadRequestException('Invalid request');
    }
    const relationship = user.relationships[relationshipIndex];
    user.relationships.splice(relationshipIndex, 1);
    let removePeer = false;
    if (relationship.type !== RelationshipType.BLOCK) {
      const peer = await this.userRepository.findOneOrFail(peerId, {
        fields: ['relationships'],
      });
      const peerRelationshipIndex = user.relationships.findIndex(
        (relationship) => relationship.id === user.id,
      );
      peer.relationships.splice(peerRelationshipIndex, 1);
      removePeer = true;
    }
    await this.userRepository.persistAndFlush(user);
    this.eventsGateway.emitRelationshipRemove(user.id, { id: peerId });
    removePeer &&
      this.eventsGateway.emitRelationshipRemove(peerId, { id: user.id });
  }
}
