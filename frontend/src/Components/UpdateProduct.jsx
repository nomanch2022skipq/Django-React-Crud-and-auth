import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";


const UpdateProduct = () => {

  const navigate = useNavigate()
  

  
  const base_url = import.meta.env.VITE_APP_BASE_URL_PRODUCTS
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const productId = secureLocalStorage.getItem('product_id')
  const [errorData, setError] = useState('')



  useEffect(() => {
    if (!secureLocalStorage.getItem('access_token')) {
      return navigate('/login')
    }
  
    axios({

      method: 'get',
      url: base_url + productId + "/",
      headers: {

        Authorization: 'Bearer ' + secureLocalStorage.getItem('access_token')

      }
    }).then(response => {
        setName(response.data.name);
        setPrice(response.data.price);
        setDescription(response.data.description);
        console.log(response.data.id)
      })
      .catch(error => {
        console.log(error);
      });
    }, []);

  const submitUpdate = async (e) => {
    let formData = new FormData()
    formData.append('name', name)
    formData.append('price', price)
    formData.append('description', description)

    await axios({
      method: 'put',
      url: base_url + productId + "/",
      data: formData,
      headers: {
        Authorization: 'Bearer ' + secureLocalStorage.getItem('access_token')
      }
    }).then(() => {
      return navigate('/')
    }).catch(error => {
      setError("Enter valid data and fill all data")
      console.log(error);
    })

  }

  return (

    <div className='input_data'>
      <h1>Update Product</h1>
      {errorData ? <center><p style={{color:"red"}}>{errorData}</p></center> : null}

      <input type="text" placeholder='Product Name' name='name' value={name} onChange={(e) => setName(e.target.value) }  />
      <input type="number" placeholder='Price' name='price' value={price} onChange={(e) => setPrice(e.target.value) }  />
      <input type="text" placeholder='Description' name='description' value={description} onChange={(e) => setDescription(e.target.value) }  />
      

      <button type='submit' onClick={submitUpdate}> Submit</button>


    </div>
  )
}

export default UpdateProduct