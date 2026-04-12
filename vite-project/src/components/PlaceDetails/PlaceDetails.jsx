import { useRef } from 'react';
import { Card, Image, Text, Group, Badge, Button, Stack, Rating } from '@mantine/core';
import { IconMapPin, IconPhone, IconExternalLink } from '@tabler/icons-react';



const PlaceDetails = ({ place, selected }) => {
  const cardRef = useRef(null);

  if (!place || !place.name) return null;

  return (
    <Card
      ref={cardRef}
      shadow={selected ? 'lg' : 'sm'}
      padding="lg"
      radius="md"
      withBorder
      mb="md"
      style={{
        transition: 'transform 0.2s ease, border-color 0.2s ease',
        borderColor: selected ? 'var(--mantine-color-blue-filled)' : undefined,
        transform: selected ? 'scale(1.02)' : 'scale(1)',
      }}
    >
      <Card.Section style={{ position: 'relative' }}>
        <Image
          
          src={place.photo?.images?.large?.url ?? 'https://placehold.co/600x400?text=No+Image+Available'}
          height={180}
          alt={place.name}
          fallbackSrc="https://placehold.co/600x400?text=No+Image+Available"
        />

        {place.open_now_text && (
          <Badge variant="filled" color={place.open_now_text.toLowerCase().includes('open') ? 'green' : 'red'} style={{ position: 'absolute', top: 10, right: 10 }} size="sm" >
            {place.open_now_text}
          </Badge>
        )}
      </Card.Section>

      <Stack mt="md" gap="xs">
        <Text fw={700} size="lg" lineClamp={1}>{place.name}</Text>

        <Group justify="space-between" wrap="nowrap">
          <Group gap={4}>
            <Rating value={Number(place.rating)} readOnly fractions={2} size="sm" />
            <Text size="xs" fw={500}>({place.rating})</Text>
          </Group>
          <Text size="xs" c="dimmed">
            {place.num_reviews} review{Number(place.num_reviews) !== 1 ? 's' : ''}
          </Text>
        </Group>

        <Group justify="space-between">
          <Text size="xs" fw={600} c="dimmed">Ranking</Text>
          <Text size="xs" fw={500} ta="right" c="blue">{place.ranking || 'Unranked'}</Text>
        </Group>

        {/* Awards — guard award.images before accessing .small */}
        {place?.awards?.slice(0, 1).map((award, i) => (
          <Group key={i} gap="xs" wrap="nowrap" bg="blue.0" p={4} style={{ borderRadius: '4px' }}>
            {award.images?.small && (
              <Image src={award.images.small} w={14} h={14} />
            )}
            <Text size="xs" fw={500} c="blue.9" truncate>{award.display_name}</Text>
          </Group>
        ))}

        <Group gap={5}>
          {place.price_level && (
            <Badge variant="outline" color="gray" size="xs">{place.price_level}</Badge>
          )}
          {place?.cuisine?.slice(0, 3).map(({ name }) => (
            <Badge key={name} variant="light" color="blue" size="xs">{name}</Badge>
          ))}
        </Group>

        <Stack gap={4} mt="xs">
          {place?.address && (
            <Group gap="xs" wrap="nowrap" align="flex-start">
              <IconMapPin size={14} color="gray" style={{ marginTop: 2 }} />
              <Text size="xs" c="dimmed" lineClamp={2}>{place.address}</Text>
            </Group>
          )}
          {place?.phone && (
            <Group gap="xs">
              <IconPhone size={14} color="gray" />
              <Text size="xs" c="dimmed">{place.phone}</Text>
            </Group>
          )}
        </Stack>
      </Stack>

      <Group grow mt="md" gap="sm">
        {/* Disabled when web_url is missing — previously opened a tab
            to the literal URL "undefined" which looks broken to users. */}
        <Button
          variant="light"
          color="blue"
          size="xs"
          disabled={!place.web_url}
          onClick={() => place.web_url && window.open(place.web_url, '_blank')}
          leftSection={<IconExternalLink size={14} />}
        >
          TripAdvisor
        </Button>

        {place.website && (
          <Button
            variant="outline"
            color="gray"
            size="xs"
            onClick={() => window.open(place.website, '_blank')}
          >
            Website
          </Button>
        )}
      </Group>
    </Card>
  );
};

export default PlaceDetails;