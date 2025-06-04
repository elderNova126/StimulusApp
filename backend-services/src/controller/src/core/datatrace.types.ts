/**
 * Enum for data trace source
 *
 * @readonly
 * @enum {string}
 */
export enum DataTraceSource {
  /** Refers to: Supplier / Self */
  SUPPLIER = 'SUPPLIER',
  /** Refers to: Buyer or other business that has a direct relation */
  BUYER = 'BUYER',
  INGESTION = 'INGESTION',
  /** Refers to: 3rd party APIs, database, etc. */
  THIRD_PARTY_PROVIDER = 'THIRD_PARTY_PROVIDER',
}

export interface DataTraceMeta {
  /** Used when data is provided by a tenant via upload or by a tenant user in the ui */
  tenantId?: string;
  /** The user that uploaded the data or made the edit */
  userId?: string;
  /** INGESTION, API, UI */
  method?: 'INGESTION' | 'API' | 'UI';
  /** The source data name, date, ... */
  source?: DataTraceMetaSource;
}

export interface DataTraceMetaSource {
  name?: string;
  date?;
  type?: string;
}
