import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import App from '../App';
import StatusMessage from '../components/StatusMessage';

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