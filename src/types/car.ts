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

// Turn an API time into YYYY-MM-DD HH:mm
export function formatUpdatedAt(value: string): string {
  // Read the time from the API
  const date = new Date(value)
  // Keep the raw text when it is not a real date
  if (Number.isNaN(date.getTime())) {
    return value
  }
  // Build each part with a leading zero
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  // Join the date and the time
  return `${year}-${month}-${day} ${hour}:${minute}`
}
