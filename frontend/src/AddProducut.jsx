import axios from 'axios'
import React from 'react'
import { useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'



function Form() {
  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('access_token')) {
      return navigate('/login')
    }
  })

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')

  const [allProducts, setAllProducts] = useState('')

  useEffect( () => {
     axios({
      method: 'get',
      url: 'http://127.0.0.1:9001/api/products/',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('access_token')
      }}).then((response) => {
        setAllProducts(response.data)
        console.log(response.data)
      }
    )

    
  }, [])

  


  const showData = async () => {
    let formData = new FormData()
    formData.append('name', name)
    formData.append('price', price)
    formData.append('description', description)

    await axios({
      method: 'post',
      url: 'http://127.0.0.1:9001/api/products/',
      data: formData,
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('access_token')
      }
    }).then((response) => {
      
      console.log(response.data)
    }).then(() => {
      return navigate('/')
    }).catch(error => {
      console.log(error);
    })

  }

  return (
    
    <div className='input_data'>
      <h1>Add Product</h1>
      <input type="text" placeholder='Product Name' name='name' value={name} onChange={(e) => setName(e.target.value) }  />
      <input type="number" placeholder='Price' name='price' value={price} onChange={(e) => setPrice(e.target.value) }  />
      <input type="text" placeholder='Description' name='description' value={description} onChange={(e) => setDescription(e.target.value) }  />


        
    

      <button type='submit' onClick={showData}> Submit</button>


    </div>
    

  )
}

export default Form