#!/usr/bin/env python3
"""
Environment Setup Script for Django-React Recipe Generator

This script creates the necessary .env files for both frontend and backend.
Run this script to set up your environment variables.
"""

import os

def create_backend_env():
    """Create .env file for Django backend"""
    backend_env_content = """# Django React Recipe Generator - Environment Configuration

# OpenAI API Configuration
# Get your API key from: https://platform.openai.com/api-keys
OPENAI_API_KEY=your_openai_api_key_here

# Django Configuration
DEBUG=True
SECRET_KEY=django-insecure-^o7g5o2gtuumsas$r-cw8m$)=*b52gv#bhc6hdf)jj7frn2&so

# Database Configuration (if using custom database)
# DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173
"""
    
    backend_path = "django_react/.env"
    try:
        with open(backend_path, 'w') as f:
            f.write(backend_env_content)
        print(f"✅ Created {backend_path}")
        return True
    except Exception as e:
        print(f"❌ Error creating {backend_path}: {e}")
        return False

def create_frontend_env():
    """Create .env file for React frontend"""
    frontend_env_content = """# Frontend Environment Variables
VITE_APP_BASE_URL_LOGIN=http://localhost:8000/api/token/
VITE_APP_BASE_URL=http://localhost:8000/api/
"""
    
    frontend_path = "frontend/.env"
    try:
        with open(frontend_path, 'w') as f:
            f.write(frontend_env_content)
        print(f"✅ Created {frontend_path}")
        return True
    except Exception as e:
        print(f"❌ Error creating {frontend_path}: {e}")
        return False

def main():
    """Main function to set up environment files"""
    print("🚀 Setting up environment files for Django-React Recipe Generator")
    print("=" * 60)
    
    # Create backend .env
    backend_success = create_backend_env()
    
    # Create frontend .env
    frontend_success = create_frontend_env()
    
    print("\n" + "=" * 60)
    if backend_success and frontend_success:
        print("🎉 Environment files created successfully!")
        print("\n📋 Next steps:")
        print("1. Edit django_react/.env and replace 'your_openai_api_key_here' with your actual OpenAI API key")
        print("2. Get your OpenAI API key from: https://platform.openai.com/api-keys")
        print("3. Install dependencies: pip install -r django_react/requirements.txt")
        print("4. Start the Django server: cd django_react && python manage.py runserver")
        print("5. Start the React app: cd frontend && npm run dev")
    else:
        print("❌ Some files could not be created. Please check the errors above.")
    
    print("\n🔐 Security Note: Never commit your .env files to version control!")

if __name__ == "__main__":
    main()
