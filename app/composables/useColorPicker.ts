/* ── Color math helpers ─────────────────────────────────────── */

function hsbToRgb(h: number, s: number, b: number): [number, number, number] {
  s /= 100; b /= 100
  const k = (n: number) => (n + h / 60) % 6
  const f = (n: number) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)))
  return [Math.round(f(5) * 255), Math.round(f(3) * 255), Math.round(f(1) * 255)]
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100; l /= 100
  const k = (n: number) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1))
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)]
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')
}

function rgbToHsb(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min
  let h = 0
  if (d > 0) {
    if (max === r) h = 60 * (((g - b) / d + 6) % 6)
    else if (max === g) h = 60 * ((b - r) / d + 2)
    else h = 60 * ((r - g) / d + 4)
  }
  return [Math.round(h), max === 0 ? 0 : Math.round((d / max) * 100), Math.round(max * 100)]
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  const d = max - min
  let h = 0, s = 0
  if (d > 0) {
    s = d / (1 - Math.abs(2 * l - 1))
    if (max === r) h = 60 * (((g - b) / d + 6) % 6)
    else if (max === g) h = 60 * ((b - r) / d + 2)
    else h = 60 * ((r - g) / d + 4)
  }
  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)]
}

function relativeLuminance(r: number, g: number, b: number): number {
  const lin = (v: number) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4 }
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

export function calcContrastRatio(hex1: string, hex2: string): number {
  const toRgb = (hex: string): [number, number, number] | null => {
    const h = hex.trim().replace('#', '').slice(0, 6)
    if (!/^[0-9a-f]{6}$/i.test(h)) return null
    const n = parseInt(h, 16)
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
  }
  const a = toRgb(hex1), b = toRgb(hex2)
  if (!a || !b) return 1
  const L1 = relativeLuminance(...a), L2 = relativeLuminance(...b)
  const [lt, dk] = L1 > L2 ? [L1, L2] : [L2, L1]
  return Math.round(((lt + 0.05) / (dk + 0.05)) * 100) / 100
}

/* ── Composable ─────────────────────────────────────────────── */

