import React, { useEffect, useState, useRef } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";
import "./App.css";

import Header from "./Components/Header.jsx";
import ProductsData from "./Components/Home.jsx";
import Form from "./Components/AddProducut.jsx";
import UpdateProduct from "./Components/UpdateProduct.jsx";
import Login from "./Components/login.jsx";
import { Logout } from "./Components/Logout.jsx";
import Register from "./Components/Register.jsx";
import CategoryViseProduct from "./Components/CategoryViseProduct.jsx";
import RecipeMain from "./Components/RecipeMain.jsx";
import RecipeGenerator from "./Components/RecipeGenerator.jsx";

function App() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const location = useLocation();
  const loadingBarRef = useRef(null);

  useEffect(() => {
    const simulateLoading = () => {
      setLoadingProgress(40);

      setTimeout(() => {
        setLoadingProgress(70);

        setTimeout(() => {
          setLoadingProgress(100);
          // Complete loading and stop the LoadingBar
          loadingBarRef.current.complete();
        }, 100);
      }, 100);
    };

    // Simulate loading on route change
    loadingBarRef.current.continuousStart();
    simulateLoading();
  }, [location.pathname]); // Trigger effect when the route changes

  return (
    <div>
      <Header />
      <LoadingBar color="#fca503" ref={loadingBarRef} height={2} />

      <Routes>
        <Route exact path="/" element={<ProductsData />} />
        <Route exact path="/products" element={<CategoryViseProduct />} />
        <Route exact path="/form" element={<Form />} />
        <Route exact path="/updateproduct/:id" element={<UpdateProduct />} />
        <Route exact path="/recipe/:id" element={<RecipeMain />} />
        <Route exact path="/generate-recipe" element={<RecipeGenerator />} />
        <Route exact path="/login/" element={<Login />} />
        <Route exact path="/logout" element={<Logout />} />
        <Route exact path="/register" element={<Register />} />

        <Route path="*" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
