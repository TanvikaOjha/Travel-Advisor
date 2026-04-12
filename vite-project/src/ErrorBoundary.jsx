import { Component } from 'react';
import { Center, Stack, Text, Button, Alert } from '@mantine/core';
import { IconAlertCircle, IconRefresh } from '@tabler/icons-react';


 
export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    
    console.error('[ErrorBoundary] Caught error:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    
    if (this.props.fallback) return this.props.fallback;

    
    if (this.props.inline) {
      return (
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Something went wrong"
          color="red"
          variant="light"
          m="md"
        >
          <Stack gap="xs">
            <Text size="sm">This section failed to load.</Text>
            <Button
              size="xs"
              variant="light"
              color="red"
              leftSection={<IconRefresh size={14} />}
              onClick={this.handleReset}
            >
              Try again
            </Button>
          </Stack>
        </Alert>
      );
    }


    return (
      <Center h="100vh">
        <Stack align="center" gap="md" maw={400} px="xl">
          <IconAlertCircle size={48} color="var(--mantine-color-red-6)" />
          <Text fw={500} size="lg" ta="center">Something went wrong</Text>
          <Text size="sm" c="dimmed" ta="center">
            The app encountered an unexpected error. Try refreshing the page.
          </Text>
          <Button
            leftSection={<IconRefresh size={16} />}
            onClick={() => window.location.reload()}
          >
            Reload page
          </Button>
        </Stack>
      </Center>
    );
  }
}