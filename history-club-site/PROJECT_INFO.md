# Neastoria - History Club Website

A modern React website for the Neastoria history club, designed to replace the existing WordPress site with additional features and improved functionality.

## Project Overview

This website provides a complete platform for managing a history club's online presence, including:

- **Welcome Page**: Engaging landing page with club overview and highlights
- **Events Page**: Full event management with upcoming and past events
- **Blog**: Articles and historical content
- **About Us**: Club information and team
- **Membership**: Registration system for club members (20€/year)

## Tech Stack

- **React 19.1** - Modern UI library
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **CSS3** - Styled with inspired design from neastoria.fr

## Design

The design is inspired by the current WordPress site at neastoria.fr:
- **Color Scheme**: Warm beige (#edddc7) background, black text, dark gray (#32373c) accents
- **Aesthetic**: Minimalist, elegant, academic
- **Typography**: Clean, readable fonts with good hierarchy
- **Layout**: Responsive and mobile-friendly

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Header.jsx      # Navigation header
│   ├── Header.css
│   ├── Footer.jsx      # Site footer
│   └── Footer.css
├── pages/              # Page components
│   ├── Home.jsx        # Landing page
│   ├── Home.css
│   ├── Events.jsx      # Events listing and registration
│   ├── Events.css
│   ├── Blog.jsx        # Blog posts
│   ├── Blog.css
│   ├── About.jsx       # About the club
│   ├── About.css
│   ├── Membership.jsx  # Membership registration
│   └── Membership.css
├── App.jsx             # Main app with routing
├── App.css
├── main.jsx            # App entry point
└── index.css           # Global styles
```

## Getting Started

### Running the Development Server

```bash
npm run dev
```

The site will be available at http://localhost:5173/

### Building for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Features Implemented

### ✅ Completed
- Welcome/Landing page with hero section and features
- Events page with upcoming and past events display
- Blog page with article previews
- About Us page with club info and team
- Membership page with registration form
- Responsive navigation header
- Footer with links and contact info
- Mobile-responsive design
- Clean, minimalist styling matching neastoria.fr aesthetic

### 🚧 To Be Implemented

#### High Priority
1. **Ticketing System for Events**
   - Integration with payment processor (Stripe, PayPal, or HelloAsso)
   - Registration storage (database setup needed)
   - Email confirmations
   - QR code tickets

2. **Membership Payment System**
   - 20€ annual membership payment integration
   - Member database storage
   - Email notifications for expiring subscriptions (30 days before)
   - Renewal reminders
   - Member login/authentication

3. **Backend Infrastructure**
   - Database setup (PostgreSQL/MongoDB recommended)
   - API server (Node.js/Express or similar)
   - User authentication system
   - Admin panel for content management

#### Medium Priority
4. **Blog Functionality**
   - Full blog post pages
   - Rich text editor for admins
   - Categories and tags
   - Comments system (optional)

5. **Event Management**
   - Admin panel to add/edit/delete events
   - Event capacity management
   - Waitlist functionality
   - Event reminder emails

6. **Email System**
   - Welcome emails for new members
   - Event registration confirmations
   - Membership renewal reminders
   - Newsletter functionality

#### Nice to Have
7. **Member Dashboard**
   - View upcoming events
   - Registration history
   - Membership status
   - Profile management

8. **Search Functionality**
   - Search events
   - Search blog posts
   - Filter by date/category

9. **Social Features**
   - Social media integration
   - Event sharing
   - Photo galleries from past events

## Recommended Tech Stack for Backend

### Database Options
- **PostgreSQL**: Robust, reliable, good for structured data
- **MongoDB**: Flexible, good for document-based storage
- **Supabase**: PostgreSQL + Auth + Storage, easy to set up

### Backend Framework Options
- **Node.js + Express**: JavaScript full-stack
- **Next.js API Routes**: If moving to Next.js
- **Supabase**: Backend-as-a-Service (recommended for quick setup)

### Payment Integration
- **Stripe**: Full-featured, widely used
- **PayPal**: Alternative payment processor
- **HelloAsso**: Already used on current site, French-focused

### Email Service
- **SendGrid**: Reliable, free tier available
- **Mailgun**: Good for transactional emails
- **AWS SES**: Cost-effective for high volume

### Hosting Recommendations
- **Frontend**: Vercel, Netlify, or Cloudflare Pages (free tier available)
- **Backend**: Railway, Render, or AWS (various pricing)
- **Database**: Supabase (free tier), PlanetScale, or hosting provider

## Next Steps

1. **Choose Backend Stack**: Decide on database, backend framework, and hosting
2. **Set Up Database**: Create tables for users, events, registrations, blog posts
3. **Implement Authentication**: User login/registration system
4. **Payment Integration**: Set up Stripe/PayPal/HelloAsso for memberships and events
5. **Email System**: Configure email service for notifications
6. **Admin Panel**: Create interface for managing content
7. **Testing**: Thoroughly test all payment and registration flows
8. **Deployment**: Deploy to production hosting

## Current Status

The frontend is complete and functional with all main pages implemented. The site is ready for backend integration to enable:
- User registration and authentication
- Payment processing
- Data persistence
- Email notifications
- Content management

## Notes

- All placeholder data (events, blog posts, team members) should be replaced with real data
- Payment buttons currently show alerts - they need to be connected to actual payment processors
- Member registration form needs backend API endpoint
- Event registration needs ticketing system integration
- Consider adding analytics (Google Analytics, Plausible, etc.)
