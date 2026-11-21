import { CarOutlined } from '@ant-design/icons'
import { App as AntdApp, Layout } from 'antd'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CarCreatePage from './pages/CarCreatePage'
import CarEditPage from './pages/CarEditPage'
import CarListPage from './pages/CarListPage'

const { Header, Content } = Layout

// Show the shared header and the three car routes
export default function App() {
  return (
    <BrowserRouter>
      {/* Give pages a place to show success and error messages */}
      <AntdApp>
        {/* Paint the page gray and stack the header over the content */}
        <Layout style={{ minHeight: '100vh', background: '#F5F5F5' }}>
          {/* Place the logo and the title on the dark bar */}
          <Header
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              height: 64,
              padding: '0 48px',
              paddingInline: 48,
              background: '#001529',
              lineHeight: '64px',
            }}
          >
            {/* Draw the blue logo box */}
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                background: '#1677FF',
                borderRadius: 6,
                flex: 'none',
              }}
            >
              {/* Draw the white car inside the box */}
              <CarOutlined style={{ fontSize: 20, color: '#fff' }} />
            </span>
            {/* Write the app name in white */}
            <span
              style={{
                color: '#fff',
                fontWeight: 600,
                fontSize: 18,
                lineHeight: '28px',
              }}
            >
              HAUPCAR Car Management
            </span>
          </Header>
          {/* Leave the page padding the three screens share */}
          <Content style={{ padding: '24px 48px 48px' }}>
            <Routes>
              <Route path="/" element={<CarListPage />} />
              <Route path="/cars/new" element={<CarCreatePage />} />
              <Route path="/cars/:id/edit" element={<CarEditPage />} />
            </Routes>
          </Content>
        </Layout>
      </AntdApp>
    </BrowserRouter>
  )
}
