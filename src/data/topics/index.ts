import type { Topic } from '../../types';
import { apiRateLimitingTopic } from './api-rate-limiting';
import { ciaTriadTopic } from './cia-triad';
import { defensiveSecurityTopic } from './defensive-security';
import { jwtTopic } from './jwt-authentication';
import { mobilePinningTopic } from './mobile-pinning';
import { sastDastTopic } from './sast-dast';
import { sqlInjectionTopic } from './sql-injection';
import { tlsTopic } from './tls';

export const topics: Topic[] = [
  tlsTopic,
  sqlInjectionTopic,
  jwtTopic,
  sastDastTopic,
  apiRateLimitingTopic,
  defensiveSecurityTopic,
  mobilePinningTopic,
  ciaTriadTopic,
];

export function getTopic(id: Topic['id']): Topic | undefined {
  return topics.find((t) => t.id === id);
}

export function getTopicsByDay(day: number): Topic[] {
  return topics.filter((t) => t.day === day);
}

export function getAllTopicIds(): Topic['id'][] {
  return topics.map((t) => t.id);
}

export {
  tlsTopic,
  sqlInjectionTopic,
  jwtTopic,
  sastDastTopic,
  apiRateLimitingTopic,
  defensiveSecurityTopic,
  mobilePinningTopic,
  ciaTriadTopic,
};
