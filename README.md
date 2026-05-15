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

1. Create `.env` file in the `server` directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/productr
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

### Running the Application

1. Start MongoDB
```bash
mongod
```

2. Start the backend server
```bash
cd server
npm run dev
```

3. Start the frontend development server
```bash
cd client
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

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
