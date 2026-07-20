const STORAGE_KEY = 'ngo_partner_logos'

function load(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
  } catch {
    return {}
  }
}

function save(map: Record<string, string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
}

export function getLogo(partnerId: number): string | null {
  return load()[String(partnerId)] ?? null
}

export function saveLogo(partnerId: number, base64: string) {
  const map = load()
  // Remove this exact image from any other partner first (1 image → 1 NGO)
  for (const key of Object.keys(map)) {
    if (key !== String(partnerId) && map[key] === base64) {
      delete map[key]
    }
  }
  map[String(partnerId)] = base64
  save(map)
}

export function removeLogo(partnerId: number) {
  const map = load()
  delete map[String(partnerId)]
  save(map)
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
