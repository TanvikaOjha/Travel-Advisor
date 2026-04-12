import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider } from '@mantine/core'
import { APIProvider} from '@vis.gl/react-google-maps';
import '@mantine/core/styles.css';
import App from './App.jsx'


const libraries = ['places', 'marker']; 

createRoot(document.getElementById('root')).render(
  
    <APIProvider 
      apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} 
      libraries={libraries}
    >
      <MantineProvider defaultColorScheme="light">
        <App />
      </MantineProvider>
    </APIProvider>
  
)