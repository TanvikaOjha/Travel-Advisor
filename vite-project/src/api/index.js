import axios from 'axios';

export const getPlacesData = async (type, sw, ne) => {
  if (!sw || !ne) return [];

  const apiKey = import.meta.env.VITE_RAPIDAPI_TRAVEL_API_KEY;

  try {
    const response = await axios.get(
      `https://travel-advisor.p.rapidapi.com/${type}/list-in-boundary`,
      {
        params: {
          bl_latitude: sw.lat,
          tr_latitude: ne.lat,
          bl_longitude: sw.lng,
          tr_longitude: ne.lng,
        },
        headers: {
          'x-rapidapi-key': apiKey,
          'x-rapidapi-host': 'travel-advisor.p.rapidapi.com',
        },
      }
    );
    
    const rawData = response.data?.data;
    return rawData?.filter((place) => place.name) ?? [];
    
  } catch (error) {
    console.error('RapidAPI Fetch Failure:', error);
    return [];
  }
};

export const getWeatherData = async (lat, lng) => {
  try {
    const { data } = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude: lat,
        longitude: lng,
        current: 'temperature_2m,weather_code',
        timezone: 'auto',
      },
    });
    return data;
  } catch (error) {
    return null;
  }
};