import { v4 as uuidv4 } from 'uuid';

export const CorrelationIdUtils = {
  generateCorrelationId(prefix: string): string {
    return prefix + ':' + uuidv4();
  },
};
