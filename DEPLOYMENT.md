# RaisinReach Deployment Guide

This guide outlines the steps to deploy the RaisinReach platform using the **Vercel + Route 53** hybrid approach.

**Status:** The AWS Route 53 DNS records have been configured via CLI to point to Vercel.

## 1. Connect to Vercel
1.  Push your code to GitHub.
2.  Log in to Vercel (vercel.com) and click **"Add New Project"**.
3.  Import the `raisin-reach` repository.
4.  **Framework Preset:** Next.js
5.  **Build Command:** `next build`
6.  **Output Directory:** `.next`
7.  Click **Deploy**.

## 2. Configure Custom Domain (Vercel)
**Critical Step:** Vercel needs to know it should serve `raisinreach.com`.

1.  Go to your Vercel Project Dashboard -> **Settings** -> **Domains**.
2.  Enter `raisinreach.com` and click **Add**.
3.  Enter `www.raisinreach.com` and click **Add** (Redirect to root recommended).
4.  Vercel will verify the DNS records (which we just added). This might take a few minutes.

## 3. Verify SSL
Vercel automatically provisions SSL certificates. Once DNS propagates (usually 15-30 mins), your site will be secure (`https://raisinreach.com`).

---

## Lead Infrastructure (Environment Variables)
To enable the email notification system (Resend/SES), add these variables in Vercel **Settings** -> **Environment Variables**:

-   `RESEND_API_KEY`: `re_123456789` (Get this from resend.com)
-   `NEXT_PUBLIC_SITE_URL`: `https://raisinreach.com`
-   `EMAIL_FROM`: `onboarding@raisinreach.com`
-   `EMAIL_TO`: `reach@raisinreach.com`
