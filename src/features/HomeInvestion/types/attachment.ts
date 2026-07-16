export interface Attachment {
  id: string
  name: string
  type: 'image' | 'document'
  url?: string
}