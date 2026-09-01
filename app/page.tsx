'use client'

import { useMemo, useState } from 'react'
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  Download,
  ImagePlus,
  LayoutDashboard,
  LockKeyhole,
  Menu,
  MoreHorizontal,
  Palette,
  Plus,
  Save,
  Settings,
  Sparkles,
  UserRound,
  WandSparkles,
  X,
} from 'lucide-react'

const steps = ['Identity', 'Appearance', 'Clothing', 'Pose & mood', 'World', 'Finish']
const species = ['Elf', 'Dark Elf', 'Human', 'Orc', 'Tiefling', 'Dragonborn', 'Custom']
const builds = ['Graceful', 'Athletic', 'Curvy', 'Statuesque', 'Compact']
const outfits = ['Moonlit gown', 'Royal armor', 'Layered robes', 'Adventurer gear', 'Casual linen']
const scenes = ['Enchanted forest', 'Elven palace', 'Magical ruins', 'Castle balcony', 'Moonlit beach']

function Choice({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`choice ${selected ? 'choice-selected' : ''}`} aria-pressed={selected}>
      {selected && <Check size={14} aria-hidden="true" />}
      <span>{label}</span>
    </button>
  )
}

function Field({ label, value, placeholder, onChange }: { label: string; value: string; placeholder: string; onChange: (value: string) => void }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

export default function Page() {
  const [activeStep, setActiveStep] = useState(0)
  const [mode, setMode] = useState<'nonsexual' | 'adult'>('nonsexual')
  const [adultSubmode, setAdultSubmode] = useState<'nonsexual' | 'sexual'>('nonsexual')
  const [name, setName] = useState('Aurelia Vale')
  const [age, setAge] = useState('124')
  const [selectedSpecies, setSelectedSpecies] = useState('High Elf')
  const [selectedBuild, setSelectedBuild] = useState('Graceful')
  const [gender, setGender] = useState('Woman')
  const [occupation, setOccupation] = useState('Moon archivist')
  const [alignment, setAlignment] = useState('Neutral good')
  const [personality, setPersonality] = useState('Quietly brilliant, fiercely loyal')
  const [background, setBackground] = useState('Carrying a secret map to the lost gardens of the old world.')
  const [skinTone, setSkinTone] = useState('Warm umber')
  const [eyeColor, setEyeColor] = useState('Silver gray')
  const [hair, setHair] = useState('Silver, waist-length, braided')
  const [features, setFeatures] = useState('High cheekbones, pointed ears, star-shaped cheek mark')
  const [bodyProportions, setBodyProportions] = useState('Long-limbed, elegant silhouette')
  const [details, setDetails] = useState('Freckles across the nose; fine constellation tattoos on the collarbone')
  const [outfit, setOutfit] = useState('Moonlit gown')
  const [materials, setMaterials] = useState('Midnight velvet, moonstone clasp, embroidered constellations')
  const [pose, setPose] = useState('Standing')
  const [expression, setExpression] = useState('Mysterious')
  const [scene, setScene] = useState('Enchanted forest')
  const [atmosphere, setAtmosphere] = useState('Blue hour, drifting fireflies, ancient trees')
  const [lighting, setLighting] = useState('Moonlight')
  const [camera, setCamera] = useState('Medium shot')
  const [artStyle, setArtStyle] = useState('Cinematic fantasy')
  const [generated, setGenerated] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationError, setGenerationError] = useState('')
  const [mobileNav, setMobileNav] = useState(false)

  const prompt = useMemo(() => `${name || 'Unnamed character'}, ${age || 'adult'} year old ${gender} ${selectedSpecies}. ${personality}. ${occupation}; ${alignment} alignment. ${background} Appearance: ${skinTone} skin, ${eyeColor} eyes, ${hair} hair, ${selectedBuild.toLowerCase()} build, ${bodyProportions}, ${features}, ${details}. Wearing ${outfit}; ${materials}. ${pose} pose, ${expression.toLowerCase()} expression, in an ${scene.toLowerCase()}; ${atmosphere}. ${lighting}, ${camera}, ${artStyle}. Character Lock preserves face, hair, eyes, species, proportions and markings. Fictional, ${mode === 'adult' && adultSubmode === 'sexual' ? 'adult, non-graphic sexual styling with partial nudity allowed, never fully nude' : 'non-sexual styling, no nudity'}.`, [name, age, gender, selectedSpecies, personality, occupation, alignment, background, skinTone, eyeColor, hair, selectedBuild, bodyProportions, features, details, outfit, materials, pose, expression, scene, atmosphere, lighting, camera, artStyle])

  const next = () => setActiveStep((step) => Math.min(step + 1, steps.length - 1))
  const previous = () => setActiveStep((step) => Math.max(step - 1, 0))
  const generate = async () => {
    setIsGenerating(true)
    setGenerationError('')
    try {
      const response = await fetch('/api/generate', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ mode, adultSubmode, age, name, species: selectedSpecies, clothing: `${outfit}; ${materials}`, environment: `${scene}; ${atmosphere}`, pose: `${pose}, ${expression}`, personality: `${personality}. ${background}`, appearance: `${skinTone}; ${eyeColor}; ${hair}; ${selectedBuild}; ${bodyProportions}; ${features}; ${details}`, lighting, camera, artStyle }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.errors?.[0] || data.error || 'Generation failed')
      setImageUrl(data.image)
      setGenerated(true)
    } catch (error) {
      setGenerationError(error instanceof Error ? error.message : 'Unable to generate this character right now.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <main className="studio-shell">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark"><Sparkles size={17} /></div>
          <div><strong>Character Creation</strong><span>Private design studio</span></div>
        </div>
        <div className="topbar-actions">
          <button className="icon-button" aria-label="Help"><CircleHelp size={18} /></button>
          <button className="icon-button" aria-label="Settings"><Settings size={18} /></button>
          <div className="avatar">AV</div>
        </div>
      </header>

      <div className="studio-layout">
        <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
          <div className="mobile-sidebar-head"><span>Workspace</span><button className="icon-button" onClick={() => setMobileNav(false)} aria-label="Close navigation"><X size={18} /></button></div>
          <nav aria-label="Primary navigation">
            <p className="nav-label">Workspace</p>
            <button className="nav-item active"><WandSparkles size={17} /> Character Creation</button>
            <button className="nav-item"><UserRound size={17} /> My Characters <span className="nav-count">12</span></button>
            <button className="nav-item"><Clock3 size={17} /> Generation History</button>
            <button className="nav-item"><Settings size={17} /> Settings</button>
          </nav>
          <div className="sidebar-bottom">
            <div className="privacy-card"><LockKeyhole size={16} /><div><strong>Private by default</strong><span>Your creations are yours alone.</span></div></div>
            <button className="new-character"><Plus size={16} /> New character</button>
          </div>
        </aside>

        <section className="workspace">
          <div className="workspace-head">
            <div className="title-group"><button className="mobile-menu icon-button" onClick={() => setMobileNav(true)} aria-label="Open navigation"><Menu size={18} /></button><div><div className="eyebrow">NEW CREATION <span className="dot" /> AUTOSAVED JUST NOW</div><h1>Build your character</h1><p>Shape a character worth remembering.</p></div></div>
            <button className="save-button"><Save size={16} /> Save draft</button>
          </div>

          <div className="mode-switcher" role="group" aria-label="Creation mode">
            <button type="button" className={mode === 'nonsexual' ? 'mode-active' : ''} onClick={() => setMode('nonsexual')}><span className="mode-icon"><WandSparkles size={17} /></span><span><strong>Non-sexual</strong><small>Heroes, villains, creatures & more</small></span>{mode === 'nonsexual' && <Check className="mode-check" size={16} />}</button>
            <button type="button" className={mode === 'adult' ? 'mode-active adult-mode' : ''} onClick={() => setMode('adult')}><span className="mode-icon"><Palette size={17} /></span><span><strong>18+ / Adult</strong><small>Choose non-sexual or sexual styling</small></span>{mode === 'adult' && <Check className="mode-check" size={16} />}</button>
          </div>

          {mode === 'adult' && <div className="adult-submode" role="group" aria-label="Adult creation style"><div className="adult-submode-heading"><span>Adult styling</span><small>Explicitly 18+ characters only</small></div><div className="adult-submode-options"><button type="button" className={adultSubmode === 'nonsexual' ? 'submode-active' : ''} onClick={() => setAdultSubmode('nonsexual')}><strong>Non-sexual</strong><span>Fashion, glamour and character portraits</span></button><button type="button" className={adultSubmode === 'sexual' ? 'submode-active' : ''} onClick={() => setAdultSubmode('sexual')}><strong>Sexual</strong><span>Adult, non-graphic intimacy and partial nudity</span></button></div><p className="adult-boundary">No full nudity, minors, real-person likenesses, graphic sexual acts, or sexual activity.</p></div>}

          <div className="progress-row"><div className="step-track">{steps.map((step, index) => <button type="button" key={step} onClick={() => setActiveStep(index)} className={`step ${index === activeStep ? 'step-active' : ''} ${index < activeStep ? 'step-done' : ''}`}><span>{index < activeStep ? <Check size={13} /> : index + 1}</span>{step}</button>)}</div><span className="step-meta">Step {activeStep + 1} of {steps.length}</span></div>

          <div className="builder-grid">
            <section className="builder-card">
              <div className="card-heading"><div><span className="section-kicker">0{activeStep + 1} / {steps.length}</span><h2>{steps[activeStep]}</h2><p>{activeStep === 0 ? 'Start with the soul of your character.' : activeStep === 1 ? 'Define the details that make them unmistakable.' : activeStep === 2 ? 'Dress them for the story they belong in.' : activeStep === 3 ? 'Give the moment a point of view.' : activeStep === 4 ? 'Place them somewhere unforgettable.' : 'Review the character lock before generating.'}</p></div><button className="more-button" aria-label="More options"><MoreHorizontal size={19} /></button></div>
              {activeStep === 0 && <div className="form-content"><div className="field-grid"><Field label="Character name" value={name} placeholder="Give them a name" onChange={setName} /><Field label="Age" value={age} placeholder="18+" onChange={setAge} /></div><div className="field-grid"><Field label="Gender" value={gender} placeholder="How do they identify?" onChange={setGender} /><Field label="Occupation / class" value={occupation} placeholder="Their role in the world" onChange={setOccupation} /></div><div className="choice-section"><div className="label-row"><span>Species / race</span><button type="button" onClick={() => setSelectedSpecies('Custom species')}>Custom <ArrowRight size={13} /></button></div><div className="choices">{species.map((item) => <Choice key={item} label={item} selected={selectedSpecies === item || (item === 'Custom' && selectedSpecies === 'Custom species')} onClick={() => setSelectedSpecies(item === 'Custom' ? 'Custom species' : item)} />)}</div></div><div className="field-grid"><Field label="Alignment" value={alignment} placeholder="Moral compass" onChange={setAlignment} /><Field label="Background" value={background} placeholder="Origin and history" onChange={setBackground} /></div><label className="field full-field"><span>Personality</span><textarea value={personality} onChange={(event) => setPersonality(event.target.value)} /></label></div>}
              {activeStep === 1 && <div className="form-content"><div className="choice-section"><div className="label-row"><span>Body build</span><span className="muted-hint">Defines silhouette, not identity</span></div><div className="choices">{builds.map((item) => <Choice key={item} label={item} selected={selectedBuild === item} onClick={() => setSelectedBuild(item)} />)}</div></div><div className="field-grid"><Field label="Skin tone" value={skinTone} placeholder="Describe a tone" onChange={setSkinTone} /><Field label="Eye color" value={eyeColor} placeholder="Eye color" onChange={setEyeColor} /></div><div className="field-grid"><Field label="Hair color, length & style" value={hair} placeholder="Describe the hair" onChange={setHair} /><Field label="Facial features & ears" value={features} placeholder="Features, ears, markings" onChange={setFeatures} /></div><div className="field-grid"><Field label="Body proportions" value={bodyProportions} placeholder="Silhouette details" onChange={setBodyProportions} /><Field label="Freckles, scars, tattoos & jewelry" value={details} placeholder="Distinctive details" onChange={setDetails} /></div></div>}
              {activeStep === 2 && <div className="form-content"><div className="choice-section"><div className="label-row"><span>Signature outfit</span><button>Browse all <ArrowRight size={13} /></button></div><div className="choices">{outfits.map((item) => <Choice key={item} label={item} selected={outfit === item} onClick={() => setOutfit(item)} />)}</div></div><label className="field full-field"><span>Materials, layers & accessories</span><textarea value={materials} onChange={(event) => setMaterials(event.target.value)} placeholder="Fabrics, jewelry, belts, boots, gloves, accessories" /></label><div className="field-grid"><Field label="Primary garment" value={outfit} placeholder="Dress, armor, robes…" onChange={setOutfit} /><Field label="Coverage notes" value={mode === 'adult' ? 'Covered, non-explicit sensual styling' : 'Story-appropriate coverage'} placeholder="Set boundaries" onChange={() => {}} /></div></div>}
              {activeStep === 3 && <div className="form-content"><div className="choice-section"><div className="label-row"><span>Direction</span></div><div className="choices">{['Standing', 'Sitting', 'Reclining', 'Walking', 'Portrait', 'Over-the-shoulder'].map((item) => <Choice key={item} label={item} selected={pose === item} onClick={() => setPose(item)} />)}</div></div><div className="choice-section"><div className="label-row"><span>Expression</span></div><div className="choices">{['Confident', 'Happy', 'Mysterious', 'Serious', 'Playful', 'Romantic', 'Sultry'].map((item) => <Choice key={item} label={item} selected={expression === item} onClick={() => setExpression(item)} />)}</div></div><div className="field-grid"><Field label="Gesture / body language" value="One hand resting on the moonstone clasp" placeholder="Describe the pose" onChange={() => {}} /><Field label="Custom direction" value="" placeholder="Anything else for the moment" onChange={() => {}} /></div></div>}
              {activeStep === 4 && <div className="form-content"><div className="choice-section"><div className="label-row"><span>Environment</span><button type="button" onClick={() => setScene('Custom environment')}>Custom <ArrowRight size={13} /></button></div><div className="choices">{['Enchanted forest', 'Elven palace', 'Medieval bedroom', 'Castle', 'Tavern', 'Village', 'Battlefield', 'Magical ruins', 'Moonlit forest', 'Beach', 'Mountains'].map((item) => <Choice key={item} label={item} selected={scene === item} onClick={() => setScene(item)} />)}</div></div><div className="field-grid"><Field label="Custom environment" value={scene} placeholder="Describe any setting" onChange={setScene} /><Field label="Atmosphere" value={atmosphere} placeholder="Set the feeling" onChange={setAtmosphere} /></div></div>}
              {activeStep === 5 && <div className="form-content"><div className="choice-section"><div className="label-row"><span>Lighting</span></div><div className="choices">{['Daylight', 'Moonlight', 'Candlelight', 'Golden hour', 'Dramatic lighting', 'Soft lighting', 'Cinematic lighting'].map((item) => <Choice key={item} label={item} selected={lighting === item} onClick={() => setLighting(item)} />)}</div></div><div className="choice-section"><div className="label-row"><span>Camera framing</span></div><div className="choices">{['Close portrait', 'Medium shot', 'Full body', 'Wide shot'].map((item) => <Choice key={item} label={item} selected={camera === item} onClick={() => setCamera(item)} />)}</div></div><div className="choice-section"><div className="label-row"><span>Art style</span></div><div className="choices">{['Photorealistic fantasy', 'Cinematic fantasy', 'Digital painting', 'Anime', 'Manga', 'Semi-realistic', 'High-fantasy illustration', 'Dark fantasy'].map((item) => <Choice key={item} label={item} selected={artStyle === item} onClick={() => setArtStyle(item)} />)}</div></div><div className="review-panel"><div className="review-icon"><LockKeyhole size={20} /></div><div><h3>Character Lock is ready</h3><p>Every defining attribute is included in the prompt and preserved across future scenes.</p></div></div></div>}
              <div className="builder-footer"><button className="back-button" onClick={previous} disabled={activeStep === 0}><ChevronLeft size={16} /> Back</button><button className="continue-button" onClick={activeStep === steps.length - 1 ? generate : next}>{activeStep === steps.length - 1 ? <><Sparkles size={16} /> {isGenerating ? 'Creating…' : 'Create image'}</> : <>Continue <ChevronRight size={16} /></>}</button></div>
            </section>

            <aside className="preview-column"><div className={`image-preview ${generated ? 'generated' : ''}`}><div className="preview-top"><span><span className="live-dot" /> Live preview</span><button aria-label="Preview options"><MoreHorizontal size={18} /></button></div>{generated ? <div className="generated-art">{imageUrl ? <img src={imageUrl} alt={`${name} generated character`} className="generated-image" /> : <><div className="art-halo" /><div className="character-silhouette"><div className="character-head" /><div className="character-body" /></div></>}<div className="art-caption"><strong>{name}</strong><span>{selectedSpecies} · Moon archivist</span></div></div> : <div className="empty-preview"><div className="empty-orbit"><ImagePlus size={22} /></div><strong>Your character takes shape here</strong><span>Complete the builder, then bring them to life.</span></div>}<div className="preview-bottom"><span>{generated ? '1 image generated' : 'No generation yet'}</span><button className="download-button" disabled={!generated} aria-label="Download image"><Download size={16} /></button></div></div><div className="prompt-card"><div className="prompt-heading"><span>Prompt preview</span><span className="lock-label"><LockKeyhole size={12} /> Character Lock on</span></div><p>{prompt}</p><div className="prompt-tags"><span>{mode === 'adult' ? `Adult · 18+ · ${adultSubmode === 'sexual' ? 'Sexual' : 'Non-sexual'}` : 'Non-sexual'}</span><span>{mode === 'adult' && adultSubmode === 'sexual' ? 'Partial nudity only' : 'No nudity'}</span><span>Private</span></div></div>{generationError && <p className="generation-error" role="alert">{generationError}</p>}<button className="generate-large" onClick={generate} disabled={isGenerating}><Sparkles size={18} /> {isGenerating ? 'Creating your character…' : 'Generate image'} <span>⌘ ↵</span></button></aside>
          </div>

          {generated && <section className="creation-studio" aria-labelledby="creation-studio-title">
            <div className="creation-studio-header"><div><span className="section-kicker">CREATION STUDIO / 01</span><h2 id="creation-studio-title">Your character, brought to life</h2><p>Review the generated image separately from the builder, then refine this scene or keep the character locked for the next one.</p></div><span className="studio-status"><span className="live-dot" /> Generated just now</span></div>
            <div className="creation-studio-grid"><div className="creation-image">{imageUrl ? <img src={imageUrl} alt={`${name} generated character`} /> : <div className="generated-art"><div className="art-halo" /><div className="character-silhouette"><div className="character-head" /><div className="character-body" /></div></div>}<div className="creation-image-label"><strong>{name}</strong><span>{selectedSpecies} · {artStyle}</span></div></div><div className="creation-controls"><div className="lock-panel"><LockKeyhole size={18} /><div><strong>Character Lock active</strong><span>Face, hair, eyes, species, proportions and markings stay consistent.</span></div></div><div className="creation-prompt"><div className="prompt-heading"><span>Generation prompt</span><span className="lock-label"><LockKeyhole size={12} /> Private</span></div><p>{prompt}</p></div><div className="creation-actions"><button className="secondary-action" type="button" onClick={generate}><Sparkles size={15} /> Regenerate</button><button className="secondary-action" type="button" onClick={() => setGenerated(false)}><WandSparkles size={15} /> Refine builder</button><button className="primary-action" type="button"><Save size={15} /> Save image</button></div></div></div>
          </section>}
        </section>
      </div>
    </main>
  )
}
