export interface LocationSelection {
  province: string
  district: string
  commune: string
  village: string
}

export const EMPTY_LOCATION: LocationSelection = {
  province: '',
  district: '',
  commune: '',
  village: '',
}