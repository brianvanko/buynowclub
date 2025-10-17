# Buy Now Club

A curated e-commerce platform built with Next.js 15, featuring product discovery across multiple categories including Gear, Style, Tech, Shelter, Vices, Body, and more.

## Tech Stack

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** NextAuth.js v4
- **Validation:** Zod
- **Image Optimization:** Sharp
- **Email:** Nodemailer

## Features

- 🔐 User authentication with email verification
- 👤 User profiles and favorites
- 🛍️ Product browsing by category
- 🔍 Search functionality
- 👨‍💼 Admin dashboard for product management
- 📱 Responsive design
- 🎨 Modern, minimalist UI with black and white theme

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB database
- SMTP email service (for verification emails)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/brianvanko/buynowclub.git
cd buynowclub
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# Email Configuration
EMAIL_SERVER=smtp://username:password@smtp.example.com:587
EMAIL_FROM=noreply@buynowclub.com
```

4. Restore sample data (optional):
```bash
npm run restore-data
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── admin/             # Admin dashboard
│   ├── auth/              # Authentication pages
│   ├── items/             # Product pages
│   └── profile/           # User profile pages
├── components/            # React components
├── lib/                   # Utility functions and configs
└── models/                # MongoDB models
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run restore-data` - Restore sample database

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `NEXTAUTH_URL` | Application URL |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js sessions |
| `EMAIL_SERVER` | SMTP server configuration |
| `EMAIL_FROM` | Email sender address |

## Authentication

The application uses NextAuth.js with credential-based authentication:

- Users must verify their email after registration
- Passwords are hashed with bcrypt
- Password requirements: 8+ characters, uppercase, lowercase, and number
- Session-based authentication with secure cookies

## Admin Access

Admin users can:
- Create, edit, and delete products
- Manage categories and subcategories
- Access admin dashboard at `/admin`

## License

Private - All rights reserved

## Author

Brian Vanko
