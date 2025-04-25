# Pokémon Battle Arena

A modern web application for browsing Pokémon, building teams, and simulating battles using the PokéAPI.

## Features

- Browse and search Pokémon with pagination
- View detailed Pokémon information
- Build and manage your Pokémon team (max 6)
- Simulate battles between Pokémon
- Save team and battle history

## Technologies Used

- React with TypeScript
- Chakra UI for modern, responsive design
- PokéAPI for Pokémon data
- json-server for local data persistence
- React Router for navigation

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. In a separate terminal, start the json-server:
   ```bash
   npm run server
   ```

The application will be available at `http://localhost:5173`

## How to Use

1. **Browse Pokémon**: View the list of Pokémon and use the search bar to find specific Pokémon
2. **View Details**: Click on a Pokémon to see its detailed information
3. **Build Team**: Add Pokémon to your team (maximum 6)
4. **Battle**: Select two Pokémon from your team and simulate a battle

## Battle System

The battle system compares three core stats:
- HP
- Attack
- Speed

The Pokémon that wins in 2 out of 3 stat comparisons is declared the winner.

## Contributing

Feel free to submit issues and enhancement requests! 