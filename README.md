# Calendar Canvas

A polished, interactive React calendar component that transforms a static wall calendar concept into a feature-rich, accessible web application with voice-powered note-taking, real-time database persistence, and cinematic 3D visual effects.

## Overview

Calendar Canvas is a modern web application built on React and TypeScript, designed to deliver an engaging user experience for calendar management. It combines skeuomorphic design principles with cutting-edge web technologies to create an intuitive and visually stunning calendar interface.

### Key Features

- **🗓️ Skeuomorphic Design** – Spiral binding, page curl animations, paper textures, and high-quality monthly imagery
- **📆 Date Range Selection** – Click or drag-to-select dates with visual feedback for start, end, and range states
- **🎤 Voice-to-Text Notes** – Hands-free note entry using the Web Speech Recognition API
- **💾 Real-Time Database** – PostgreSQL backend with live subscriptions via Supabase (no localStorage dependency)
- **🌌 3D Particle Effects** – GPU-accelerated particle backgrounds using React Three Fiber
- **⌨️ Full Keyboard Navigation** – Arrow keys, Enter to select, Escape to clear
- **📱 Responsive Layout** – Desktop side-panel design that adapts to mobile stacked layout
- **🎉 Holiday Markers** – Automatic holiday detection with emoji indicators and tooltips
- **📖 Quick Navigation** – Sidebar month picker for fast jumping to any month/year

## Technology Stack

- **Frontend Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + PostCSS
- **3D Graphics**: Three.js + React Three Fiber
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Database**: Supabase (PostgreSQL)
- **Testing**: Vitest + Playwright
- **Form Handling**: React Hook Form

## Project Structure

```
src/
├── components/
│   ├── calendar/          # Core calendar components
│   │   ├── WallCalendar.tsx
│   │   ├── CalendarGrid.tsx
│   │   ├── CalendarHero.tsx
│   │   ├── MiniYearNav.tsx
│   │   ├── NotesArea.tsx
│   │   ├── ParticleBackground.tsx
│   │   ├── PageCurl.tsx
│   │   └── SpiralBinding.tsx
│   ├── ui/                # Shared UI components (shadcn/ui)
│   └── NavLink.tsx
├── hooks/
│   ├── useCalendarNotes.ts
│   ├── useSpeechRecognition.ts
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── integrations/
│   └── supabase/          # Supabase client & types
├── lib/
│   ├── holidays.ts
│   ├── monthImages.ts
│   └── utils.ts
├── pages/
│   ├── Index.tsx
│   └── NotFound.tsx
├── test/
│   ├── example.test.ts
│   └── setup.ts
├── App.tsx
├── main.tsx
└── vite-env.d.ts
```

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, or bun package manager
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd calendar-canvas-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

   The application will be available at `https://ai-dairy-gamma.vercel.app/`

## Development

### Available Scripts

- **`npm run dev`** – Start the development server with hot module reloading
- **`npm run build`** – Build for production
- **`npm run build:dev`** – Build with development settings
- **`npm run preview`** – Preview the production build locally
- **`npm run lint`** – Run ESLint to check code quality
- **`npm run test`** – Run unit tests with Vitest
- **`npm run test:watch`** – Run tests in watch mode

### Database Setup

Migrations are located in `supabase/migrations/`. To set up the Supabase backend:

1. Initialize your Supabase project
2. Run migrations via the Supabase dashboard or CLI
3. Configure environment variables with your Supabase credentials

### Component Architecture

The application uses a component-based architecture with React hooks for state management:

- **WallCalendar** – Root state orchestrator managing month, year, and date ranges
- **CalendarGrid** – Renders date cells with range selection logic and drag handling
- **NotesArea** – Manages note CRUD operations and voice input integration
- **ParticleBackground** – GPU-accelerated 3D scene using Three.js
- **CalendarHero** – Displays monthly imagery with navigation controls
- **MiniYearNav** – Provides quick month/year selection

## Testing

### Unit Tests

Run unit tests with Vitest:
```bash
npm run test
```

Run tests in watch mode during development:
```bash
npm run test:watch
```

### E2E Tests

Playwright configurations are included for end-to-end testing:
```bash
npx playwright test
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Considerations

- **Lazy Loading**: ParticleBackground component is lazy-loaded to improve initial page load
- **3D Optimization**: Particle animations use GPU acceleration via Three.js
- **Responsive Images**: Month images are optimized for different screen sizes
- **Keyboard Navigation**: Supports efficient navigation without mouse interaction

## Accessibility

- Full keyboard support (arrow keys, Enter, Escape)
- Semantic HTML structure
- ARIA labels and descriptions on interactive elements
- Screen reader compatibility
- High contrast support

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Make your changes and commit: `git commit -am 'Add your feature'`
3. Push to the branch: `git push origin feature/your-feature-name`
4. Submit a pull request with detailed description of changes

### Code Standards

- Follow existing code style (Prettier formatting)
- Run ESLint before committing: `npm run lint`
- Write tests for new features
- Update documentation as needed

## Deployment

### Production Build

```bash
npm run build
```

The optimized build output will be in the `dist/` directory.

### Deployment Platforms

The application can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

## License

This project is provided as-is for educational and commercial use.

## Support

For issues, questions, or suggestions:
1. Check existing issues in the repository
2. Create a detailed issue report with reproduction steps
3. Include environment/browser information when relevant

---

**Built with modern web technologies for a seamless user experience.**
