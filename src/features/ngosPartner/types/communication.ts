export type CommunicationChannel = 'Email' | 'Call' | 'Visit' | 'SMS'

export interface CommunicationLogEntry {
  id: string
  date: string // ISO yyyy-mm-dd
  channel: CommunicationChannel
  summary: string
}