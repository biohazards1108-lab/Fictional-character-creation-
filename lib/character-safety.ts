export type CreationMode = 'nonsexual' | 'adult'
export type AdultSubmode = 'nonsexual' | 'sexual'

export type CharacterRequest = {
  mode: CreationMode
  age: string | number
  name?: string
  species?: string
  personality?: string
  clothing?: string
  pose?: string
  environment?: string
  customPrompt?: string
  adultSubmode?: AdultSubmode
  appearance?: string
  lighting?: string
  camera?: string
  artStyle?: string
  bodyType?: string
  bodyDetails?: string
  mood?: string
}

// Hard site boundary: fictional adults only. No minors/childlike characters,
// real people, celebrity likenesses, or graphic sexual content/nudity.
const blocked = /\b(?:child|children|kid|kids|minor|minor-aged|underage|under-aged|teen|teenager|adolescent|preteen|pre-teen|young-looking|childlike|child-like|loli|shota|schoolgirl|schoolboy|celebrity|real person|real-person|public figure|famous person|famous people|lookalike|likeness of|deepfake)\b|sexual intercourse|explicit sex|graphic sex|graphic sexual|penetration|full nudity|fully nude|completely nude|topless|bottomless|genitals|porn(?:ography)?/i

export function validateCharacterRequest(input: CharacterRequest) {
  const age = Number(input.age)
  const text = Object.values(input).join(' ')
  const errors: string[] = []

  if (!Number.isFinite(age) || age < 18 || age > 10_000) {
    errors.push('Characters must be explicitly fictional adults aged 18 or older. Minors are not allowed.')
  }

  if (blocked.test(text)) {
    errors.push('This request includes unsupported content. Only fictional adult characters are allowed; real-person likenesses, minors, graphic sexual content, and nudity are not permitted.')
  }

  if (input.mode === 'adult' && age < 18) {
    errors.push('18+ / Adult mode requires an explicitly adult character aged 18 or older.')
  }

  return { valid: errors.length === 0, errors, normalizedAge: age }
}

export function buildSafePrompt(input: CharacterRequest) {
  const result = validateCharacterRequest(input)
  if (!result.valid) throw new Error(result.errors.join(' '))

  const modeLine = input.mode === 'adult'
    ? input.adultSubmode === 'sexual'
      ? 'adult fictional character, sensual glamour styling, tasteful and non-graphic, fully clothed, no nudity'
      : 'adult fictional character, non-sexual styling, fully clothed, no nudity'
    : 'fictional adult character, non-sexual styling, fully clothed, no nudity'

  return [
    input.name || 'Unnamed character',
    `${result.normalizedAge}-year-old ${input.species || 'fantasy character'}`,
    input.personality,
    input.appearance,
    input.bodyType,
    input.bodyDetails,
    input.clothing,
    input.pose,
    input.mood,
    input.environment,
    input.lighting,
    input.camera,
    input.artStyle,
    input.customPrompt,
    modeLine,
    'high quality character art, fictional adult only, no minors or childlike characters, no real-person likeness, no celebrity likeness, no sexual activity, no graphic sexual content, no nudity',
  ].filter(Boolean).join(', ')
}
