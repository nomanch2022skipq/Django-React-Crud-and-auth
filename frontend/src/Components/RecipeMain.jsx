import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./RecipeMain.css";
import secureLocalStorage from "react-secure-storage";

const RecipeMain = () => {
  const [data, setData] = useState([]);
  const location = useLocation();
  const [create_Date, setCreateDate] = useState("");

  const createDate = (timestampString) => {
    const timestamp = new Date(timestampString);

    // Get the current time
    const currentTime = new Date();

    // Calculate the time difference in milliseconds
    const timeDifference = currentTime - timestamp;

    // Convert milliseconds to seconds
    const secondsDifference = Math.floor(timeDifference / 1000);

    // Convert seconds to minutes
    const minutesDifference = Math.floor(secondsDifference / 60);

    // Convert minutes to hours
    const hoursDifference = Math.floor(minutesDifference / 60);

    // Convert hours to days
    const daysDifference = Math.floor(hoursDifference / 24);

    // Convert days to years
    const yearsDifference = Math.floor(daysDifference / 365);

    // Function to format time difference
    const formatTimeDifference = (time) => {
      if (time < 60) {
        return `${time} second${time !== 1 ? "s" : ""}`;
      } else if (time < 3600) {
        const minutes = Math.floor(time / 60);
        return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
      } else if (time < 86400) {
        const hours = Math.floor(time / 3600);
        return `${hours} hour${hours !== 1 ? "s" : ""}`;
      } else if (time < 31536000) {
        const days = Math.floor(time / 86400);
        return `${days} day${days !== 1 ? "s" : ""}`;
      } else {
        const years = Math.floor(time / 31536000);
        return `${years} year${years !== 1 ? "s" : ""}`;
      }
    };

    const formattedTimeDifference = formatTimeDifference(secondsDifference);

    return formattedTimeDifference;
  };

  useEffect(() => {
    if (!secureLocalStorage.getItem("access_token")) {
      return navigate("/login");
    }

    setData(location.state);
    // console.log(location.state);
    setCreateDate(createDate(location.state.created_at));
    // console.log(typeof location.state.created_at);
  }, [location.state]);

  return (
    <div className="product-page">
      <div className="background-overlay"></div>
      <div className="product-container">
        <div className="product-details">
          <div className="product-image">
            <img
              src="https://s23209.pcdn.co/wp-content/uploads/2023/10/Creamy-Sausage-and-Gnocchi_099-360x540.jpg"
              alt="Product"
            />
          </div>
          <div className="product-info">
            <h1 className="product-name">{data.name}</h1>
            <p className="product-price">Price: ${data.price}</p>
            <p className="product-category">Category: {data.category_name}</p>
            <p className="product-created-at">Created at: {create_Date}</p>
            <p className="product-description">
              Description: {data.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeMain;
