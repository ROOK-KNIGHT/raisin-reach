# Prospect Enrichment API Setup Guide

This guide explains how to configure the API keys needed for the prospect enrichment feature to work properly.

## Overview

The prospect enrichment system pulls data from multiple sources to build comprehensive sales intelligence profiles:

1. **Google Places API (New)** - Business information, reviews, ratings, hours
2. **Yelp Fusion API** - Reviews, ratings, business details
3. **Website Scraping** - Contact info, social links, content analysis
4. **Claude AI (Anthropic)** - AI-powered sales intelligence generation

## Required API Keys

Add these environment variables to your `.env.local` file:

### 1. Google Places API Key

```bash
GOOGLE_PLACES_API_KEY="your_google_places_api_key_here"
```

**How to get it:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Places API (New)** - NOT the legacy Places API
4. Go to "Credentials" and create an API key
5. Restrict the API key to only the Places API (New) for security

**Important:** The system now uses the new Places API (New), not the legacy API. Make sure you enable the correct API.

### 2. Yelp Fusion API Key

```bash
YELP_API_KEY="your_yelp_fusion_api_key_here"
```

**How to get it:**
1. Go to [Yelp Fusion](https://www.yelp.com/developers/v3/manage_app)
2. Create a new app or use an existing one
3. Copy the API Key from your app dashboard

### 3. Claude API Key (Anthropic)

```bash
Claude_API_Key="your_anthropic_api_key_here"
```

**How to get it:**
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key
5. Copy the key (starts with `sk-ant-`)

**Note:** The system uses Claude Opus 4 for generating sales intelligence. Make sure your account has access to this model.

## Optional: Website Scraping

Website scraping works without any API keys, but you may want to configure:

- User-Agent headers (already configured in the code)
- Rate limiting (if needed for high-volume scraping)
- Proxy settings (for IP rotation if needed)

## Testing the Setup

After adding the API keys:

1. Restart your development server:
   ```bash
   npm run dev
   ```

