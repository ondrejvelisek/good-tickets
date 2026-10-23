import type { User } from '../../../src/api'

export const CURRENT_USER_ID = 'u-candidate'

export const users: User[] = [
  { id: 'u-candidate', name: 'Candidate', canViewConfidential: false },
  { id: 'u-james', name: 'James Goodman', canViewConfidential: false },
  { id: 'u-petra', name: 'Petra Novotna', canViewConfidential: true },
  { id: 'u-martin', name: 'Martin Dvorak', canViewConfidential: true },
  { id: 'u-lucie', name: 'Lucie Cerna', canViewConfidential: false },
  { id: 'u-daniel', name: 'Daniel Kim', canViewConfidential: true },
  { id: 'u-sara', name: 'Sara Lindqvist', canViewConfidential: false },
  { id: 'u-omar', name: 'Omar Haddad', canViewConfidential: true },
]
