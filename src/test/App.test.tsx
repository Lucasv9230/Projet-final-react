import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import App from '../App';
import StatusMessage from '../components/StatusMessage';
import { AppProvider } from '../context/AppContext';
import FlyRadar from '../pages/FlyRadar';

vi.mock('../hooks/useOpenSkyFlights', () => ({
  useOpenSkyFlights: () => ({
    flights: [],
    loading: false,
    error: null,
  }),
}));

describe('Accueil', () => {
  it('affiche le lien vers le radar', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: /ouvrir le radar/i })).toHaveAttribute('href', '/flyradar');
  });
});

describe('StatusMessage', () => {
  it('affiche la variante erreur lorsqu’elle est demandée', () => {
    render(<StatusMessage variant="error">Connexion impossible</StatusMessage>);

    expect(screen.getByText('Connexion impossible')).toHaveClass('error');
  });

  it('affiche la variante informative par défaut', () => {
    render(<StatusMessage>Chargement</StatusMessage>);

    expect(screen.getByText('Chargement')).not.toHaveClass('error');
  });
});

describe('Filtres du radar', () => {
  it('bloque la soumission et affiche une erreur pour une plaque invalide', () => {
    render(
      <MemoryRouter>
        <AppProvider>
          <FlyRadar />
        </AppProvider>
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByRole('searchbox', { name: /plaque/i }), {
      target: { value: 'AFR@123' },
    });

    expect(screen.getByRole('alert')).toHaveTextContent(/lettres, chiffres/i);
    expect(screen.getByRole('button', { name: /appliquer les filtres/i })).toBeDisabled();
  });
});