import { generateImage, createGateway } from 'ai'
import { NextResponse } from 'next/server'
import { buildSafePrompt, validateCharacterRequest, type CharacterRequest } from '@/lib/character-safety'

export const runtime = 'nodejs'

const gateway = createGateway()

export async function POST(request: Request) {
  try {
    const input = (await request.json()) as CharacterRequest
    const validation = validateCharacterRequest(input)
    if (!validation.valid) return NextResponse.json({ errors: validation.errors }, { status: 400 })

    const prompt = buildSafePrompt(input)
    const result = await generateImage({
      model: gateway.imageModel(process.env.IMAGE_MODEL || 'openai/gpt-image-1.5'),
      prompt,
      size: '1024x1024',
    })

    return NextResponse.json({
      prompt,
      image: `data:${result.image.mediaType};base64,${result.image.base64}`,
    })
  } catch (error) {
    console.error('[v0] Image generation failed:', error)
    return NextResponse.json({ error: 'Unable to generate this character right now.' }, { status: 500 })
  }
}
