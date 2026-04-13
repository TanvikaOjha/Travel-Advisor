import React from 'react';
import { Map, useMap, AdvancedMarker,  } from '@vis.gl/react-google-maps';
import { Paper, Text, Rating, Box, Image, Loader, Center } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconMapPin } from '@tabler/icons-react';

const PLACEHOLDER_IMG = 'universal-placeholder.png'; 

const getWeatherIcon = (code) => {
  if (code === 0) return '01d';
  if (code <= 3) return '02d';
  if (code >= 51 && code <= 67) return '10d';
  if (code >= 71 && code <= 77) return '13d';
  if (code >= 95) return '11d';
  return '03d';
};

const MapComponent = ({setCoordinates,setBounds,coordinates,places,setChildClicked,weatherData,onCameraChanged
}) => {
  const isDesktop = useMediaQuery('(min-width: 600px)');
  const map = useMap();
  

  return (
    <Box h="100vh" w="100%">
    
        <Map
          mapId={import.meta.env.VITE_GOOGLE_MAP_ID}
          defaultCenter={coordinates || { lat: 0, lng: 0 }}
          center={coordinates}
          defaultZoom={14}
          disableDefaultUI={true}
          onIdle={()=>{
            if(map){
              const Rawbounds = map.getBounds();
              const ne = Rawbounds.getNorthEast();
              const sw = Rawbounds.getSouthWest();
              setBounds({
                ne: {lat: ne.lat(), lng: ne.lng()},
                sw: {lat: sw.lat(), lng: sw.lng()}
              })
            }
          }}
onCameraChanged={(ev) => {
  const { center, bounds } = ev.detail;

  setCoordinates(center);

  setBounds({
    ne: bounds.ne, 
    sw: bounds.sw,
  });

  console.log("Bounds updated:", bounds.ne, bounds.sw);

}}>
          
{places?.filter((p) => p.latitude && p.longitude).map((place, i) => (
<AdvancedMarker
  key={`place-${i}`} position={{ lat: Number(place.latitude), lng: Number(place.longitude) }} onClick={() => setChildClicked(i)}
>
  {/* Add a wrapper div with a stable display property */}
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    {!isDesktop ? (
      <IconMapPin size={30} color="blue" fill="white" />
    ) : (
      <Paper shadow="md" p={5} withBorder style={{ width: 100, cursor: 'pointer' }}>
        <Text size="xs" fw={700} truncate="end">{place.name}</Text>
        <Image src={place.photo?.images?.large?.url ?? PLACEHOLDER_IMG} h={60} w="100%" fit="cover" fallbackSrc={PLACEHOLDER_IMG}/>
        <Rating value={Number(place.rating)} readOnly size="xs" mt={2} />
      </Paper>
    )}
  </div>
</AdvancedMarker>
          ))}

 {/* Weather Marker */}
  {weatherData?.latitude && weatherData?.current?.weather_code != null && (
  <AdvancedMarker zIndex={1000}
      position={{
         lat: weatherData.latitude,
         lng: weatherData.longitude,
               }}>
  <img
  style={{ filter: 'drop-shadow(0px 0px 4px rgba(0,0,0,0.5))' }} // Makes it pop
  height={50}
  width={50}
  src={`https://openweathermap.org/img/wn/${getWeatherIcon(weatherData.current.weather_code)}@2x.png`}
  alt="Weather Icon"
  onError={(e) => { e.target.src = 'https://openweathermap.org/img/wn/01d@2x.png' }} // Fallback to sun
/>
  </AdvancedMarker>)}
</Map>
</Box>);};

export default MapComponent;