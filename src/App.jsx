import { useState, useEffect } from 'react';
import {
  AppShell, Burger, Group, Text, Center, ScrollArea,
  TextInput, ActionIcon, Stack, Badge, Box, Notification, Loader
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSend, IconCloud, IconNavigation, IconAlertCircle } from '@tabler/icons-react';
import { useApiIsLoaded, useMap } from '@vis.gl/react-google-maps';
import { getPlacesData, getWeatherData } from './api';
import Map from './components/Map/Map';
import List from './components/List/List';
import Header from './components/Header/Header';
import ErrorBoundary from './ErrorBoundary';

export default function App() {
  const apiIsLoaded = useApiIsLoaded();
  const [opened, { toggle }] = useDisclosure();

  // State management
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
  const [bounds, setBounds] = useState(null);
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [childClicked, setChildClicked] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState('0');
  const [type, setType] = useState('restaurants');
  const [weatherData, setWeatherData] = useState(null);
  const [mapRef, setMapRef] = useState(null);
  // Error states
  const [locationError, setLocationError] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  // 1. Initial Geolocation
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setCoordinates({ lat: latitude, lng: longitude });
        setLocationError(null);
      },
      () => {
        setLocationError('Location access denied. Showing default area.');
      }
    );
  }, []);

  
  useEffect(() => {
    const filtered = places.filter((place) => Number(place.rating) >= Number(rating));
    setFilteredPlaces(filtered);
  }, [rating, places]);


  useEffect(() => {
    if (!bounds?.sw || !bounds?.ne) {console.log("Effect triggered. Bounds status: false (Missing Data)"); return;}
     console.log("Effect triggered. Bounds status: true. FETCHING...");
    let cancelled = false;
    setIsLoading(true);
    



    
    getWeatherData(coordinates.lat, coordinates.lng)
      .then((data) => {
        console.log("Weather Data Received:", data);
        if (!cancelled) setWeatherData(data);
      });

    // Places Fetch
    getPlacesData(type, bounds.sw, bounds.ne)
      .then((data) => {
        if (!cancelled) {
          setPlaces(data);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        if (cancelled) return;
        setIsLoading(false);
        if (error.message === 'RATE_LIMITED') {
          setFetchError('Too many requests — please wait a moment.');
        } else if (error.message === 'AUTH_ERROR') {
          setFetchError('API key error. Check your .env file.');
        } else {
          setFetchError('Could not load places.');
        }
      });

    return () => { cancelled = true; };
  }, [type, bounds]);

  if (!apiIsLoaded) {
    return (
      <Center h="100vh">
        <Stack align="center">
          <Loader size="xl" color="blue" />
          <Text size="sm" c="dimmed">Loading Google Maps...</Text>
        </Stack>
      </Center>
    );
  }

  return (
    <AppShell
      header={{ height: locationError ? 100 : 70 }}
      navbar={{ width: 400, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="0"
    >
      <AppShell.Header bg="blue.7" c="white" px="md">
        <Stack gap={0} h="100%" justify="center">
          {locationError && (
            <Notification icon={<IconAlertCircle size={16} />} color="yellow" withCloseButton={false} py={4} mb={4}>
              <Text size="xs" c="yellow.9">{locationError}</Text>
            </Notification>
          )}

          <Group h={70} justify="space-between" wrap="nowrap">
            <Group wrap="nowrap">
              <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" color="white" />
              <Header setCoordinates={setCoordinates} />
            </Group>

            <Group visibleFrom="xs" wrap="nowrap">
              <Badge leftSection={<IconCloud size={14} />} variant="light" color="blue">
                {weatherData?.current?.temperature_2m != null
                  ? `${Math.round(weatherData.current.temperature_2m)}°C`
                  : 'Weather...'}
              </Badge>
            </Group>
          </Group>
        </Stack>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppShell.Section grow component={ScrollArea} scrollbars="y">
          {fetchError && (
            <Notification icon={<IconAlertCircle size={16} />} color="red" withCloseButton onClose={() => setFetchError(null)} mb="sm">
              <Text size="xs">{fetchError}</Text>
            </Notification>
          )}

          <List
            places={filteredPlaces.length > 0 ? filteredPlaces : places}
            childClicked={childClicked}
            isLoading={isLoading}
            type={type}
            setType={setType}
            rating={rating}
            setRating={setRating}
          />
        </AppShell.Section>

        
      </AppShell.Navbar>

      <AppShell.Main h="100vh">
        <ErrorBoundary inline>
          <Map
            setCoordinates={setCoordinates}
            setBounds={setBounds}
            coordinates={coordinates}
            places={filteredPlaces.length > 0 ? filteredPlaces : places}
            setChildClicked={setChildClicked}
            weatherData={weatherData}
            
           onCameraChanged={(ev) => {
  const { center, bounds } = ev.detail;
  
  
  setCoordinates(center);

  // 2. Format the bounds for your API
  const formattedBounds = {
    ne: { lat: bounds.north, lng: bounds.east },
    sw: { lat: bounds.south, lng: bounds.west }
  };

  
  setBounds(formattedBounds); 


}}

          />
        </ErrorBoundary>
      </AppShell.Main>
    </AppShell>
  );
}