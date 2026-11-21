import axios from 'axios'
import type { Car, CarInput } from '../types/car'

export type CarFieldError = {
  field: string
  message: string
}

export type CarProblem = {
  status: number
  message: string
  errors: CarFieldError[]
}

// Talk to the Node API only
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// Load every car
export async function listCars(): Promise<Car[]> {
  // Ask the API for the car list
  const response = await api.get<Car[]>('/cars')
  return response.data
}

// Load one car by id
export async function getCar(id: number): Promise<Car> {
  // Ask the API for that car
  const response = await api.get<Car>(`/cars/${id}`)
  return response.data
}

// Create a car
export async function createCar(input: CarInput): Promise<Car> {
  // Send the form fields to the API
  const response = await api.post<Car>('/cars', input)
  return response.data
}

// Update a car
export async function updateCar(id: number, input: CarInput): Promise<Car> {
  // Send the new fields for that car
  const response = await api.put<Car>(`/cars/${id}`, input)
  return response.data
}

// Delete a car
export async function deleteCar(id: number): Promise<void> {
  // Ask the API to remove that car
  await api.delete(`/cars/${id}`)
}

// Read the status and field errors from a failed car request
export function readCarProblem(error: unknown): CarProblem {
  // A non-axios failure has no status
  if (!axios.isAxiosError(error)) {
    return { status: 0, message: 'Something went wrong', errors: [] }
  }
  // Read the JSON body when the server sent one
  const data = error.response?.data as { message?: string; errors?: CarFieldError[] } | undefined
  // Return the status, the message, and any field errors
  return {
    status: error.response?.status ?? 0,
    message: data?.message || 'Something went wrong',
    errors: data?.errors ?? [],
  }
}
