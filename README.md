# Q3 CartCraft – MERN E-Commerce Application

## Project Overview
Q3 CartCraft is a full-stack e-commerce application developed using the MERN stack. It allows users to view products, add items to their shopping cart, and place orders through a checkout system.

## Technologies Used
- **Frontend:** React.js, Vite, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Authentication:** JWT
- **API Testing:** Postman

## Project Features
- User registration and login
- Product listing
- Add products to cart
- View shopping cart
- Calculate cart total
- Checkout and place orders
- Update product stock after successful checkout
- View user orders
- Responsive and clean user interface

## Project Structure

```text
Q3-CartCraft/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── .env
│   └── server.js
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── .gitignore
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Miss-Imtiaz/Q3-CartCraft.git
cd Q3-CartCraft
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder and configure your environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start the backend:

```bash
node server.js
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL shown in the terminal, usually:

```text
http://localhost:5173
```

## How to Use
1. Register a new account.
2. Log in using your credentials.
3. Browse the available products.
4. Add products to your cart.
5. Review the cart and total amount.
6. Click Checkout to place your order.
7. View the order confirmation and updated stock.

## Database
MongoDB Atlas is used to store application data, including users, products, carts, and orders.

## GitHub Repository
[Q3 CartCraft – GitHub](https://github.com/Miss-Imtiaz/Q3-CartCraft)

## Author
**Muzdalfa Imtiaz**

