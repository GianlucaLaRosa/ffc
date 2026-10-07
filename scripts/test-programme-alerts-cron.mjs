#!/usr/bin/env node
/**
 * Smoke test for GET /api/programme-alerts (same auth cron-job.org should use).
 *
 * Usage:
 *   pnpm cron:test
 *   CRON_SECRET=... NEXT_PUBLIC_SERVER_URL=https://example.vercel.app pnpm cron:test
 */

import 'dotenv/config'

const baseUrl = (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3101').replace(/\/$/, '')
const secret = process.env.CRON_SECRET

if (!secret) {
  console.error('Missing CRON_SECRET in the environment.')
  process.exit(1)
}

const url = `${baseUrl}/api/programme-alerts`
const response = await fetch(url, {
  headers: { Authorization: `Bearer ${secret}` },
})

const body = await response.text()
let parsed
try {
  parsed = JSON.parse(body)
} catch {
  parsed = body
}

console.log(`${response.status} ${response.statusText}`)
console.log(typeof parsed === 'string' ? parsed : JSON.stringify(parsed, null, 2))

if (!response.ok) process.exit(1)
