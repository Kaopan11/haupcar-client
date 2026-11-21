import { App, Button, Card, Form, Result, Spin } from 'antd'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getCar, readCarProblem, updateCar } from '../api/cars'
import CarForm, { showCarSaveError, type CarFormAlert } from '../components/CarForm'
import { formatUpdatedAt, type Car, type CarInput } from '../types/car'

// Load one car, then save the edits
export default function CarEditPage() {
  // Read the message box from the app shell
  const { message } = App.useApp()
  // Read the id from the URL
  const params = useParams()
  const id = Number(params.id)
  // Leave this page for the list
  const navigate = useNavigate()
  // Hold the four fields
  const [form] = Form.useForm<CarInput>()
  // Keep the loaded car, the flags, and the red box
  const [car, setCar] = useState<Car | null>(null)
  const [loading, setLoading] = useState(true)
  const [missing, setMissing] = useState(false)
  const [failed, setFailed] = useState(false)
  const [saving, setSaving] = useState(false)
  const [alert, setAlert] = useState<CarFormAlert | null>(null)

  // Load this car when the page opens
  useEffect(() => {
    // Ignore a response that arrives after the page closes
    let active = true

    // Load the car for this id
    async function loadCar() {
      // A bad id is the same as a missing car
      if (!Number.isInteger(id) || id < 1) {
        setMissing(true)
        setLoading(false)
        return
      }
      // Show the spinner
      setLoading(true)
      try {
        // Ask the API for this car
        const row = await getCar(id)
        // Stop if the page already closed
        if (!active) {
          return
        }
        // Keep the car and fill the form
        setCar(row)
        form.setFieldsValue({
          licensePlate: row.licensePlate,
          brand: row.brand,
          model: row.model,
          notes: row.notes ?? '',
        })
      } catch (error) {
        // Stop if the page already closed
        if (!active) {
          return
        }
        // A missing car gets the 404 page. Other failures get an error page
        const problem = readCarProblem(error)
        if (problem.status === 404 || problem.status === 400) {
          setMissing(true)
        } else {
          setFailed(true)
        }
      } finally {
        // Hide the spinner
        if (active) {
          setLoading(false)
        }
      }
    }

    // Start the load
    void loadCar()
    // Mark this load as old when the id changes
    return () => {
      active = false
    }
  }, [form, id])

  // Save the edits, then go back to the list
  async function saveCar(values: CarInput) {
    // Show the button spinner
    setSaving(true)
    // Clear the old red box
    setAlert(null)
    try {
      // Ask the API to update this car
      await updateCar(id, values)
      // Tell the user it worked
      message.success('Car updated')
      // Go back to the list
      navigate('/')
    } catch (error) {
      // A missing car gets the 404 page
      const problem = readCarProblem(error)
      if (problem.status === 404) {
        setMissing(true)
        return
      }
      // Show a field error, a red box, or a toast
      showCarSaveError(error, values.licensePlate, form, (text) => message.error(text), setAlert)
    } finally {
      // Hide the button spinner
      setSaving(false)
    }
  }

  return (
    <div style={{ width: 720, maxWidth: '100%', margin: '0 auto' }}>
      {/* Show Cars / Edit Car */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, fontSize: 14, lineHeight: '22px' }}>
        <Link to="/" style={{ color: '#8C8C8C' }}>
          Cars
        </Link>
        <span style={{ color: '#8C8C8C' }}>/</span>
        <span style={{ color: '#1F1F1F' }}>Edit Car</span>
      </div>
      {/* Show a spinner, a missing car, a failed load, or the edit form */}
      {loading ? (
        <Card title="Edit Car" style={{ borderColor: '#F0F0F0' }}>
          <Spin />
        </Card>
      ) : missing ? (
        <Result
          status="404"
          title="Car not found"
          extra={
            <Button type="primary" onClick={() => navigate('/')}>
              Back to list
            </Button>
          }
        />
      ) : failed || !car ? (
        <Result
          status="error"
          title="Could not load this car"
          extra={
            <Button type="primary" onClick={() => navigate('/')}>
              Back to list
            </Button>
          }
        />
      ) : (
        <Card
          title="Edit Car"
          extra={<span style={{ color: '#8C8C8C' }}>Last updated {formatUpdatedAt(car.updatedAt)}</span>}
          style={{ borderColor: '#F0F0F0' }}
        >
          <CarForm
            form={form}
            submitLabel="Save Changes"
            saving={saving}
            alert={alert}
            onSave={saveCar}
            onCancel={() => navigate('/')}
            onInvalid={() => setAlert(null)}
          />
        </Card>
      )}
    </div>
  )
}
