import { useEffect, useRef, useCallback } from 'react'

// Generates ambient meditation audio using Web Audio API
export function useAudioEngine() {
  const ctxRef = useRef(null)
  const nodesRef = useRef([])
  const masterGainRef = useRef(null)
  const isActiveRef = useRef(false)

  const getCtx = () => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)()
      masterGainRef.current = ctxRef.current.createGain()
      masterGainRef.current.gain.value = 0.4
      masterGainRef.current.connect(ctxRef.current.destination)
    }
    return ctxRef.current
  }

  const stopAll = useCallback(() => {
    isActiveRef.current = false
    nodesRef.current.forEach(n => { try { n.stop(); n.disconnect() } catch(e){} })
    nodesRef.current = []
  }, [])

  // Creates a pink noise buffer for ambient sound
  const createNoise = useCallback((type = 'pink') => {
    const ctx = getCtx()
    const bufferSize = ctx.sampleRate * 4
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    
    if (type === 'pink') {
      let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1
        b0=0.99886*b0+white*0.0555179; b1=0.99332*b1+white*0.0750759
        b2=0.96900*b2+white*0.1538520; b3=0.86650*b3+white*0.3104856
        b4=0.55000*b4+white*0.5329522; b5=-0.7616*b5-white*0.0168980
        data[i]=(b0+b1+b2+b3+b4+b5+b6+white*0.5362)*0.11
        b6=white*0.115926
      }
    } else {
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1
    }
    return buffer
  }, [])

  // Play a soothing sine tone with LFO modulation
  const playTone = useCallback((freq, lfoFreq = 0.1, gain = 0.05) => {
    const ctx = getCtx()
    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()
    const lfo = ctx.createOscillator()
    const lfoGain = ctx.createGain()
    
    osc.type = 'sine'
    osc.frequency.value = freq
    gainNode.gain.value = gain
    lfo.frequency.value = lfoFreq
    lfoGain.gain.value = freq * 0.02

    lfo.connect(lfoGain)
    lfoGain.connect(osc.frequency)
    osc.connect(gainNode)
    gainNode.connect(masterGainRef.current)
    
    lfo.start(); osc.start()
    nodesRef.current.push(osc, lfo)
    return { osc, gainNode }
  }, [])

  const playAmbient = useCallback((type = 'forest') => {
    stopAll()
    isActiveRef.current = true
    const ctx = getCtx()
    if (ctx.state === 'suspended') ctx.resume()

    if (type === 'sleep' || type === 'ocean') {
      // Deep ocean drones
      const noiseBuffer = createNoise('pink')
      const src = ctx.createBufferSource()
      src.buffer = noiseBuffer
      src.loop = true
      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = 400
      const gain = ctx.createGain(); gain.gain.value = 0.3
      src.connect(filter); filter.connect(gain); gain.connect(masterGainRef.current)
      src.start(); nodesRef.current.push(src)

      playTone(55, 0.05, 0.08)
      playTone(82, 0.07, 0.05)
      playTone(110, 0.12, 0.03)
    } else if (type === 'focus') {
      // Binaural-ish focus tones
      playTone(200, 0.5, 0.04)
      playTone(210, 0.5, 0.04)
      playTone(300, 0.3, 0.025)
      playTone(400, 0.2, 0.02)
    } else if (type === 'stress' || type === 'breathe') {
      // Calming bells + drone
      playTone(396, 0.08, 0.06)
      playTone(528, 0.06, 0.04)
      playTone(174, 0.04, 0.07)
      const noiseBuffer = createNoise('pink')
      const src = ctx.createBufferSource()
      src.buffer = noiseBuffer; src.loop = true
      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'; filter.frequency.value = 300
      const gain = ctx.createGain(); gain.gain.value = 0.1
      src.connect(filter); filter.connect(gain); gain.connect(masterGainRef.current)
      src.start(); nodesRef.current.push(src)
    } else {
      // Default mindfulness — warm tones
      playTone(264, 0.06, 0.06)
      playTone(396, 0.08, 0.04)
      playTone(528, 0.05, 0.03)
    }
  }, [stopAll, createNoise, playTone])

  const setVolume = useCallback((vol) => {
    if (masterGainRef.current) masterGainRef.current.gain.value = vol * 0.5
  }, [])

  const pause = useCallback(() => {
    if (ctxRef.current) ctxRef.current.suspend()
  }, [])

  const resume = useCallback(() => {
    if (ctxRef.current) ctxRef.current.resume()
  }, [])

  useEffect(() => () => stopAll(), [stopAll])

  return { playAmbient, stopAll, setVolume, pause, resume }
}
