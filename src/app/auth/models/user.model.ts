import {Post} from "../../home/models/Post";

export type Role = 'admin' | 'user' | 'premium'

export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  role: Role
  posts: Post[]
}
