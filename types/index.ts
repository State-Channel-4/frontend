export interface Tag {
  _id: string
  name: string
}

export interface TagMap extends Map<string, Tag> {}

export interface C4Content {
  _id: string
  title: string
  url: string
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

export interface MatchDocument {
  _id: string, 
  user1: {
    id: string,
    urls: Array<string>,
    completed: boolean,
},
user2: {
  id: string,
  urls: Array<string>,
  completed: boolean,
},
status: string;
threshold: number; // threshold is max limit of urls allowed to be validated, depnds on key in MatchGroup
createdAt: Date;
updatedAt: Date;
}