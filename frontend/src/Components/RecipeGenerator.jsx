import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import ReactMarkdown from "react-markdown";
import { toast } from "react-toastify";
import "./RecipeGenerator.css";

/**
 * RecipeGenerator Component
 *
 * This component provides a user interface for generating recipes using OpenAI API.
 * Users can input a recipe description and receive a detailed recipe with ingredients,
 * instructions, cooking time, and tips.
 *
 * Features:
 * - Text input for recipe description
 * - API integration with Django backend
 * - Loading states and error handling
 * - Responsive design matching app theme
 *
 * Usage:
 * <RecipeGenerator />
 */
function RecipeGenerator() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);
  const [copying, setCopying] = useState(false);
  const [error, setError] = useState("");

  // Check authentication on component mount
  useEffect(() => {
    const token = secureLocalStorage.getItem("access_token");
    if (!token) {
      toast.error("🔒 Please login to access the Recipe Generator", {
        position: "bottom-right",
        autoClose: 3000,
      });
      navigate("/login");
      return;
    }
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

  /**
   * Handles the recipe generation by calling the backend API
   *
   * @param {Event} e - Form submission event
   */
  const handleGenerateRecipe = async (e) => {
    e.preventDefault();

    // Check authentication before generating recipe
    const token = secureLocalStorage.getItem("access_token");
    if (!token) {
      toast.error("🔒 Please login to generate recipes", {
        position: "bottom-right",
        autoClose: 3000,
      });
      navigate("/login");
      return;
    }

    if (!message.trim()) {
      setError("Please enter a recipe description");
      return;
    }

    setLoading(true);
    setError("");
    setRecipe("");

    try {
      const token = secureLocalStorage.getItem("access_token");

      const response = await fetch(
        import.meta.env.VITE_APP_BASE_URL + "recipe-generator/generate_recipe/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setRecipe(data.recipe);
      } else {
        setError(data.error || "Failed to generate recipe");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clears the form and generated recipe
   */
  const handleClear = () => {
    setMessage("");
    setRecipe("");
    setError("");
  };

  /**
   * Handles copying the recipe to clipboard and shows a toast notification
   */
  const handleCopyRecipe = async () => {
    setCopying(true);
    try {
      // Modern clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(recipe);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = recipe;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }

      toast.success("📋 Recipe copied to clipboard!", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      toast.error("❌ Failed to copy recipe", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } finally {
      setCopying(false);
    }
  };

  return (
    <div className="recipe-generator-container">
      <div className="recipe-generator-content">
        <h1 className="recipe-generator-title">🍳 Recipe Generator</h1>
        <p className="recipe-generator-subtitle">
          Describe what you want to cook and get a detailed recipe!
        </p>

        <form onSubmit={handleGenerateRecipe} className="recipe-form">
          <div className="input-group">
            <label htmlFor="recipe-message" className="form-label">
              What would you like to cook?
            </label>
            <textarea
              id="recipe-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g., how to make crunchy pizza, chocolate cake recipe, spicy chicken curry..."
              className="recipe-input"
              rows="4"
              disabled={loading}
            />
          </div>

          <div className="button-group">
            <button
              type="submit"
              className="generate-btn"
              disabled={loading || !message.trim()}
            >
              {loading ? "Generating Recipe..." : "Generate Recipe"}
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="clear-btn"
              disabled={loading}
            >
              Clear
            </button>
          </div>
        </form>

        {error && (
          <div className="error-message">
            <span>⚠️ {error}</span>
          </div>
        )}

        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Creating your recipe...</p>
          </div>
        )}

        {recipe && (
          <div className="recipe-result">
            <h2 className="recipe-result-title">✨ Your Generated Recipe</h2>
            <div className="recipe-content">
              <div className="recipe-text">
                <ReactMarkdown>{recipe}</ReactMarkdown>
              </div>
            </div>
            <div className="recipe-actions">
              <button
                onClick={handleCopyRecipe}
                className="copy-btn"
                disabled={copying}
              >
                {copying ? "📋 Copying..." : "📋 Copy Recipe"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecipeGenerator;
