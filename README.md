# Claude Remote Control

A modern web interface for remotely controlling and interacting with Claude AI. Built with Next.js, TypeScript, and the Anthropic API.

## Features

- 🤖 **Direct Claude Integration**: Chat with Claude AI directly from your browser
- 🔐 **Secure API Key Storage**: Your API key is stored locally in your browser and never sent to our servers
- 💬 **Real-time Chat Interface**: Clean, modern chat UI with message history
- 🎨 **Beautiful Design**: Responsive design that works on desktop and mobile devices
- ⚡ **Fast Performance**: Built with Next.js for optimal performance
- 🚀 **Vercel Ready**: Optimized for deployment on Vercel

## Getting Started

### Prerequisites

- Node.js 18.x or later
- An Anthropic API key (get one at [console.anthropic.com](https://console.anthropic.com))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/marekdkropiewnicki-dotcom/claude-remote-control.git
cd claude-remote-control
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

5. Enter your Anthropic API key when prompted

## Usage

1. **Configure API Key**: On first visit, you'll be prompted to enter your Anthropic API key
2. **Start Chatting**: Once configured, start typing messages to chat with Claude
3. **Clear Chat**: Use the "Clear Chat" button to start a new conversation
4. **Change API Key**: Use the "Change API Key" button to update your credentials

## Deployment

### Deploy to Vercel

The easiest way to deploy this application is using [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/marekdkropiewnicki-dotcom/claude-remote-control)

1. Click the button above or visit [vercel.com/new](https://vercel.com/new)
2. Import this repository
3. Deploy (no environment variables needed as users provide their own API keys)

### Manual Deployment

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## Security

- API keys are stored only in the browser's localStorage
- No server-side storage of credentials
- Direct API communication with Anthropic
- All API calls are made from secure server-side Next.js API routes

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: CSS Modules
- **API**: Anthropic Claude API
- **SDK**: @anthropic-ai/sdk

## Project Structure

```
claude-remote-control/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts       # API endpoint for Claude communication
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Main chat interface
│   └── page.module.css        # Page-specific styles
├── public/                     # Static assets
├── .env.example               # Environment variables template
├── next.config.js             # Next.js configuration
├── package.json               # Dependencies and scripts
└── tsconfig.json              # TypeScript configuration
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables

While the application works without any environment variables (users provide API keys through the UI), you can optionally configure:

- `ANTHROPIC_API_KEY` - Server-side API key (not recommended for multi-user deployments)

See `.env.example` for more details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

For issues and questions, please open an issue on [GitHub](https://github.com/marekdkropiewnicki-dotcom/claude-remote-control/issues).

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Anthropic Claude](https://www.anthropic.com/)
- Deployed on [Vercel](https://vercel.com/)
