import React, { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import avatar from '../assets/profile.png'
import toast,{ Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'
import { profileValidation } from '../helper/validate'
import converToBase64 from '../helper/convert'
import useFetch from '../hooks/fetch.hook'
import { updateUser } from '../helper/helper'

import styles from '../styles/Username.module.css'
import extend from '../styles/profile.module.css'


export default function Profile() {
  
  const navigate=useNavigate()
  const [file, setFile] = useState()

  const [{isLoading,apiData,serverError}]= useFetch()

  const formik = useFormik({
    initialValues: {
      firstName:apiData?.firstName || '',
      lastName:apiData?.lastName || '',
      number:apiData?.number || '',
      adress:apiData?.adress || '',
      email:apiData?.email || '',
    },
    enableReinitialize:true,
    validate: profileValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      values = await Object.assign(values, { profile: file || apiData?.profile || ''})
      let updatePromise= updateUser(values)
      toast.promise(updatePromise,{
        loading:'Updating...',
        success:<b>Updated Successfully...!</b>,
        error:<b>Could not Update!!</b>
      })
    }
  })

  /** upload image */
  const onUpload = async e => {
    const base64 = await converToBase64(e.target.files[0]);
    setFile(base64)
  }

  // Logout handler function

  function logout()
  {
    localStorage.removeItem('token')
    navigate('/')
  }

  if(isLoading) 
    return <h1 className='text-2xl font-bold'>isLoading</h1>  
  
  if(serverError)
    return <h1 className='text-xl text-red-500'>{serverError.message}</h1>

  return (
    <div className="container mx-auto">

      <Toaster position='top-center' reverseOrder={false}></Toaster>


      <div className='flex justify-center items-center h-screen'>
        <div className={`${styles.glass} ${extend.glass}`} style={{ width: "45%", paddingTop: '3em' }}>
          <div className='title flex flex-col items-center'>
            <h4 className='text-5xl font-bold'>Profile</h4>
            <span className='py-4 text-xl w-2/3 text-center text-grey-500'>You can Update your Details !!</span>
          </div>
          <form className='py-1' onSubmit={formik.handleSubmit}>
            <div className='profile flex justify-center py-4'>
              <label htmlFor='profile'>
                <img src={apiData?.profile || file || avatar} className={`${styles.profile_img} , ${extend.profile_img}`} alt="avatar" />
              </label>
              <input onChange={onUpload} type="file" id="profile" name="profile" />
            </div>
            <div className='textbox flex flex-col items-center gap-6'>
              <div className='name flex w-3/4 gap-10'>
                <input className={`${styles.textbox}`} type="text" {...formik.getFieldProps('firstName')} placeholder="firstName" />
                <input className={`${styles.textbox}`} type="text" {...formik.getFieldProps('lastName')} placeholder="lastName" />
              </div>
              <div className='name flex w-3/4 gap-10'>
                <input className={`${styles.textbox}`} type="number" {...formik.getFieldProps('number')} placeholder="number" />
                <input className={`${styles.textbox}`} type="text" {...formik.getFieldProps('email')} placeholder="email" />
              </div>
              
                <input className={`${styles.textbox}`} type="text" {...formik.getFieldProps('adress')} placeholder="adress" />
                <button className={styles.btn} type="submit">Update</button>
              

            </div>
            <div className='text-center py-4'>
              <span className='text-grey-500'>Come Back Later ? <Link onClick={logout} className='text-red-500' to="/">Logout</Link></span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
