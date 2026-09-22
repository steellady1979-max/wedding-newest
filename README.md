# Chiffon Kiss Guestbook

Please import and set up the project from my connected GitHub repository: https://github.com/lunara1111/chiffon-kiss-open

After loading, please make the following updates:

1. FIX ASSETS & FONTS ON VERCEL:

   - Fix all image paths so they display correctly when deployed on Vercel (ensure assets in /public use root-relative paths like '/images/...').

   - Ensure custom/Google fonts load correctly across all mobile and desktop browsers.

2. SCHEDULE UPDATE:

   - In the wedding schedule/timeline section, update or add the entry for 18:00: "18:00 - ვახშამი".

3. RSVP & GOOGLE SHEETS:

   - Send RSVP and guestbook responses directly to the shared Google Sheet.

   - Collect the following guest responses:

     * Guest Full Name (სახელი/გვარი)

     * Attendance Status (მოდის / ვერ მოდის)

     * Plus One Full Name (+1-ის სახელი და გვარი, if attending)

   - Use the shared Google Sheet as the response list instead of an admin route.

   - The sheet includes:

     * Who is attending

     * Who cannot attend

     * Plus One details

     * Total counts for guests attending

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://kindred-gather-grace.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ef1499bc-3e6d-487e-8df6-ceb6ab19adbc).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
