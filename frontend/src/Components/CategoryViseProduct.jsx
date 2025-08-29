import React, { useEffect, useLayoutEffect, useState } from "react";
import axios from "axios";
import secureLocalStorage from "react-secure-storage";

const CategoryViseProduct = () => {
  const [data, setData] = useState([]);

  useLayoutEffect(() => {
    // console.log('useEffect called');
    axios({
      method: "get",
      url: "http://127.0.0.1:9001/api/categories/",
      headers: {
        Authorization: "Bearer " + secureLocalStorage.getItem("access_token"),
      },
    })
      .then((response) => {
        // console.log(response.data);
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      {data.map((item, index) => {
        return (
          <div key={index}>
            <h1>{item.name}</h1>
          </div>
        );
      })}
    </>
  );
};

export default CategoryViseProduct;
