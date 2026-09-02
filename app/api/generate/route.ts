import { generateImage } from 'ai'
import { NextResponse } from 'next/server'
import { buildSafePrompt, validateCharacterRequest, type CharacterRequest } from '@/lib/character-safety'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const input = (await request.json()) as CharacterRequest
    const validation = validateCharacterRequest(input)

    if (!validation.valid) {
      return NextResponse.json({ errors: validation.errors }, { status: 400 })
    }

    const prompt = buildSafePrompt(input)
    // Recraft V4.1 is available through Vercel AI Gateway's $5 monthly
    // free-credit allowance and is a better fit for character artwork.
    const model = process.env.IMAGE_MODEL || 'recraft/recraft-v4.1'

    const result = await generateImage({
      model,
      prompt,
      size: '1024x1024',
    })

    return NextResponse.json({
      prompt,
      image: `data:${result.image.mediaType};base64,${result.image.base64}`,
    })
  } catch (error) {
    console.error('[Character Creation] Image generation failed:', error)

    const message = error instanceof Error ? error.message : 'Unknown image generation error'
    return NextResponse.json(
      {
        error: process.env.NODE_ENV === 'development'
          ? `Image generation failed: ${message}`
          : 'Unable to generate this character right now. Check the Vercel function logs for the underlying error.',
      },
      { status: 500 },
    )
  }
}
