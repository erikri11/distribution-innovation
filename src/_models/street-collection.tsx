export interface IStreetCollection {
  streets: IStreet[],
  totalResults: number
}

interface IStreet {
  countryCode: string,
  city: string,
  streetName: string,
  streetIds: number[]
}