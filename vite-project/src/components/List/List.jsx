import { useEffect, useRef, createRef } from 'react';
import { Title, Group, Select, Grid, Loader, Stack, Box, ScrollArea, Text } from '@mantine/core';
import PlaceDetails from '../PlaceDetails/PlaceDetails';

const List = ({ places, childClicked, isLoading, type, setType, rating, setRating }) => {
  const elRefs = useRef([]);

  // Sync the refs array length to the current places list.
  // Preserve existing refs so already-mounted nodes aren't discarded.
  useEffect(() => {
    elRefs.current = Array(places?.length ?? 0)//create an array of the same length as places, filled with nulls, then map over it to create refs or reuse existing ones
      .fill(null)
      .map((_, i) => elRefs.current[i] || createRef());
  }, [places]);

  // Scroll the clicked place card into view
  useEffect(() => {
    if (childClicked !== null && elRefs.current[childClicked]) {
      elRefs.current[childClicked].current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [childClicked]);

  return (
    <Box p="md" h="100%" style={{ display: 'flex', flexDirection: 'column' }}>
      <Title order={2} size="h4" mb="md" fw={700}>
        {type.charAt(0).toUpperCase() + type.slice(1)} Near You
      </Title>

      {isLoading ? (
        <Stack align="center" justify="center" h={400}>
          <Loader size="lg" variant="dots" color="blue" />
        </Stack>
      ) : (
        <>
          <Group grow mb="xl">
            <Select
              label="Type"
              value={type}
              onChange={setType}
              data={[
                { value: 'restaurants', label: 'Restaurants' },
                { value: 'hotels',      label: 'Hotels' },
                { value: 'attractions', label: 'Attractions' },
              ]}
            />

            <Select
              label="Rating"
              value={rating?.toString()}
              onChange={setRating}
              data={[
                { value: '0',   label: 'All' },
                { value: '3',   label: 'Above 3.0' },
                { value: '4',   label: 'Above 4.0' },
                { value: '4.5', label: 'Above 4.5' },
              ]}
            />
          </Group>

          <ScrollArea
            h="calc(100vh - 240px)"
            offsetScrollbars
            scrollbarSize={6}
            type="hover"
          >
            <Grid gutter="md">
              {places?.length > 0 ? (
                places.map((place, i) => (
                  <Grid.Col
                    span={12}
                    // Combine id + index: guards against duplicate location_ids
                    // from the Travel Advisor API returning the same place twice.
                    key={`${place.location_id ?? 'place'}-${i}`}
                  >
                    <div ref={elRefs.current[i]}>
                      <PlaceDetails
                        selected={Number(childClicked) === i}
                        place={place}
                      />
                    </div>
                  </Grid.Col>
                ))
              ) : (
                <Grid.Col span={12}>
                  <Stack align="center" mt="xl" w="100%">
                  
                    <Text c="dimmed" size="sm">
                      No results found in this area. Try moving the map!
                    </Text>
                  </Stack>
                </Grid.Col>
              )}
            </Grid>
          </ScrollArea>
        </>
      )}
    </Box>
  );
};

export default List;