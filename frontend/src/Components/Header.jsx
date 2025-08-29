import React, { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import "./Header.css";

/**
 * Header Component
 *
 * A modern, responsive navigation bar with beautiful design and smooth animations.
 * Features include:
 * - Responsive design for mobile and desktop
 * - Smooth hover animations
 * - User authentication status
 * - Modern glassmorphism effect
 * - Mobile hamburger menu
 *
 * Usage:
 * <Header />
 */
function Header(props) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!secureLocalStorage.getItem("access_token")
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = secureLocalStorage.getItem("access_token");
    const storedUsername = secureLocalStorage.getItem("Username");
    setIsLoggedIn(!!token);
    setUsername(storedUsername || "");
  }, [secureLocalStorage.getItem("access_token")]);

  const handleLogout = () => {
    secureLocalStorage.removeItem("access_token");
    secureLocalStorage.removeItem("Username");
    setIsLoggedIn(false);
    setUsername("");
    setIsMobileMenuOpen(false);

    // Redirect to home page after logout
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo Section */}
        <div className="navbar-logo">
          <Link to="/" className="logo-link">
            <div className="logo-container">
              <span className="logo-icon">🍳</span>
              <span className="logo-text">RecipeHub</span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className={`navbar-menu ${isMobileMenuOpen ? "active" : ""}`}>
          {isLoggedIn ? (
            <>
              <NavLink to="/" className="nav-link" onClick={closeMobileMenu}>
                <span className="nav-icon">🏠</span>
                <span className="nav-text">Home</span>
              </NavLink>

              <NavLink
                to="/generate-recipe"
                className="nav-link"
                onClick={closeMobileMenu}
              >
                <span className="nav-icon">✨</span>
                <span className="nav-text">Generate Recipe</span>
              </NavLink>
            </>
          ) : null}
        </div>

        {/* User Section */}
        <div className="navbar-user">
          {isLoggedIn ? (
            <div className="user-section">
              <div className="user-info">
                <span className="user-avatar">👤</span>
                <span className="username">{username}</span>
              </div>
              <button onClick={handleLogout} className="logout-btn">
                <span className="btn-icon">🚪</span>
                <span className="btn-text">Logout</span>
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <NavLink to="/register" className="register-btn">
                <span className="btn-icon">📝</span>
                <span className="btn-text">Register</span>
              </NavLink>
              <NavLink to="/login" className="login-btn">
                <span className="btn-icon">🔑</span>
                <span className="btn-text">Login</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div
          className={`hamburger ${isMobileMenuOpen ? "active" : ""}`}
          onClick={toggleMobileMenu}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </div>
      </div>
    </nav>
  );
}

export default Header;
