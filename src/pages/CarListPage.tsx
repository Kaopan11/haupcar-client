import { PlusOutlined } from '@ant-design/icons'
import { App, Button, Card, Empty, Popconfirm, Table } from 'antd'
import type { TableColumnsType } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteCar, listCars, readCarProblem } from '../api/cars'
import { formatUpdatedAt, type Car } from '../types/car'

// Show the company cars and let the user open, add, or delete one
export default function CarListPage() {
  // Read the message box from the app shell
  const { message } = App.useApp()
  // Move to the add and edit pages
  const navigate = useNavigate()
  // Keep the rows and the loading flag
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [loadFailed, setLoadFailed] = useState(false)

  // Load the cars from the API
  const loadCars = useCallback(async () => {
    // Show the table spinner
    setLoading(true)
    try {
      // Ask the API for every car
      const rows = await listCars()
      // Put the rows in the table
      setCars(rows)
      // The list loaded, so this is not an error
      setLoadFailed(false)
    } catch {
      // Tell the user the list failed
      setLoadFailed(true)
      message.error('Could not load cars')
    } finally {
      // Hide the table spinner
      setLoading(false)
    }
  }, [message])

  // Delete one car, then load the list again
  async function removeCar(id: number) {
    try {
      // Ask the API to remove this car
      await deleteCar(id)
      // Tell the user it worked
      message.success('Car deleted')
      // Load the list again
      await loadCars()
    } catch (error) {
      // A missing car is already gone, so load the list again
      const problem = readCarProblem(error)
      if (problem.status === 404) {
        message.error('Car not found')
        await loadCars()
        return
      }
      // Tell the user the delete failed
      message.error('Could not delete this car')
    }
  }

  // Load the cars when the page opens
  useEffect(() => {
    void loadCars()
  }, [loadCars])

  // Describe each table column
  const columns: TableColumnsType<Car> = [
    {
      title: 'License Plate',
      dataIndex: 'licensePlate',
      width: 180,
    },
    {
      title: 'Brand',
      dataIndex: 'brand',
      width: 160,
    },
    {
      title: 'Model',
      dataIndex: 'model',
      width: 180,
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      // Show a dash when the car has no notes
      render: (notes: string | null) => notes || '-',
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      width: 190,
      // Show the time in gray
      render: (updatedAt: string) => (
        <span style={{ color: '#595959' }}>{formatUpdatedAt(updatedAt)}</span>
      ),
    },
    {
      title: 'Actions',
      width: 150,
      // Show Edit and Delete for this row
      render: (_, car) => (
        <div style={{ display: 'flex', gap: 16 }}>
          <Button
            type="link"
            style={{ height: 'auto', padding: 0 }}
            onClick={() => navigate(`/cars/${car.id}/edit`)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete this car?"
            description="This action cannot be undone."
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
            onConfirm={() => removeCar(car.id)}
          >
            <Button type="link" danger style={{ height: 'auto', padding: 0 }}>
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ]

  return (
    <Card
      title="Company Cars"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/cars/new')}>
          Add Car
        </Button>
      }
      style={{ borderColor: '#F0F0F0' }}
    >
      {/* Show the cars, or a spinner, or the empty state */}
      <Table
        rowKey="id"
        columns={columns}
        dataSource={cars}
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 50],
          showTotal: (total) => `Total ${total} cars`,
        }}
        locale={{
          emptyText: loading ? (
            <span />
          ) : loadFailed ? (
            <Empty description="Could not load cars" />
          ) : (
            <Empty description="No cars yet">
              <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/cars/new')}>
                Add Car
              </Button>
            </Empty>
          ),
        }}
      />
    </Card>
  )
}
