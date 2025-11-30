# Project Milestones

## Milestone 1: Project Setup & Infrastructure ✅ (In Progress)

**Goal**: Set up development environment and project structure

### Tasks

- [x] Create documentation
- [ ] Initialize Git repository
- [ ] Create project structure (backend + frontend folders)
- [ ] Set up Docker & Docker Compose (PostgreSQL)
- [ ] Initialize Nest.js backend
- [ ] Set up Prisma ORM
- [ ] Initialize Next.js frontend
- [ ] Configure Shadcn UI
- [ ] Environment variables setup
- [ ] Create README with setup instructions
- [ ] Test that everything runs locally

### Success Criteria

- Docker Compose starts all services
- Backend responds to health check
- Frontend loads at localhost:3000
- Database connection works
- Can run `npm run dev` for both services

---

## Milestone 2: Product Catalog (Full-Stack)

**Goal**: Display and browse products

### Backend

- [ ] Design Product schema (Prisma)
- [ ] Create products module in Nest.js
- [ ] CRUD endpoints for products
- [ ] Seed database with sample products
- [ ] Pagination support
- [ ] Search/filter endpoints

### Frontend

- [ ] Product listing page (Server Component)
- [ ] Product detail page (Server Component)
- [ ] Product card component
- [ ] Basic search functionality
- [ ] Filter by category/price
- [ ] Responsive design

### Success Criteria

- Can view list of products
- Can click to see product details
- Search returns correct results
- Filters work correctly
- Mobile responsive

**Commit**: "feat: product catalog with search and filters"

---

## Milestone 3: Shopping Cart (Full-Stack)

**Goal**: Add items to cart and manage quantities

### Backend

- [ ] Design Cart & CartItem schema
- [ ] Session-based cart (no auth)
- [ ] Add to cart endpoint
- [ ] Update quantity endpoint
- [ ] Remove from cart endpoint
- [ ] Get cart endpoint
- [ ] Clear cart endpoint

### Frontend

- [ ] Add to cart button on products
- [ ] Cart page
- [ ] Cart icon with item count (header)
- [ ] Update quantity controls
- [ ] Remove item button
- [ ] Cart summary (subtotal, total)
- [ ] Empty cart state
- [ ] Consider adding Tanstack Query for optimistic updates

### Success Criteria

- Can add products to cart
- Cart persists in database
- Can update quantities
- Can remove items
- Cart total calculates correctly
- Session maintains cart state

**Commit**: "feat: shopping cart with session persistence"

---

## Milestone 4: Checkout & Orders (Full-Stack)

**Goal**: Complete purchase and create orders

### Backend

- [ ] Design Order & OrderItem schema
- [ ] Create order endpoint
- [ ] Order lookup endpoint (by email/order number)
- [ ] Order status updates
- [ ] Clear cart after order
- [ ] Generate order confirmation number

### Frontend

- [ ] Checkout form (shipping info)
- [ ] Order summary page
- [ ] Form validation (Zod)
- [ ] Order confirmation page
- [ ] Order lookup page
- [ ] Email field for order tracking

### Success Criteria

- Can complete checkout form
- Order is created in database
- Cart clears after order
- Can lookup order by email/number
- Order confirmation shows all details

**Commit**: "feat: checkout and order management"

---

## Milestone 5: Admin Panel Basics (Full-Stack)

**Goal**: Admin can manage products and orders

### Backend

- [ ] Admin product endpoints (with simple auth)
- [ ] Create product
- [ ] Update product
- [ ] Delete product
- [ ] Admin order endpoints
- [ ] View all orders
- [ ] Update order status
- [ ] Dashboard stats (total orders, revenue, etc.)

### Frontend

- [ ] Admin layout/sidebar
- [ ] Product management page
  - [ ] Product list table
  - [ ] Create product form
  - [ ] Edit product form
  - [ ] Delete confirmation
- [ ] Order management page
  - [ ] Order list table
  - [ ] Order detail view
  - [ ] Update status dropdown
- [ ] Simple dashboard with stats
- [ ] Use Shadcn tables, forms, dialogs

### Success Criteria

- Admin can create/edit/delete products
- Admin can view all orders
- Admin can update order status
- Dashboard shows basic metrics
- Simple hardcoded auth (temporary)

**Commit**: "feat: admin panel for product and order management"

---

## Milestone 6: User Authentication & Authorization (Full-Stack)

**Goal**: Add proper user accounts and security

### Backend

- [ ] Design User schema
- [ ] Registration endpoint (bcrypt passwords)
- [ ] Login endpoint (JWT tokens)
- [ ] Auth guards/middleware
- [ ] Role-based access (User/Admin)
- [ ] Attach user to orders
- [ ] Protected routes
- [ ] Refresh token logic (optional)

### Frontend

- [ ] Registration page
- [ ] Login page
- [ ] Auth state management (Context or Zustand)
- [ ] Protected route wrapper
- [ ] User profile page
- [ ] Order history (user's orders only)
- [ ] Logout functionality
- [ ] Redirect logic (login → redirect back)

### Success Criteria

- Users can register and login
- JWT auth works
- Admin role enforced
- Users see only their orders
- Cart associates with user after login
- Protected routes redirect to login

**Commit**: "feat: user authentication and authorization"

---

## Post-MVP Enhancements (Future)

- Image uploads for products
- Payment integration (Stripe)
- Email notifications
- Product reviews/ratings
- Wishlist
- Order tracking
- Inventory management
- Discount codes/coupons
- Deployment to production
