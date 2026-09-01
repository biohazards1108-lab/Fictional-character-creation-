'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { characterProfiles } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { randomUUID } from 'node:crypto'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function saveCharacter(input: { name: string; mode: string; age: number; profile: Record<string, unknown> }) {
  const userId = await getUserId()
  const [character] = await db.insert(characterProfiles).values({ id: randomUUID(), userId, ...input }).returning()
  return character
}

export async function getCharacters() {
  const userId = await getUserId()
  return db.select().from(characterProfiles).where(eq(characterProfiles.userId, userId)).orderBy(desc(characterProfiles.updatedAt))
}
