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
}

const blocked = /child|kid|minor|young-looking|teen|underage|loli|shota|sexual intercourse|explicit sex|graphic sex|penetration|full nudity|fully nude|completely nude|topless|bottomless|genitals|porn|celebrity|real person|public figure|deepfake/i

export function validateCharacterRequest(input: CharacterRequest) {
  const age = Number(input.age)
  const text = Object.values(input).join(' ')
  const errors: string[] = []

  if (!Number.isFinite(age) || age < 1 || age > 10_000) errors.push('Enter a valid character age.')
  if (input.mode === 'adult' && age < 18) errors.push('Sensual / Adult mode requires an explicitly adult character aged 18 or older.')
  if (blocked.test(text)) errors.push('This request includes unsupported content. Characters must be fictional, adult when required, non-graphic, and never nude.')

  return { valid: errors.length === 0, errors, normalizedAge: age }
}

export function buildSafePrompt(input: CharacterRequest) {
  const result = validateCharacterRequest(input)
  if (!result.valid) throw new Error(result.errors.join(' '))

  const modeLine = input.mode === 'adult'
    ? input.adultSubmode === 'sexual'
      ? 'adult fictional character, sensual and non-graphic styling, fully clothed, no nudity'
      : 'adult fictional character, non-sexual styling, fully clothed, no nudity'
    : 'fictional character, non-sexual styling, fully clothed, no nudity'

  return [
    input.name || 'Unnamed character',
    `${result.normalizedAge}-year-old ${input.species || 'fantasy character'}`,
    input.personality,
    input.appearance,
    input.clothing,
    input.pose,
    input.environment,
    input.lighting,
    input.camera,
    input.artStyle,
    input.customPrompt,
    modeLine,
    'high quality character art, preserve defining facial features and identity, fictional only, no real-person likeness, no sexual activity, no graphic sexual content, no nudity',
  ].filter(Boolean).join(', ')
}
