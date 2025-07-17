🚗 Car4Sure Insurance Management System

https://github.com/Bethhelemuel/Car4Sure

API documentation
https://documenter.getpostman.com/view/33229055/2sB34ikzVp

-------------------------------------------------------------------------------
Overview
-------------------------------------------------------------------------------

Car4Sure is a full-stack insurance management system built with:
 (Backend API)
  Laravel

 (Frontend)
  React
  

The chosen backend framework is Laravel, selected for its robust MVC architecture, seamless 
database migration system, and ease of integration with various services. Laravel's built-in 
features such as routing, Eloquent ORM, and middleware support streamline backend development
and enforce clean, maintainable code structure.

For the frontend, React was selected due to its component-based architecture, which promotes 
reusability and scalability in building user interfaces. Combined with Tailwind CSS, it 
enables rapid and responsive UI development with a utility-first approach, allowing
for consistent and customizable design implementation.

--------------------------------------------------------------------------------

🔧 Backend (Laravel API)

This is the Laravel-based API powering the Car4Sure application.

 ✅ Requirements
- PHP 8.1+
- Composer
- MySQL / MariaDB


 ⚙️ Setup Instructions

1. Navigate to the Backend Folder
   `````````````
   cd Backend
   `````````````

2. 📦 Install PHP Dependencies
   ```````````````````
   composer install
   ```````````````````

3. 📝 Setup Environment File
  ```````````````````
   cp .env.example .env
   `````````````````

   Edit the `.env` file to set:
   - Database credentials
   - App URL
   
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=car4sure (step 5 is database creation)
    DB_USERNAME=root
    DB_PASSWORD=


4. 🔐 Generate Application Key
   `````````````````
   php artisan key:generate
   `````````````````

5. 🗄️ Create the Database
    using MySQL:
   `````````````````````````````````````````````````````````````````````````
   CREATE DATABASE car4sure CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```````````````````````````````````````````````````````````````````````````

6. 📤 Run Migrations
   ````````````````````
   php artisan migrate
   ````````````````````



8. 🚀 Start the Development Server
   
   php artisan serve
   ````
   Visit: [http://localhost:8000](http://localhost:8000)




💻 Frontend (React App)

A modern React-based UI to manage policies, drivers, vehicles, and more.

 ✅ Prerequisites
- Node.js (v16+ recommended)
- npm or yarn

⚙️ Setup Instructions

1. 📦 Install Dependencies**
   ````````````````````
   npm install
   # or
   yarn install
   `````````````````````

2. 🛠️ Configure Environment Variables
   Create a `.env` file in the root directory (if not already present):
   ````env
   REACT_APP_API_ENDPOINT=https:REACT_APP_API_ENDPOINT=http://127.0.0.1:8000/api  (must match output from step 8 backend)
   ````
   > 🔎 Get the correct endpoint from your backend team.

3. 👨‍💻 Start the Development Server**
   ````````````
   npm start
   ``````````
   Visit: [http://localhost:3000](http://localhost:3000)

4. 📦 Build for Production
   ``````````````
   npm run build
   `````````````
   The production-ready files will be available in the `build/` directory.


