export interface User {
  id : number
  username: string
  online?: number
  email? : string
  avatar?: string
  twofa: boolean
}