import { App, Card, Form } from 'antd'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createCar } from '../api/cars'
import CarForm, { showCarSaveError, type CarFormAlert } from '../components/CarForm'
import type { CarInput } from '../types/car'

// Show the empty form and save a new car
export default function CarCreatePage() {
  // Read the message box from the app shell
  const { message } = App.useApp()
  // Leave this page for the list
  const navigate = useNavigate()
  // Hold the four fields
  const [form] = Form.useForm<CarInput>()
  // Keep the save spinner and the red box
  const [saving, setSaving] = useState(false)
  const [alert, setAlert] = useState<CarFormAlert | null>(null)

  // Save the form, then go back to the list
  async function saveCar(values: CarInput) {
    // Show the button spinner
    setSaving(true)
    // Clear the old red box
    setAlert(null)
    try {
      // Ask the API to create the car
      await createCar(values)
      // Tell the user it worked
      message.success('Car added')
      // Go back to the list
      navigate('/')
    } catch (error) {
      // Show a field error, a red box, or a toast
      showCarSaveError(error, values.licensePlate, form, (text) => message.error(text), setAlert)
    } finally {
      // Hide the button spinner
      setSaving(false)
    }
  }

  return (
    <div style={{ width: 720, maxWidth: '100%', margin: '0 auto' }}>
      {/* Show Cars / Add Car */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, fontSize: 14, lineHeight: '22px' }}>
        <Link to="/" style={{ color: '#8C8C8C' }}>
          Cars
        </Link>
        <span style={{ color: '#8C8C8C' }}>/</span>
        <span style={{ color: '#1F1F1F' }}>Add Car</span>
      </div>
      {/* Show the add form */}
      <Card title="Add Car" style={{ borderColor: '#F0F0F0' }}>
        <CarForm
          form={form}
          submitLabel="Save"
          saving={saving}
          alert={alert}
          onSave={saveCar}
          onCancel={() => navigate('/')}
          onInvalid={() => setAlert(null)}
        />
      </Card>
    </div>
  )
}
