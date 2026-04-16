# Claude Remote Control

A modern web interface for remotely controlling and interacting with Claude AI. This Next.js 15 application provides a user-friendly platform to communicate with the Anthropic Claude API.

## Prerequisites

- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher (comes with Node.js)
- **Anthropic API Key**: Required for Claude API access. Get yours at [console.anthropic.com](https://console.anthropic.com)

## Getting Started

### 1. Clone the Repository

```bash
git clone git+https://github.com/marekdkropiewnicki-dotcom/claude-remote-control.git
cd claude-remote-control
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

The application supports two modes for API key usage:

**Option A: Client-side API keys (Recommended for development)**
- Users provide their own API keys through the web interface
- No server-side configuration needed
- More secure for public deployments

**Option B: Server-side API key (Optional)**
If you want to use a server-side API key, create a `.env.local` file:

```bash
cp .env.example .env.local
```

Then edit `.env.local` and add your Anthropic API key:

```
ANTHROPIC_API_KEY=your-api-key-here
```

### 4. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Scripts

- **`npm run dev`** - Start the development server with hot reload
- **`npm run build`** - Build the application for production
- **`npm start`** - Start the production server (requires running `npm run build` first)
- **`npm run lint`** - Run ESLint to check code quality

## Project Structure

- **`app/`** - Next.js 15 App Router directory
  - **`api/chat/`** - API route for Claude chat interactions
  - **`page.tsx`** - Main application page
  - **`layout.tsx`** - Root layout component
- **`public/`** - Static assets
- **`package.json`** - Project dependencies and scripts

## Deployment

### Vercel (Recommended)

This project is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add your environment variables in Vercel project settings if using server-side API keys
4. Deploy with a single click

### Other Platforms

The application can be deployed to any Node.js-compatible hosting platform (AWS, Azure, DigitalOcean, etc.):

```bash
npm run build
npm start
```

## Configuration

### API Key Management

- **Client-side approach**: Users enter their Anthropic API key directly in the web interface (no backend storage)
- **Server-side approach**: Set `ANTHROPIC_API_KEY` environment variable for backend key management

See `.env.example` for configuration options.

## Technology Stack

- **Framework**: Next.js 15
- **Runtime**: Node.js
- **UI Library**: React 18
- **Language**: TypeScript
- **AI API**: Anthropic Claude API
- **Styling**: Built-in Next.js CSS support

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests to improve the project.

## License

MIT License - see LICENSE file for details

## Support

For issues, questions, or suggestions, please visit the [GitHub repository](https://github.com/marekdkropiewnicki-dotcom/claude-remote-control/issues)

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Anthropic Claude API Documentation](https://docs.anthropic.com)
- [React Documentation](https://react.dev)
