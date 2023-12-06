export interface Tag {
  _id: string
  name: string
  // Video count
  __v: number
}

export interface TagMap extends Map<string, Tag> { }

export interface C4Content {
  _id: string
  title: string
  url: string
  proxyUrl?: string
  submittedBy: string
  likes: number
  tags: Tag[]
  createdAt: Date
  updatedAt: Date
  syncedToBlockchain: boolean
}

export interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
}
