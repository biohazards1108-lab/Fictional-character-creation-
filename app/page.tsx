'use client'

import './prompt-studio.css'
import { useState } from 'react'
import { Download, ImagePlus, Loader2, Sparkles, ShieldCheck } from 'lucide-react'

const examples = [
  'Cinematic fantasy portrait of an adult elven sorceress in a moonlit palace, silver hair, emerald eyes, ornate velvet clothing, dramatic rim lighting.',
  'Original adult dark-fantasy warrior woman, athletic build, battle-worn armor, rain, smoky battlefield, cinematic composition.',
  'Original adult fantasy elf woman, glamorous evening styling, elegant curves, deep emerald velvet gown, confident pose, natural stretch marks and freckles, soft studio lighting, tasteful sensual mood.',
]

const bodyTypes = ['Natural curves', 'Soft curvy', 'Athletic', 'Hourglass', 'Petite adult', 'Tall and statuesque']
const bodyDetails = ['Natural skin texture', 'Freckles', 'Stretch marks', 'Subtle scars', 'Soft body definition']
const poses = ['Confident standing', 'Sultry portrait', 'Reclining glamour', 'Walking toward camera', 'Over-the-shoulder', 'Elegant seated pose']
const moods = ['Confident', 'Mysterious', 'Sultry glamour', 'Regal', 'Playful', 'Intense']

export default function Page() {
  const [prompt, setPrompt] = useState('')
  const [age, setAge] = useState('18')
  const [adult, setAdult] = useState(true)
  const [sexual, setSexual] = useState(false)
  const [style, setStyle] = useState('Cinematic fantasy')
  const [bodyType, setBodyType] = useState('Natural curves')
  const [bodyDetail, setBodyDetail] = useState('Natural skin texture')
  const [pose, setPose] = useState('Confident standing')
  const [mood, setMood] = useState('Confident')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function generate() {
    setError('')
    setImageUrl(null)
    setLoading(true)
    try {
      const numericAge = Number(age)
      if (!Number.isFinite(numericAge) || numericAge < 18) throw new Error('Characters must be explicitly fictional adults aged 18 or older.')
      if (!prompt.trim()) throw new Error('Enter a prompt describing the fictional character and scene.')

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          mode: adult ? 'adult' : 'nonsexual',
          adultSubmode: sexual ? 'sexual' : 'nonsexual',
          age: numericAge,
          species: 'Original fictional character',
          customPrompt: prompt.trim(),
          artStyle: style,
          bodyType,
          bodyDetails: bodyDetail,
          pose,
          mood,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.errors?.[0] || data.error || 'Generation failed.')
      setImageUrl(data.image)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to generate the image.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="prompt-studio">
      <header className="prompt-header">
        <div className="brand"><div className="brand-icon"><Sparkles size={18} /></div><div><strong>Character Creation</strong><span>Fictional image studio</span></div></div>
        <div className="header-badge"><ShieldCheck size={15} /> Fictional adults only</div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">AI CHARACTER STUDIO</span>
          <h1>Describe it.<br /><em>Bring it to life.</em></h1>
          <p>Build original adult fantasy characters with detailed body, skin, pose, mood, wardrobe, lighting, and camera direction.</p>
        </div>

        <div className="generator-card">
          <div className="card-top"><div><span className="label">YOUR PROMPT</span><h2>What should we create?</h2></div><span className="counter">{prompt.length}/4000</span></div>
          <textarea maxLength={4000} value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe the character, clothing, appearance, environment, lighting, camera, mood, composition, and art direction..." />
          <div className="examples"><span>Try an example</span>{examples.map((example, i) => <button key={i} type="button" onClick={() => setPrompt(example)}>Example {i + 1}</button>)}</div>

          <div className="controls">
            <label><span>Character age</span><input type="number" min="18" max="10000" value={age} onChange={(e) => setAge(e.target.value)} /><small>18+ required</small></label>
            <label><span>Art style</span><select value={style} onChange={(e) => setStyle(e.target.value)}><option>Cinematic fantasy</option><option>Photorealistic fantasy</option><option>Digital painting</option><option>Anime</option><option>Manga</option><option>Dark fantasy</option><option>Semi-realistic</option></select></label>
            <label><span>Body type</span><select value={bodyType} onChange={(e) => setBodyType(e.target.value)}>{bodyTypes.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label><span>Skin/body detail</span><select value={bodyDetail} onChange={(e) => setBodyDetail(e.target.value)}>{bodyDetails.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label><span>Pose</span><select value={pose} onChange={(e) => setPose(e.target.value)}>{poses.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label><span>Mood</span><select value={mood} onChange={(e) => setMood(e.target.value)}>{moods.map((item) => <option key={item}>{item}</option>)}</select></label>
          </div>

          <div className="mode-row">
            <button type="button" className={adult ? 'toggle active' : 'toggle'} onClick={() => setAdult(!adult)}><span className="switch" /><span><strong>18+ Adult mode</strong><small>Fictional adult characters only</small></span></button>
            {adult && <button type="button" className={sexual ? 'toggle adult-active' : 'toggle'} onClick={() => setSexual(!sexual)}><span className="switch" /><span><strong>Sensual mode</strong><small>Glamour, curves and provocative styling</small></span></button>}
          </div>
          <div className="boundary"><ShieldCheck size={15} /><span><strong>Hard boundary:</strong> fictional adults only. No minors, childlike characters, real people, celebrity likenesses, or graphic sexual content.</span></div>
          <button className="generate" onClick={generate} disabled={loading || !prompt.trim()}>{loading ? <><Loader2 className="spin" size={18} /> Creating image…</> : <><Sparkles size={18} /> Generate image</>}</button>
          {error && <div className="error" role="alert">{error}</div>}
        </div>
      </section>

      <section className="output-section">
        <div className="output-heading"><div><span className="eyebrow">OUTPUT</span><h2>Your generated image</h2></div>{imageUrl && <a className="download" href={imageUrl} download="character.png"><Download size={15} /> Save image</a>}</div>
        <div className={`output ${imageUrl ? 'has-image' : ''}`}>
          {imageUrl ? <img src={imageUrl} alt="Generated fictional character" /> : loading ? <div className="empty"><Loader2 className="spin" size={30} /><strong>Creating your character</strong><span>Your prompt is being turned into an image.</span></div> : <div className="empty"><div className="image-icon"><ImagePlus size={25} /></div><strong>Your image will appear here</strong><span>Enter a prompt above and select Generate image.</span></div>}
        </div>
      </section>

      <footer><span>Original fictional characters</span><span>•</span><span>18+ generation</span><span>•</span><span>No real-person likenesses</span></footer>
    </main>
  )
}
