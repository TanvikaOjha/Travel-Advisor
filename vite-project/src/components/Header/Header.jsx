import { useEffect, useRef } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { Group, Text, TextInput, Box } from '@mantine/core';
import { IconSearch, IconCompass } from '@tabler/icons-react';

const Header = ({ setCoordinates }) => {
  const inputRef = useRef(null); //To attach the Google Places Autocomplete to the input element
  const placesLibrary = useMapsLibrary('places'); // Loads the Google Maps Places library, which is required for the Autocomplete functionality

  useEffect(() => {
    if (!placesLibrary || !inputRef.current) return;

    const options = { fields: ['geometry', 'name', 'formatted_address'] }; //optimization
    const newAutocomplete = new placesLibrary.Autocomplete(inputRef.current, options);

    newAutocomplete.addListener('place_changed', () => {
      const place = newAutocomplete.getPlace();

      // Guard: place or geometry can be undefined for region-level results
      if (!place || !place.geometry?.location) return;

      setCoordinates({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    });

    return () => {
      // Prevents HMR crash and memory leaks on unmount / effect re-run
      if (window.google?.maps?.event) {
        window.google.maps.event.clearInstanceListeners(newAutocomplete);
      }
    };
  }, [placesLibrary]);

  return (
    <Group justify="space-between" h="100%" w="100%" px="md">
      <Group gap="xs">
        <IconCompass size={28} color="white" />
        <Text size="xl" fw={900} c="white">
          Travel Advisor
        </Text>
      </Group>

      <Group>
        <Text size="sm" fw={500} c="blue.1" visibleFrom="md">
          Explore new places
        </Text>

        <Box style={{ width: 250 }}>
          <TextInput
            ref={inputRef}
            disabled={!placesLibrary}
            placeholder={placesLibrary ? 'Search...' : 'Loading...'}
            leftSection={<IconSearch size={16} stroke={1.5} />}
            radius="xl"
            size="sm"
            styles={{
              input: {
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: 'white',
                border: 'none',
              },
            }}
          />
        </Box>
      </Group>
    </Group>
  );
};

export default Header;