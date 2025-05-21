# Nepali Patra (नेपाली पात्रो)

A modern, Progressive Web App (PWA) implementation of the Nepali Calendar. This application provides a user-friendly interface for viewing and navigating the Nepali calendar system, complete with festivals and important dates.

## Features

- 🗓 Full Nepali Calendar functionality
- 📱 PWA support for offline access
- 🌐 Bilingual support (English/Nepali)
- 📅 Festival and holiday listings
- 🎨 Modern, responsive UI
- 🌙 Dark/Light mode support
- 📲 iOS/Android home screen installation
- 🔄 Auto-updates when online

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (v9 or higher)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/nepali-calendar-cursor.git
cd nepali-calendar-cursor
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. For production build:

```bash
npm run build
```

5. To preview production build:

```bash
npm run preview
```

## Project Structure

```
nepali-calendar-cursor/
├── public/              # Static assets
├── src/
│   ├── components/     # React components
│   ├── utils/         # Utility functions
│   ├── assets/        # Images and other assets
│   ├── locales/       # Translation files
│   └── App.tsx        # Main application component
├── index.html
└── vite.config.ts     # Vite configuration
```

## PWA Support

This application is built as a Progressive Web App, which means:

- It can be installed on mobile devices and desktops
- Works offline
- Receives automatic updates
- Has native app-like features

### Installing on iOS

1. Open Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. Confirm the installation

### Installing on Android

1. Open Chrome
2. Tap the "Install" prompt or menu button
3. Select "Install App"
4. Follow the installation prompts

## Development

### Key Technologies

- React 18
- TypeScript
- Material-UI
- Vite
- Workbox (for PWA)
- i18next (for translations)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to all contributors who have helped shape this project
- Special thanks to the Nepali developer community for their support
- Built with [Cursor](https://cursor.sh/)
