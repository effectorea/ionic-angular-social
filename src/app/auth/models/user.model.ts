import {Post} from "../../home/models/Post";

export type Role = 'admin' | 'user' | 'premium'

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: Role
  posts: Post[]
}
