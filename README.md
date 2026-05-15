# Productr

A full-stack product management application with user authentication via OTP (email/phone).

## Features

- **Authentication**: Login with email or phone, OTP verification
- **Product Management**: Create, read, update, delete products
- **Image Upload**: Upload product images
- **Responsive UI**: Built with React and Tailwind CSS
- **RESTful API**: Express.js backend with MongoDB

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express
- MongoDB
- JWT
- Multer (Image upload)

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd productr
```

2. Install backend dependencies
```bash
cd server
npm install
```

3. Install frontend dependencies
```bash
cd ../client
npm install
```

### Configuration

1. Create `.env` file in the `server` directory, or use `server/.env.example` as a template:
```
PORT=5000
MONGODB_URI=mongodb+srv://productr:<db_password>@cluster0.fglwmyl.mongodb.net/productr?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-here
NODE_ENV=development
CORS_ORIGINS=http://localhost:3000
```

2. Create `.env` file in the `client` directory, or use `client/.env.example`:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

### Running the Application Locally

1. Start the backend server
```bash
cd server
npm run dev
```

2. Start the frontend development server
```bash
cd client
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

### Deployment

This app is ready to deploy with:
- Frontend on Netlify
- Backend on Render
- Database on MongoDB Atlas

#### MongoDB Atlas
1. Use your Atlas connection string in Render environment variables.
2. For example:
```bash
MONGODB_URI=mongodb+srv://productr:<db_password>@cluster0.fglwmyl.mongodb.net/productr?retryWrites=true&w=majority
```
3. Set a strong `JWT_SECRET` in Render as well.

#### Render Backend Setup
1. Create a new Web Service on Render.
2. Connect the `server` folder or repository.
3. Set the Start Command to:
```bash
npm start
```
4. Add environment variables in Render:
- `MONGODB_URI`
- `JWT_SECRET`
- `NODE_ENV=production`
- `CORS_ORIGINS=https://your-netlify-site.netlify.app`

#### Netlify Frontend Setup
1. Connect the `client` folder or repository to Netlify.
2. Set the build command to:
```bash
npm run build
```
3. Set the publish directory to:
```bash
dist
```
4. Add an environment variable in Netlify:
- `VITE_API_BASE_URL=https://your-render-service.onrender.com/api`

#### Final Notes
- Keep `.env` files local and do not commit them.
- Use the provided example files to configure your deployment environment.

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email or phone
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/resend-otp` - Resend OTP

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

## Project Structure

```
productr/
├── client/                    # React frontend
│   ├── src/
│   │   ├── api/              # Axios configuration
│   │   ├── components/       # React components
│   │   ├── context/          # Auth context
│   │   ├── pages/            # Page components
│   │   └── App.jsx
│   └── index.html
├── server/                    # Express backend
│   ├── middleware/           # Auth middleware
│   ├── models/               # MongoDB models
│   ├── routes/               # API routes
│   ├── utils/                # Utilities (Multer config)
│   ├── uploads/              # Product images
│   └── index.js
└── README.md
```

## License

MIT

## Contributing

Feel free to submit issues and enhancement requests!
