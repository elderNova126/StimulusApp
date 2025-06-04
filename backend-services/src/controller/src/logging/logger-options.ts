export enum StimulusDbLoggingContent {
  None = 0,
  All = 1,
  Query = 2,
  QueryParams = 4,
  Schema = 8,
  Error = 16,
  Warn = 32,
  Info = 64,
  Log = 128,
  Migration = 256,
}

export class StimulusDbLoggerOptions {
  constructor(private readonly loggingContent: string) {}
  public getLoggingContent(): StimulusDbLoggingContent {
    const loggingContentValue: StimulusDbLoggingContent = StimulusDbLoggingContent.None;
    return this.loggingContent
      .split('|')
      .reduce((loggingContentResult: StimulusDbLoggingContent, currentLoggingContent: string) => {
        const typedStimulusDbLoggingContentString =
          currentLoggingContent.trim() as keyof typeof StimulusDbLoggingContent;
        return loggingContentResult | StimulusDbLoggingContent[typedStimulusDbLoggingContentString];
      }, loggingContentValue);
  }
}
