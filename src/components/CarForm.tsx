import { Alert, Button, Form, Input } from 'antd'
import type { FormInstance } from 'antd'
import { readCarProblem } from '../api/cars'
import type { CarInput } from '../types/car'

export type CarFormAlert = {
  message: string
  description: string
}

type CarFormProps = {
  form: FormInstance<CarInput>
  submitLabel: string
  saving: boolean
  alert: CarFormAlert | null
  onSave: (values: CarInput) => void
  onCancel: () => void
  onInvalid: () => void
}

// Check the plate the same way the server does, after spaces and dashes are removed
function checkPlate(_: unknown, value?: string): Promise<void> {
  // Drop spaces and dashes before counting
  const plate = (value ?? '').replace(/[\s-]/g, '')
  // An empty plate is required
  if (!plate) {
    return Promise.reject(new Error('Please enter license plate'))
  }
  // The stored plate can be at most 20 letters
  if (plate.length > 20) {
    return Promise.reject(new Error('License plate is too long'))
  }
  return Promise.resolve()
}

// Check a required text field after trimming, using the server length
function checkText(max: number, emptyMessage: string, longMessage: string) {
  return (_: unknown, value?: string): Promise<void> => {
    // Ignore spaces at the ends
    const text = (value ?? '').trim()
    // A blank value is required
    if (!text) {
      return Promise.reject(new Error(emptyMessage))
    }
    // Keep the same max length the server uses
    if (text.length > max) {
      return Promise.reject(new Error(longMessage))
    }
    return Promise.resolve()
  }
}

// Turn a server field error into a short sentence
function plainFieldMessage(field: string, serverMessage: string): string {
  // The server says the value is empty
  const tooSmall = serverMessage.includes('>=1')
  // The server says the value is too long
  const tooBig = serverMessage.includes('<=')
  // Use the same sentences as the form rules
  if (field === 'licensePlate' && tooSmall) return 'Please enter license plate'
  if (field === 'licensePlate' && tooBig) return 'License plate is too long'
  if (field === 'brand' && tooSmall) return 'Please enter brand'
  if (field === 'brand' && tooBig) return 'Brand is too long'
  if (field === 'model' && tooSmall) return 'Please enter model'
  if (field === 'model' && tooBig) return 'Model is too long'
  if (field === 'notes' && tooBig) return 'Notes are too long'
  return serverMessage
}

// Put a failed save on the plate field, the red box, or a toast
export function showCarSaveError(
  error: unknown,
  plate: string,
  form: FormInstance<CarInput>,
  notify: (text: string) => void,
  setAlert: (alert: CarFormAlert | null) => void,
) {
  // Read the status and the server message
  const problem = readCarProblem(error)
  // Clear the old red box
  setAlert(null)
  // A duplicate plate is shown on the field, the box, and a toast
  if (problem.status === 409) {
    form.setFields([{ name: 'licensePlate', errors: ['License plate already exists'] }])
    notify('License plate already exists')
    setAlert({
      message: 'License plate already exists',
      description: `A car with plate ${plate} is already registered. Please use a different license plate.`,
    })
    return
  }
  // Keep only errors for fields this form has
  const fields = problem.errors.filter(
    (item) =>
      item.field === 'licensePlate' ||
      item.field === 'brand' ||
      item.field === 'model' ||
      item.field === 'notes',
  )
  // Show each server field error under that input
  if (problem.status === 400 && fields.length > 0) {
    form.setFields(
      fields.map((item) => ({
        name: item.field as keyof CarInput,
        errors: [plainFieldMessage(item.field, item.message)],
      })),
    )
    return
  }
  // Anything else is one toast
  notify(problem.message)
}

// Draw the shared car fields and the save buttons
export default function CarForm({
  form,
  submitLabel,
  saving,
  alert,
  onSave,
  onCancel,
  onInvalid,
}: CarFormProps) {
  return (
    <Form
      form={form}
      layout="vertical"
      requiredMark
      colon={false}
      onFinish={onSave}
      // Clear the red box when a field on this page is wrong
      onFinishFailed={onInvalid}
    >
      {/* Show the duplicate-plate box when the save was rejected */}
      {alert ? (
        <Alert
          type="error"
          showIcon
          message={alert.message}
          description={alert.description}
          style={{ marginBottom: 24 }}
        />
      ) : null}
      {/* Ask for the license plate */}
      <Form.Item
        required
        label="License Plate"
        name="licensePlate"
        rules={[{ validator: checkPlate }]}
      >
        <Input placeholder="e.g. 1กข 1234" />
      </Form.Item>
      {/* Ask for the brand */}
      <Form.Item
        required
        label="Brand"
        name="brand"
        rules={[{ validator: checkText(50, 'Please enter brand', 'Brand is too long') }]}
      >
        <Input placeholder="e.g. Toyota" />
      </Form.Item>
      {/* Ask for the model */}
      <Form.Item
        required
        label="Model"
        name="model"
        rules={[{ validator: checkText(50, 'Please enter model', 'Model is too long') }]}
      >
        <Input placeholder="e.g. Yaris Ativ" />
      </Form.Item>
      {/* Ask for optional notes, up to 500 letters */}
      <Form.Item
        label={
          <span>
            Notes <span style={{ color: '#8C8C8C' }}>(optional)</span>
          </span>
        }
        name="notes"
      >
        <Input.TextArea placeholder="Optional notes about this car" maxLength={500} showCount rows={2} />
      </Form.Item>
      {/* Cancel goes back. Save sends the form */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 8 }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="primary" htmlType="submit" loading={saving}>
          {submitLabel}
        </Button>
      </div>
    </Form>
  )
}
