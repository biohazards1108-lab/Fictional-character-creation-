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
}

const blocked = /child|kid|minor|young-looking|teen|underage|loli|shota|sexual intercourse|explicit sex|graphic sex|penetration|full nudity|fully nude|completely nude|genitals|porn|celebrity|real person|public figure|deepfake/i

export function validateCharacterRequest(input: CharacterRequest) {
  const age = Number(input.age)
  const text = Object.values(input).join(' ')
  const errors: string[] = []

  if (!Number.isFinite(age) || age < 1 || age > 10_000) errors.push('Enter a valid character age.')
  if (input.mode === 'adult' && age < 18) errors.push('Sensual / Adult mode requires an explicitly adult character aged 18 or older.')
  if (blocked.test(text)) errors.push('This request includes unsupported content. Characters must be fictional, adult when required, non-graphic, and never fully nude.')
  if (input.mode === 'adult' && /suggestive|sensual|revealing|lingerie|sultry|romantic/i.test(text) && age < 18) errors.push('Adult styling is only available for characters aged 18 or older.')

  return { valid: errors.length === 0, errors, normalizedAge: age }
}

export function buildSafePrompt(input: CharacterRequest) {
  const result = validateCharacterRequest(input)
  if (!result.valid) throw new Error(result.errors.join(' '))
  const modeLine = input.mode === 'adult'
    ? input.adultSubmode === 'sexual'
      ? 'adult fictional character, non-graphic sexual styling, partial nudity permitted, never fully nude'
      : 'adult fictional character, non-sexual styling, no nudity'
    : 'fictional character, non-sexual styling'
  return [
    input.name || 'Unnamed character',
    `${result.normalizedAge}-year-old ${input.species || 'fantasy character'}`,
    input.personality,
    input.clothing,
    input.pose,
    input.environment,
    modeLine,
    'high quality fantasy character art, preserve defining facial features and identity, no real-person likeness, no sexual activity, no graphic content',
  ].filter(Boolean).join(', ')
}
