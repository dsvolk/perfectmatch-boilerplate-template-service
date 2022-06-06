import { NetworkRequest } from '../network-request/network-request';

export const API_COMMUNICATION_SERVICE = 'API_COMMUNICATION_SERVICE';

export interface ApiCommunicationInterface {
  exec<T, K>(networkRequest: NetworkRequest<T>): Promise<K>;
}
