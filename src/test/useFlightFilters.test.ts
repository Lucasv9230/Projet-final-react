import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useFlightFilters } from '../hooks/useFlightFilters';
import type { Flight } from '../hooks/useOpenSkyFlights';

const flights: Flight[] = [
  { plaque: 'AFR123', pays: 'France', latitude: 48.8, longitude: 2.3, vitesse: 700, altitude: 10000 },
  { plaque: 'BAW456', pays: 'United Kingdom', latitude: 51.5, longitude: -0.1, vitesse: 500, altitude: 8000 },
];

describe('useFlightFilters', () => {
  it('filtre les vols par pays', async () => {
    const { result } = renderHook(() => useFlightFilters(flights));

    result.current.setCountryFilter('France');

    await waitFor(() => {
      expect(result.current.filteredFlights).toHaveLength(1);
    });
    expect(result.current.filteredFlights[0].plaque).toBe('AFR123');
  });
});