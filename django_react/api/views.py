from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, GenericViewSet
from rest_framework.permissions import IsAuthenticated
from .models import *
from .serializer import *

from rest_framework import generics
from rest_framework import status
from rest_framework.decorators import action
from django.contrib.auth.models import User
import openai
import os
from django.conf import settings

# from django.contrib.auth.forms import UserCreationForm


class ProductViewSet(ModelViewSet):
    serializer_class = ProductSerializer
    queryset = ProductModel.objects.all().order_by("-created_at")
    permission_classes = [IsAuthenticated]


class CreateUserViewSet(ModelViewSet):
    serializer_class = UserSerializer
    queryset = get_user_model().objects.all()


class CategoryViewSet(ModelViewSet):
    serializer_class = CategorySerializer
    queryset = CategoryModel.objects.all()
    permission_classes = [IsAuthenticated]


class ProductWithCategoryViewSet(ModelViewSet):
    serializer_class = ProductSerializer
    # queryset = ProductModel.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        category_id = self.request.query_params.get("category_id")
        if not category_id:
            return Response({"error": "category_id is required"}, status=400)
        return ProductModel.objects.filter(category=category_id)


class RecipeGeneratorView(ModelViewSet):
    """
    ViewSet for generating recipes using OpenAI API.
    
    This view provides an endpoint to generate recipes based on user input.
    It uses OpenAI's API to create detailed recipe instructions.
    """
    
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['post'])
    def generate_recipe(self, request):
        """
        Generate a recipe based on user input using OpenAI API.
        
        Args:
            request: HTTP request containing 'message' field with recipe description
            
        Returns:
            Response: JSON response containing the generated recipe
            
        Example:
            POST /api/recipe-generator/generate_recipe/
            {
                "message": "how to make crunchy pizza"
            }
        """
        try:
            message = request.data.get('message')
            
            if not message:
                return Response(
                    {'error': 'Message is required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Initialize OpenAI client
            # Note: You'll need to set OPENAI_API_KEY in your environment variables
            client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
            
            # Create the prompt for recipe generation
            prompt = f"""
            Please provide a detailed recipe for: {message}
            
            Format the recipe using proper markdown with the following structure:
            
            # Recipe Title
            
            ## Ingredients
            - List ingredients with measurements
            
            ## Instructions
            1. Step-by-step instructions
            2. Clear and detailed steps
            
            ## Cooking Time
            - Total time needed
            
            ## Servings
            - Number of servings
            
            ## Tips
            - Helpful tips for best results
            
            Use **bold** for important information and make it visually appealing with proper markdown formatting.
            """
            
            # Generate recipe using OpenAI
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a professional chef and recipe expert. Always format recipes using proper markdown with headers (##), bold text (**), and bullet points. Make recipes visually appealing and easy to read."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=1000,
                temperature=0.7
            )
            
            recipe = response.choices[0].message.content
            
            return Response({
                'recipe': recipe,
                'message': 'Recipe generated successfully'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'error': f'Error generating recipe: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
