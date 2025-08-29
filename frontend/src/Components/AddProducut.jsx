import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import secureLocalStorage from "react-secure-storage";

function Form() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [errorData, setError] = useState("");

  useEffect(() => {
    if (!secureLocalStorage.getItem("access_token")) {
      return navigate("/login");
    }
  }, []);

  const showData = async () => {
    let formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);

    await axios({
      method: "post",
      url: import.meta.env.VITE_APP_BASE_URL_PRODUCTS,
      data: formData,
      headers: {
        Authorization: "Bearer " + secureLocalStorage.getItem("access_token"),
      },
    })
      .then((response) => {
        toast.success("Product Added", {
          position: "bottom-right",
        });
        console.log(response.data);
      })
      .then(() => {
        return navigate("/");
      })
      .catch((error) => {
        setError("Enter valid data and fill all data");
        console.log(error);
      });
  };

  return (
    <div className="input_data">
      <h1>Add Product</h1>
      {errorData ? (
        <center>
          <p style={{ color: "red" }}>{errorData}</p>
        </center>
      ) : null}
      <input
        type="text"
        placeholder="Product Name"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Price"
        name="price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        name="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button type="submit" onClick={showData}>
        {" "}
        Submit
      </button>
    </div>
  );
}

export default Form;
