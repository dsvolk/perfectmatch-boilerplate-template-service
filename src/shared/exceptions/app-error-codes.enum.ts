export enum AppInternalErrorCode {
  ValidationError = 30000,
  ExternalServiceError = 30001,
  EntityNotFound = 30002,
  KafkaProduceError = 30004,
  QueryFailed = 30005,
  Unknown = 39999,
}

export enum TypeOrmErrorMessage {
  QueryFailed = 'Query failed',
  CannotCreateEntity = 'Cannot create entity',
  EntityNotFound = 'Entity not found',
}
