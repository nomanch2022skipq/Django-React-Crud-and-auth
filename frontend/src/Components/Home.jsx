import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { toast } from "react-toastify";
import "./Home.css";

/**
 * Home Component - Modern Recipe Dashboard
 *
 * A beautiful, modern dashboard for browsing recipes with:
 * - Modern card-based layout
 * - Category filtering
 * - Responsive design
 * - Loading states and animations
 * - Beautiful hover effects
 */
const ProductsData = () => {
  const navigate = useNavigate();
  const [productData, setProductData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // Check authentication on component mount
  useEffect(() => {
    const token = secureLocalStorage.getItem("access_token");
    if (!token) {
      toast.error("🔒 Please login to access the Home page", {
        position: "bottom-right",
        autoClose: 3000,
      });
      navigate("/login");
      return;
    }
    fetchData();
  }, [navigate]);

  // Monitor for authentication changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "access_token" && !e.newValue) {
        // Token was removed (logout)
        toast.error("🔒 Session expired. Please login again.", {
          position: "bottom-right",
          autoClose: 3000,
        });
        navigate("/login");
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Also check periodically for immediate logout (same tab)
    const checkAuth = () => {
      const token = secureLocalStorage.getItem("access_token");
      if (!token) {
        toast.error("🔒 Session expired. Please login again.", {
          position: "bottom-right",
          autoClose: 3000,
        });
        navigate("/login");
      }
    };

    const authInterval = setInterval(checkAuth, 2000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(authInterval);
    };
  }, [navigate]);

  const fetchData = async () => {
    // Check authentication before fetching data
    const token = secureLocalStorage.getItem("access_token");
    if (!token) {
      toast.error("🔒 Please login to access recipes", {
        position: "bottom-right",
        autoClose: 3000,
      });
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      // Fetch products
      const productsResponse = await axios({
        method: "get",
        url: "http://127.0.0.1:9001/api/products/",
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      setProductData(productsResponse.data);

      // Fetch categories
      const categoriesResponse = await axios({
        method: "get",
        url: "http://127.0.0.1:9001/api/categories/",
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      setCategories(categoriesResponse.data);
    } catch (error) {
      console.log("Error fetching data:", error);
      toast.error("Failed to load recipes", { position: "bottom-right" });
    } finally {
      setLoading(false);
    }
  };

  const filterByCategory = async (categoryId, categoryName) => {
    // Check authentication before filtering
    const token = secureLocalStorage.getItem("access_token");
    if (!token) {
      toast.error("🔒 Please login to filter recipes", {
        position: "bottom-right",
        autoClose: 3000,
      });
      navigate("/login");
      return;
    }

    setLoading(true);
    setSelectedCategory(categoryName);

    if (categoryName === "All") {
      await fetchData();
      return;
    }

    try {
      const response = await axios({
        method: "get",
        url: "http://127.0.0.1:9001/api/productsincategory/",
        params: { category_id: categoryId },
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      setProductData(response.data);
    } catch (error) {
      console.log("Error filtering by category:", error);
      toast.error("Failed to filter recipes", { position: "bottom-right" });
    } finally {
      setLoading(false);
    }
  };

  const readMore = async (productId) => {
    // Check authentication before viewing recipe details
    const token = secureLocalStorage.getItem("access_token");
    if (!token) {
      toast.error("🔒 Please login to view recipe details", {
        position: "bottom-right",
        autoClose: 3000,
      });
      navigate("/login");
      return;
    }

    try {
      const response = await axios({
        method: "get",
        url: `http://127.0.0.1:9001/api/products/${productId}/`,
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      secureLocalStorage.setItem("recipe_id", productId);
      navigate(`/recipe/${productId}/`, { state: response.data });
    } catch (error) {
      console.log("Error fetching recipe details:", error);
      toast.error("Failed to load recipe details", {
        position: "bottom-right",
      });
    }
  };

  const filteredProducts = productData.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">🍳 Discover Amazing Recipes</h1>
          <p className="hero-subtitle">
            Explore our collection of delicious recipes from around the world
          </p>

          {/* Search Bar */}
          <div className="search-container">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="main-content">
        {/* Categories Sidebar */}
        <div className="categories-sidebar">
          <div className="categories-header">
            <h3>📂 Categories</h3>
            <span className="category-count">
              {categories.length} categories
            </span>
          </div>

          <div className="categories-list">
            <button
              className={`category-item ${
                selectedCategory === "All" ? "active" : ""
              }`}
              onClick={() => filterByCategory(null, "All")}
            >
              <span className="category-icon">🌟</span>
              <span className="category-name">All Recipes</span>
              <span className="category-count-badge">{productData.length}</span>
            </button>

            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-item ${
                  selectedCategory === category.name ? "active" : ""
                }`}
                onClick={() => filterByCategory(category.id, category.name)}
              >
                <span className="category-icon">📁</span>
                <span className="category-name">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recipes Grid */}
        <div className="recipes-section">
          <div className="recipes-header">
            <h2>
              {selectedCategory === "All"
                ? "All Recipes"
                : `${selectedCategory} Recipes`}
            </h2>
            <span className="recipes-count">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "recipe" : "recipes"}
            </span>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading delicious recipes...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🍽️</div>
              <h3>No recipes found</h3>
              <p>Try adjusting your search or category filter</p>
            </div>
          ) : (
            <div className="recipes-grid">
              {filteredProducts.map((product) => (
                <div key={product.id} className="recipe-card">
                  <div className="recipe-card-header">
                    <div className="recipe-category">
                      <span className="category-badge">
                        {product.category_name}
                      </span>
                    </div>
                    <div className="recipe-price">
                      <span className="price-tag">Rs {product.price}</span>
                    </div>
                  </div>

                  <div className="recipe-card-content">
                    <h3 className="recipe-title">{product.name}</h3>
                    <p className="recipe-description">
                      {product.description.length > 120
                        ? `${product.description.slice(0, 120)}...`
                        : product.description}
                    </p>
                  </div>

                  <div className="recipe-card-footer">
                    <button
                      className="read-more-btn"
                      onClick={() => readMore(product.id)}
                    >
                      <span className="btn-icon">📖</span>
                      <span className="btn-text">Read Recipe</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsData;
