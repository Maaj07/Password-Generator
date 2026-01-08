# Secure Password Generator

A modern, secure, and visually appealing password generator built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**.

## Features

- **Advanced Password Generation**: Generate strong, secure passwords with customizable length and character sets (Uppercase, Lowercase, Numbers, Symbols).
- **Manual Input Synchronization**: Type your own password and see it instantly analyzed.
- **Real-time Hashing**: View the hash of your password in multiple formats:
  - **SHA-256**
  - **MD5**
  - **Base64**
- **Strength Analysis**: Real-time password strength meter utilizing entropy calculations.
- **Modern UI/UX**:
  - Glassmorphism design with dynamic background effects.
  - Smooth animations using **Framer Motion**.
  - Dark mode aesthetic.
  - One-click copy with toast notifications (**Sonner**).
- **Privacy Focused**: All logic runs client-side. No passwords are ever sent to a server.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **UI Components**: Built with Radix UI primitives.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `src/app/page.tsx`: Main application logic and UI.
- `src/lib/password-utils.ts`: Password generation and strength calculation logic.
- `src/lib/md5.ts`: MD5 hashing implementation.
- `src/components/ui`: Reusable UI components.

## License

This project is open source and available under the [MIT License](LICENSE).
