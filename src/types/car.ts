export type Car = {
  id: number
  licensePlate: string
  brand: string
  model: string
  notes: string | null
  createdAt: string
  updatedAt: string
}

export type CarInput = {
  licensePlate: string
  brand: string
  model: string
  notes: string
}
