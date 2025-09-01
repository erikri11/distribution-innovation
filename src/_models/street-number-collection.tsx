export interface IStreetNumberCollection {
  streetNumbers: IStreetNumber[]
}

export interface IStreetNumber {
  streetNo: number,
  addressId: number,
  entrance?: string,
  houseType: string,
  deliveryPointId: number,
  postalCode: string,
  duplicateNumberAndEntrance: boolean,
  latitude: number,
  longitude: number,
  showHouseholds: boolean
}