export function useColorPicker() {
  const h = ref(210)
  const s = ref(75)
  const b = ref(88)
  const a = ref(100)  // alpha 0-100%

  const hexInput = ref('')
  const rgbInput = ref('')
  const hslInput = ref('')
  const hsbInput = ref('')

  function syncAllInputs() {
    const [r, g, bl] = hsbToRgb(h.value, s.value, b.value)
    const opaque = rgbToHex(r, g, bl)

    if (a.value >= 100) {
      hexInput.value = opaque
      rgbInput.value = r + ', ' + g + ', ' + bl
      const [hh, ss, ll] = rgbToHsl(r, g, bl)
      hslInput.value = hh + ', ' + ss + '%, ' + ll + '%'
      hsbInput.value = h.value + ', ' + s.value + '%, ' + b.value + '%'
    } else {
      const aHex = Math.round(a.value / 100 * 255).toString(16).padStart(2, '0')
      hexInput.value = opaque + aHex
      rgbInput.value = r + ', ' + g + ', ' + bl + ', ' + (a.value / 100).toFixed(2)
      const [hh, ss, ll] = rgbToHsl(r, g, bl)
      hslInput.value = hh + ', ' + ss + '%, ' + ll + '%, ' + a.value + '%'
      hsbInput.value = h.value + ', ' + s.value + '%, ' + b.value + '%, ' + a.value + '%'
    }
  }

  syncAllInputs()

  function applyHex(val: string) {
    let hex = val.trim().replace('#', '')
    if (hex.length === 3) hex = hex.split('').map(x => x + x).join('')
    if (hex.length === 4) hex = hex.split('').map(x => x + x).join('')
    if (!/^[0-9a-f]+$/i.test(hex)) return
    if (hex.length === 8) {
      const r = parseInt(hex.slice(0, 2), 16)
      const g = parseInt(hex.slice(2, 4), 16)
      const bl = parseInt(hex.slice(4, 6), 16)
      const alpha = parseInt(hex.slice(6, 8), 16)
      ;[h.value, s.value, b.value] = rgbToHsb(r, g, bl)
      a.value = Math.round(alpha / 255 * 100)
    } else if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16)
      const g = parseInt(hex.slice(2, 4), 16)
      const bl = parseInt(hex.slice(4, 6), 16)
      ;[h.value, s.value, b.value] = rgbToHsb(r, g, bl)
      a.value = 100
    } else return
    syncAllInputs()
  }

  function applyRgb(val: string) {
    const p = val.split(',').map(x => x.trim())
    if (p.length !== 3 && p.length !== 4) return
    const r = parseInt(p[0]), g = parseInt(p[1]), bl = parseInt(p[2])
    if ([r, g, bl].some(isNaN) || r < 0 || r > 255 || g < 0 || g > 255 || bl < 0 || bl > 255) return
    ;[h.value, s.value, b.value] = rgbToHsb(r, g, bl)
    if (p.length === 4) {
      const alphaVal = parseFloat(p[3])
      if (isNaN(alphaVal)) return
      // RGB alpha is 0–1 decimal
      a.value = Math.min(100, Math.max(0, Math.round(alphaVal * 100)))
    } else {
      a.value = 100
    }
    syncAllInputs()
  }

  function applyHsl(val: string) {
    const p = val.replace(/%/g, '').split(',').map(x => parseFloat(x.trim()))
    if ((p.length !== 3 && p.length !== 4) || p.slice(0, 3).some(isNaN)) return
    const [hh, ss, ll] = p
    if (hh < 0 || hh > 360 || ss < 0 || ss > 100 || ll < 0 || ll > 100) return
    ;[h.value, s.value, b.value] = rgbToHsb(...hslToRgb(hh, ss, ll))
    if (p.length === 4) {
      const alphaVal = p[3]
      if (isNaN(alphaVal) || alphaVal < 0 || alphaVal > 100) return
      // HSL alpha is % (% already stripped)
      a.value = Math.round(alphaVal)
    } else {
      a.value = 100
    }
    syncAllInputs()
  }

  function applyHsb(val: string) {
    const p = val.replace(/%/g, '').split(',').map(x => parseFloat(x.trim()))
    if ((p.length !== 3 && p.length !== 4) || p.slice(0, 3).some(isNaN)) return
    const [hh, ss, bb] = p
    if (hh < 0 || hh > 360 || ss < 0 || ss > 100 || bb < 0 || bb > 100) return
    h.value = Math.round(hh)
    s.value = Math.round(ss)
    b.value = Math.round(bb)
    if (p.length === 4) {
      const alphaVal = p[3]
      if (isNaN(alphaVal) || alphaVal < 0 || alphaVal > 100) return
      a.value = Math.round(alphaVal)
    } else {
      a.value = 100
    }
    syncAllInputs()
  }

  const currentHex = computed(() => {
    const [r, g, bl] = hsbToRgb(h.value, s.value, b.value)
    return rgbToHex(r, g, bl)
  })

  const currentRgba = computed(() => {
    const [r, g, bl] = hsbToRgb(h.value, s.value, b.value)
    return 'rgba(' + r + ',' + g + ',' + bl + ',' + (a.value / 100) + ')'
  })

  const alphaGradientBg = computed(() => {
    const [r, g, bl] = hsbToRgb(h.value, s.value, b.value)
    return 'linear-gradient(to right, rgba(' + r + ',' + g + ',' + bl + ',0), rgba(' + r + ',' + g + ',' + bl + ',1))'
  })

  const shades = computed(() => {
    return [95, 85, 75, 65, 55, 45, 35, 25, 15].map(l => {
      const [r, g, bl] = hslToRgb(h.value, 65, l)
      return rgbToHex(r, g, bl)
    })
  })

  return {
    h, s, b, a,
    hexInput, rgbInput, hslInput, hsbInput,
    currentHex, currentRgba, alphaGradientBg, shades,
    applyHex, applyRgb, applyHsl, applyHsb,
    syncAllInputs,
  }
}
