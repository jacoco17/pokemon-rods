# Pokemon Game

A React-based Pokemon game that allows you to browse Pokemon, build a team, and simulate battles.

## Features

- Browse and search Pokemon
- View detailed Pokemon information
- Build your own team (max 6 Pokemon)
- Simulate battles between Pokemon
- Save your team and battle history

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. In a separate terminal, start the json-server:
```bash
npm run server
```

The application will be available at `http://localhost:3000`

## Technologies Used

- React
- TypeScript
- Vite
- Styled Components
- Axios
- json-server
- PokeAPI

## Project Structure

- `src/components/` - React components
  - `PokemonList.tsx` - Pokemon browsing and search
  - `PokemonDetail.tsx` - Detailed Pokemon information
  - `TeamBuilder.tsx` - Team management
  - `Battle.tsx` - Battle simulation
  - `Navigation.tsx` - Navigation menu
- `db.json` - json-server database
- `src/App.tsx` - Main application component
- `src/main.tsx` - Application entry point

## Battle System

The battle system compares three core stats between Pokemon:
1. HP
2. Attack
3. Speed

Each stat comparison counts as a "round". The Pokemon that wins 2 out of 3 rounds wins the battle. 