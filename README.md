```
▬▬▬▬▬▬▬▬▬▬  ██████  ██  ██████ ███████    ██████ ██      ██ 
▬▬▬▬▬▬▬▬▬▬  ██   ██ ██ ██      ██         ██     ██      ██ 
▬▬▬▬▬▬▬▬▬▬  ██████  ██ ██      █████      ██     ██      ██ 
▬▬▬▬▬▬▬▬▬▬  ██   ██ ██ ██      ██         ██     ██      ██ 
▬▬▬▬▬▬▬▬▬▬  ██████  ██  ██████ ███████    ██████ ███████ ██ 
```
[![npm version](https://img.shields.io/npm/v/bice-cli.svg)](https://www.npmjs.com/package/bice-cli)
[![SafeSkill 95/100](https://img.shields.io/badge/SafeSkill-95%2F100_Verified%20Safe-brightgreen)](https://safeskill.dev/scan/felipetodev-bice-cli)

An unofficial **BICE CLI** tool to manage your BICE accounts via terminal commands, REST API and more.

## Installation

```bash
# From npm (requires Bun)
bun add -g bice-cli

# Or clone and install locally
git clone https://github.com/felipetodev/bice-cli.git
cd bice-cli
bun install (or your package manager)
npx bice
```

## Setup

```bash
bice login <RUT> <Password> # Example: bice login 123456789 mypassword
```

Or set environment variables:
```bash
export BICE_RUT=123456789
export BICE_PASSWORD=mypassword
```

## CLI Usage

```bash
# Banking
bice login                           # Log in with bank credentials
bice user                            # Show user info
bice products                        # List all products
bice balance                         # Quick balance check
bice transactions [page] [limit]     # View period transactions (default: page=1, limit=40)
bice monthly-summary [periods]       # View monthly summary (default: 4 past months)

# Session
bice whoami                          # Show session info and accounts
bice logout                          # Disconnect and clear session
````

## REST API

```bash
bice server                          # Start REST API server (port 3002)
```

| Method | Endpoint                           | Description                     
|--------|------------------------------------|----------------------------------------------|
| GET    | /api/user                          | Get user info                                |
| GET    | /api/whoami                        | Get session info and accounts                |
| GET    | /api/products                      | Get all products                             |
| GET    | /api/transactions                  | Get transactions                             |
| GET    | /api/transactions?page=&limit=     | Get transactions with pagination             |
| GET    | /api/balance                       | Get balance for all products                 |
| GET    | /api/monthly-summary?periods=      | Get monthly summary (default: 4 past months) |

## Tech Stack

- [Bun](https://bun.sh) — Runtime
- [TypeScript](https://www.typescriptlang.org/) — Type safety
- [Zod](https://zod.dev/) — Schema validation
- [Hono](https://hono.dev/) — REST API framework
- [Playwright](https://playwright.dev/) — Browser automation for BICE login

## Security Considerations

> **This tool is intended for local and personal use only.**
> It runs on your machine and communicates directly with BICE services, but handling real banking credentials always involves risk.

- Keep your credentials out of shell history whenever possible (use environment variables or secure prompts instead of plain command arguments).
- Do not commit `.env` files, tokens, or session artifacts to Git. Add local secret files to `.gitignore`.
- Use this CLI only on trusted devices with disk encryption and an up-to-date OS.
- If you run `bice server`, bind it to localhost and avoid exposing it publicly unless you add your own auth and network controls.
- Rotate your password and log out (`bice logout`) if you suspect your machine, terminal session, or logs were exposed.
- Review this code before using it with production credentials; this is an unofficial project and is not affiliated with Banco BICE.

## Credentials

This CLI persists authentication material locally so you can reuse your session between commands. That data is stored in plain JSON files inside the tool directory (for example, `.bice-config.json` and `.bice-checking-account.json`) and is not encrypted by default.

- Restrict local file access with `chmod 600 .bice-config.json .bice-checking-account.json`.
- Run `bice logout` when you finish to remove the active session file.
- Treat these files as sensitive: never commit, upload, or share them.
- Avoid running this tool on shared machines, remote shells, or environments with automatic folder sync unless you trust that setup.
- Assume session cookies/tokens and account metadata can be present in local config, and protect your workstation accordingly.
