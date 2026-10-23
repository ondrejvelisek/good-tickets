import type { User } from '../../../src/api/types'

export const CURRENT_USER_ID = 'u-candidate'

export const users: User[] = [
  { id: 'u-candidate', name: 'Candidate', initials: 'CA', avatarColor: '#0f766e', canViewConfidential: false },
  { id: 'u-james', name: 'James Goodman', initials: 'JG', avatarColor: '#7c3aed', canViewConfidential: false },
  { id: 'u-petra', name: 'Petra Novotna', initials: 'PN', avatarColor: '#db2777', canViewConfidential: true },
  { id: 'u-martin', name: 'Martin Dvorak', initials: 'MD', avatarColor: '#2563eb', canViewConfidential: true },
  { id: 'u-lucie', name: 'Lucie Cerna', initials: 'LC', avatarColor: '#ea580c', canViewConfidential: false },
  { id: 'u-daniel', name: 'Daniel Kim', initials: 'DK', avatarColor: '#16a34a', canViewConfidential: true },
  { id: 'u-sara', name: 'Sara Lindqvist', initials: 'SL', avatarColor: '#ca8a04', canViewConfidential: false },
  { id: 'u-omar', name: 'Omar Haddad', initials: 'OH', avatarColor: '#475569', canViewConfidential: true },
]
