import { useState } from 'react';
import type { Flight } from './useOpenSkyFlights';

export type SortOrder = 'none' | 'ascending' | 'descending';

export function formatPosition(lat: number | null, lon: number | null): string {
  if (lat === null || lon === null) return 'Inconnue';
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'E' : 'O';
  return `${Math.abs(lat).toFixed(3)}° ${latDir}, ${Math.abs(lon).toFixed(3)}° ${lonDir}`;
}

function compareNullableNumbers(
  firstValue: number | null,
  secondValue: number | null,
  order: SortOrder,
): number {
  if (firstValue === null && secondValue === null) return 0;
  if (firstValue === null) return 1;
  if (secondValue === null) return -1;

  return order === 'ascending' ? firstValue - secondValue : secondValue - firstValue;
}

export function useFlightFilters(flights: Flight[]) {
  const [plaqueSearch, setPlaqueSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [positionSearch, setPositionSearch] = useState('');
  const [speedOrder, setSpeedOrder] = useState<SortOrder>('none');
  const [altitudeOrder, setAltitudeOrder] = useState<SortOrder>('none');

  const countries = Array.from(new Set(flights.map((flight) => flight.pays)))
    .filter((country) => country !== 'Inconnu')
    .sort((firstCountry, secondCountry) => firstCountry.localeCompare(secondCountry));

  const normalizedPlaqueSearch = plaqueSearch.trim().toLowerCase();
  const normalizedPositionSearch = positionSearch.trim().toLowerCase();

  const filteredFlights = flights
    .filter((flight) => {
      const formattedPosition = formatPosition(flight.latitude, flight.longitude).toLowerCase();
      const coordinates = `${flight.latitude ?? ''}, ${flight.longitude ?? ''}`.toLowerCase();

      return (
        (!countryFilter || flight.pays === countryFilter) &&
        (!normalizedPlaqueSearch || flight.plaque.toLowerCase().includes(normalizedPlaqueSearch)) &&
        (!normalizedPositionSearch ||
          formattedPosition.includes(normalizedPositionSearch) ||
          coordinates.includes(normalizedPositionSearch))
      );
    })
    .sort((firstFlight, secondFlight) => {
      if (speedOrder !== 'none') {
        const speedComparison = compareNullableNumbers(firstFlight.vitesse, secondFlight.vitesse, speedOrder);
        if (speedComparison !== 0) return speedComparison;
      }

      if (altitudeOrder !== 'none') {
        return compareNullableNumbers(firstFlight.altitude, secondFlight.altitude, altitudeOrder);
      }

      return firstFlight.pays.localeCompare(secondFlight.pays);
    });

  const resetFilters = () => {
    setPlaqueSearch('');
    setCountryFilter('');
    setPositionSearch('');
    setSpeedOrder('none');
    setAltitudeOrder('none');
  };

  return {
    plaqueSearch,
    setPlaqueSearch,
    countryFilter,
    setCountryFilter,
    positionSearch,
    setPositionSearch,
    speedOrder,
    setSpeedOrder,
    altitudeOrder,
    setAltitudeOrder,
    countries,
    filteredFlights,
    resetFilters,
  };
}
