export type PassportJson = {
  type: 'MockPassport'
  warning: string
  issuingCountry: string
  passportNumber: string
  surname: string
  givenNames: string
  nationality: string
  dateOfBirth: string
  sex: 'F' | 'M' | 'X'
  dateOfIssue: string
  dateOfExpiry: string
  placeOfBirth: string
  mrz: [string, string]
}

export type ResidenceJson = {
  warning: string
  visa: string
  visaCategory: string
  isNonResident: boolean
  arrivalDate: string
  stayLimit: string
  lodging: string
  arcNumber: string | null
}

export type EligibilityJson = {
  scenarios: Array<
    | 'immediate_refund'
    | 'downtown_pre_refund'
    | 'airport_refund'
    | 'hotel_check_in'
    | 'rental_car'
  >
  preferredPayoutPartner: string
  shoppingBudgetKRW: number
  expectedRefundKRW: number
}

export type Persona = {
  id: string
  passport: PassportJson
  residence: ResidenceJson
  eligibility: EligibilityJson
  faceSvgUrl: string
}
