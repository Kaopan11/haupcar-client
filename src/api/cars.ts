import axios from 'axios'
import type { Car, CarInput } from '../types/car'

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
