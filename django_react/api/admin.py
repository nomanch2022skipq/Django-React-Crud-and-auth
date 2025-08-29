from django.contrib import admin
from .models import ProductModel, CategoryModel

# Register your models here.


@admin.register(ProductModel)
class Admin(admin.ModelAdmin):
    list_display = ["id", "name", "price", "description", "created_at"]


@admin.register(CategoryModel)
class Admin(admin.ModelAdmin):
    list_display = ["id", "name", "created_at"]
