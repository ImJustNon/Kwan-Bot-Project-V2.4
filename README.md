<div align="center">

<img src="./assets/182a4ba8-3faa-462c-ac59-6f6c5f2a8dc2.png" alt="Kwan Bot" width="200"/>

# Kwan Discord Bot v2.4

[![Discord.js](https://img.shields.io/badge/Discord.js-v14.19.2-blue.svg)](https://discord.js.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)

**A powerful, feature-rich Discord bot built with TypeScript, Discord.js v14, and modern web technologies.**

[Invite Bot](https://kwans2.xyz/invite) • [Support Server](https://kwans2.xyz/support) • [Report Bug](https://github.com/ImJustNon/Kwan-Bot-Project-V2.4/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Bot](#-running-the-bot)
- [Docker Deployment](#-docker-deployment)
- [API Endpoints](#-api-endpoints)
- [Available Commands](#-available-commands)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

Kwan Bot is a comprehensive Discord bot designed to enhance your server experience with music playback, auto-moderation, server statistics, and much more. Built with a modular architecture using TypeScript and Discord.js v14, it's easy to extend and customize.

### Key Highlights

- 🎵 **Advanced Music System** - High-quality music playback using Lavalink and MoonLink.js
- 🤖 **Auto-Moderation** - Auto-roles, voice channels, and greeting messages
- 📊 **Server Statistics** - Track and display server stats in real-time
- 🎨 **Customizable** - Flexible configuration system for each server
- 🚀 **High Performance** - Optimized with TypeScript and async/await patterns
- 🐳 **Docker Ready** - Easy deployment with Docker and Docker Compose
- 🔌 **REST API** - Built-in API for bot information and management

---

## ✨ Features

### 🎵 Music System
- Play music from YouTube, Spotify, and more
- Queue management with loop modes
- Music channel with persistent controls
- Skip, pause, resume, and volume control
- Now playing with progress bars

### 🛠️ Server Management
- **Auto Roles** - Automatically assign roles to new members
- **Auto Voice Channels** - Create temporary voice channels on demand
- **Command Management** - Enable/disable commands per channel
- **Greeting Messages** - Welcome new members with custom messages
- **Server Stats** - Real-time server statistics tracking

### ⚙️ Configuration
- Per-server command configuration
- Channel-specific command controls
- Custom prefix support
- Owner-only commands

### 📡 API Integration
- RESTful API for bot information
- Command listing endpoint
- User and client data endpoints

---

## 🛠️ Tech Stack

### Core Technologies
- **[Node.js](https://nodejs.org/)** (v20+) - JavaScript runtime
- **[TypeScript](https://www.typescriptlang.org/)** (v5.8.3) - Type-safe JavaScript
- **[Discord.js](https://discord.js.org/)** (v14.19.2) - Discord API wrapper

### Music & Audio
- **[MoonLink.js](https://www.npmjs.com/package/moonlink.js)** (v4.60.18) - Lavalink wrapper
- **[play-dl](https://www.npmjs.com/package/play-dl)** (v1.9.7) - Media source extractor
- **[@discordjs/voice](https://www.npmjs.com/package/@discordjs/voice)** (v0.18.0) - Voice connection handler

### API & Web
- **[Express](https://expressjs.com/)** (v5.1.0) - Web framework
- **[Elysia](https://elysiajs.com/)** (v1.3.1) - Fast web framework

### Database & Storage
- **[MongoDB](https://www.mongodb.com/)** - Database
- **[Mongoose](https://mongoosejs.com/)** (v8.14.2) - MongoDB ODM

### Development Tools
- **[Nodemon](https://nodemon.io/)** - Auto-restart during development
- **[tsx](https://www.npmjs.com/package/tsx)** - TypeScript executor
- **[Docker](https://www.docker.com/)** - Containerization

---

## 📁 Project Structure

```
Kwan's_2_4/
├── src/
│   ├── client.ts              # Bot client initialization
│   ├── index.ts               # Application entry point
│   ├── apis/                  # REST API implementation
│   │   ├── App.ts             # API server setup
│   │   ├── classes/           # API base classes
│   │   ├── controllers/       # API controllers
│   │   └── routes/            # API route definitions
│   ├── classes/               # Core classes
│   │   ├── Client.class.ts    # Extended Discord client
│   │   ├── Command.class.ts   # Command base class
│   │   ├── Event.class.ts     # Event base class
│   │   ├── Feature.class.ts   # Feature base class
│   │   ├── Logger.class.ts    # Logging utility
│   │   └── MoonLink.class.ts  # Music manager
│   ├── commands/              # Command implementations
│   │   ├── AutoRoles/         # Auto-role commands
│   │   ├── AutoVoiceChannel/  # Voice channel commands
│   │   ├── Config/            # Configuration commands
│   │   ├── Info/              # Information commands
│   │   ├── Music/             # Music commands
│   │   ├── MusicChannel/      # Music channel commands
│   │   └── ServerStats/       # Server stats commands
│   ├── config/                # Configuration files
│   │   ├── config.ts          # Main configuration
│   │   ├── api.config.ts      # API configuration
│   │   └── assets.config.ts   # Assets configuration
│   ├── database/              # Database connection
│   │   └── MongoDB.db.ts      # MongoDB setup
│   ├── events/                # Event handlers
│   │   ├── Client/            # Client events
│   │   └── Player/            # Music player events
│   ├── features/              # Feature modules
│   │   ├── AntiCrash/         # Error handling
│   │   ├── AutoRoles/         # Auto-role feature
│   │   ├── AutoVoiceChannel/  # Voice channel feature
│   │   ├── GreetingMessage/   # Welcome messages
│   │   ├── MusicChannel/      # Music channel feature
│   │   └── ServerStats/       # Statistics feature
│   ├── handlers/              # Event & command handlers
│   ├── loaders/               # Dynamic loaders
│   │   ├── Command.loader.ts  # Command loader
│   │   ├── Event.loader.ts    # Event loader
│   │   └── Feature.loader.ts  # Feature loader
│   ├── models/                # Database models
│   │   ├── GuildAutoRoles.model.ts
│   │   ├── GuildAutoVoiceChannel.model.ts
│   │   ├── GuildCommandChannel.model.ts
│   │   ├── GuildDisabledCommand.model.ts
│   │   ├── GuildMusicChannel.model.ts
│   │   └── GuildServerStats.model.ts
│   ├── types/                 # TypeScript type definitions
│   └── utils/                 # Utility functions
├── assets/                    # Static assets and images
├── lavalink/                  # Lavalink configuration
│   ├── application.yml        # Lavalink config
│   └── plugins/               # Lavalink plugins
├── docker-compose.yml         # Docker compose (development)
├── docker-compose.prod.yml    # Docker compose (production)
├── Dockerfile                 # Docker image (development)
├── Dockerfile.prod            # Docker image (production)
├── package.json               # Project dependencies
├── tsconfig.json              # TypeScript configuration
└── nodemon.json               # Nodemon configuration
```

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20 or higher) - [Download](https://nodejs.org/)
- **pnpm** (Package Manager) - [Installation Guide](https://pnpm.io/installation)
- **MongoDB** - [Installation Guide](https://www.mongodb.com/docs/manual/installation/)
- **Java** (v17+, for Lavalink) - [Download](https://adoptium.net/)
- **Git** - [Download](https://git-scm.com/)

### Optional
- **Docker & Docker Compose** - For containerized deployment

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/ImJustNon/Kwan-Bot-Project-V2.4.git
cd "Kwan's_2_4"
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
# Bot Configuration
BOT_TOKEN=your_discord_bot_token
BOT_CLIENT_ID=your_bot_client_id
BOT_CLIENT_SECRET=your_bot_client_secret

# Database
MONGODB_URI=mongodb://localhost:27017/kwan-bot

# API Configuration (Optional)
API_PORT=3000
API_HOST=localhost

# Lavalink Configuration
LAVALINK_HOST=localhost
LAVALINK_PORT=2333
LAVALINK_PASSWORD=youshallnotpass
```

### 4. Set Up Lavalink

Download Lavalink from the [official repository](https://github.com/lavalink-devs/Lavalink/releases) and place the JAR file in the `lavalink` directory.

Configure `lavalink/application.yml` according to your needs.

---

## ⚙️ Configuration

### Bot Configuration

Edit `src/config/config.ts` to customize:

- **Bot Presence** - Custom status messages
- **Owner IDs** - Bot owner user IDs
- **Lavalink Nodes** - Music server configuration
- **Invite & Support Links** - Your bot's links

### API Configuration

Edit `src/config/api.config.ts`:

```typescript
export const apiConfig: ApiConfig = {
    port: process.env.API_PORT || 3000,
    host: process.env.API_HOST || "localhost",
    // ... other settings
}
```

---

## 🏃 Running the Bot

### Development Mode

```bash
pnpm dev
```

This runs the bot with hot-reload enabled using Nodemon.

### Production Mode

```bash
# Build the project
pnpm build

# Start the bot
pnpm start
```

---

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

#### Development
```bash
docker-compose up -d
```

#### Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Manual Docker Build

```bash
# Build the image
docker build -t kwan-bot .

# Run the container
docker run -d --name kwan-bot --env-file .env kwan-bot
```

---

## 📡 API Endpoints

The bot includes a built-in REST API:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/bot/info` | GET | Get bot information |
| `/api/commands` | GET | List all commands |
| `/api/client/guilds` | GET | Get guild count |
| `/api/users/:id` | GET | Get user information |

**Base URL**: `http://localhost:3000` (configurable)

---

## 🎮 Available Commands

### 🎵 Music Commands
- `/play` - Play a song from URL or search query
- `/skip` - Skip the current song
- `/queue` - View the current queue
- `/nowplaying` - Show currently playing song
- `/loop` - Toggle loop mode
- `/disconnect` - Disconnect from voice channel

### ⚙️ Configuration Commands
- `/command-enable` - Enable a command
- `/command-disable` - Disable a command
- `/command-channel-enable` - Enable commands in a channel
- `/command-channel-disable` - Disable commands in a channel

### 🤖 Auto-Moderation Commands
- `/autoroles-add` - Add an auto-role
- `/autoroles-remove` - Remove an auto-role
- `/autoroles-list` - List all auto-roles
- `/autovoice-add` - Add auto-voice channel
- `/autovoice-remove` - Remove auto-voice channel

### ℹ️ Information Commands
- `/help` - Display help menu
- `/ping` - Check bot latency

*For a complete list of commands, use `/help` in Discord*

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Kwan-Bot-Project-V2.4.git
   ```
3. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
4. **Make your changes**
5. **Commit your changes**
   ```bash
   git commit -m "Add some amazing feature"
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style and structure
- Use TypeScript types and interfaces
- Test your changes thoroughly
- Update documentation as needed
- Follow the modular architecture pattern
- Add comments for complex logic

### Adding New Commands

1. Create a new file in `src/commands/[Category]/YourCommand.command.ts`
2. Extend the `Command` class
3. Implement the `run()` method
4. The command will be automatically loaded

### Adding New Features

1. Create a new directory in `src/features/YourFeature/`
2. Create a feature class extending `Feature`
3. Implement required event handlers
4. The feature will be automatically loaded

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Discord.js](https://discord.js.org/) - Discord API wrapper
- [Lavalink](https://github.com/lavalink-devs/Lavalink) - Audio delivery
- [MoonLink.js](https://www.npmjs.com/package/moonlink.js) - Lavalink wrapper
- All contributors and supporters

---

## 📞 Support

Need help? Here are some ways to get support:

- 💬 [Join our Discord Server](https://kwans2.xyz/support)
- 🐛 [Report a Bug](https://github.com/ImJustNon/Kwan-Bot-Project-V2.4/issues)
- 📧 Contact the developer

---

## 🗺️ Roadmap

- [ ] Slash command migration
- [ ] Web dashboard
- [ ] More music sources
- [ ] Advanced moderation features
- [ ] Custom bot themes
- [ ] Multi-language support

---

<div align="center">

**Made with ❤️ by [ImJustNon](https://github.com/ImJustNon)**

⭐ Star this repository if you find it helpful!

</div>
