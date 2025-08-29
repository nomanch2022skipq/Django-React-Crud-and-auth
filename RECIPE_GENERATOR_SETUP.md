# Recipe Generator Setup Guide

## Overview
This feature adds AI-powered recipe generation to your Django-React application using OpenAI's API.

## Backend Setup (Django)

### 1. Install Dependencies
```bash
cd django_react
pip install -r requirements.txt
```

### 2. Configure OpenAI API Key
You need to set up your OpenAI API key as an environment variable:

**Windows:**
```cmd
set OPENAI_API_KEY=your_openai_api_key_here
```

**Linux/Mac:**
```bash
export OPENAI_API_KEY=your_openai_api_key_here
```

**Or create a .env file in django_react folder:**
```
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Get OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or log in
3. Create a new API key
4. Copy the key and use it in step 2

### 4. Run Django Server
```bash
cd django_react
python manage.py runserver
```

## Frontend Setup (React)

### 1. Install Dependencies (if not already done)
```bash
cd frontend
npm install
```

### 2. Start React Development Server
```bash
npm run dev
```

## Usage

1. **Login** to your application
2. **Click "Generate Recipe"** in the navigation menu
3. **Enter a recipe description** (e.g., "how to make crunchy pizza")
4. **Click "Generate Recipe"** button
5. **View the generated recipe** with ingredients, instructions, cooking time, and tips
6. **Copy the recipe** to clipboard if needed

## API Endpoint

The recipe generation API is available at:
```
POST http://localhost:8000/api/recipe-generator/generate_recipe/
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <your_jwt_token>
```

**Body:**
```json
{
  "message": "how to make crunchy pizza"
}
```

**Response:**
```json
{
  "recipe": "Detailed recipe content...",
  "message": "Recipe generated successfully"
}
```

## Features

- ✅ AI-powered recipe generation
- ✅ User authentication required
- ✅ Responsive design matching app theme
- ✅ Loading states and error handling
- ✅ Copy to clipboard functionality
- ✅ Form validation
- ✅ Clean and intuitive UI

## Troubleshooting

### Common Issues:

1. **"Error generating recipe"**
   - Check if OPENAI_API_KEY is set correctly
   - Verify your OpenAI API key is valid
   - Ensure you have credits in your OpenAI account

2. **"Network error"**
   - Make sure Django server is running on port 8000
   - Check CORS configuration
   - Verify frontend is making requests to correct URL

3. **Authentication errors**
   - Ensure user is logged in
   - Check if JWT token is valid
   - Try logging out and logging back in

## Security Notes

- Never commit your OpenAI API key to version control
- Use environment variables for sensitive configuration
- The API requires authentication to prevent abuse
- Consider implementing rate limiting for production use
