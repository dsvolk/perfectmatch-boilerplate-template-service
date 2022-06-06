export const KafkaTopic = {
  Match: 'talent-acquisition.match',
  MatchCandidate: 'talent-acquisition.onboarding',
  Position: 'talent-acquisition.position',
  Talent: 'talent-info.talent',
  Webhook: 'webhooks.webhook',
  PiiRemoval: 'talent-info.pii-removal',
  PiiRetrieval: 'talent-info.pii-retrieval',
};

export const TalentTopicEventType = {
  ContactDetailsUpdated: 'ContactDetailsUpdated',
};

export const WebhookTopicEventType = {
  WebhookReceived: 'WebhookReceived',
  WebhookExpired: 'WebhookExpired',
};

export const PositionTopicEventType = {
  PositionPublished: 'PositionPublished',
};

export const PiiMessageEventType = {
  PiiRemovalRequest: 'PiiRemovalRequest',
};

export const MatchCandidateTopicEventType = {
  PromoteMatchCandidate: 'PromoteMatchCandidate',
};
