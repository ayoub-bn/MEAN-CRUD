import React,{useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import avatar from '../assets/profile.png'
import toast,{ Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'
import { registerValidation } from '../helper/validate'
import converToBase64 from '../helper/convert'
import { registerUser } from '../helper/helper'

import styles from '../styles/Username.module.css'


export default function Register() {

  const navigate= useNavigate()
  const [file,setFile]= useState()

  const formik = useFormik({
    initialValues: {
      email: 'aaa@aaa.aaa',
      username: 'aaa',
      password: 'aaa'
    },
    validate: registerValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      values = await Object.assign(values, {profile:file || ""})
      let registerPromise = registerUser(values)
      toast.promise(registerPromise, {
        loading: 'Creating...',
        success : <b>Register Successfully...!</b>,
        error : <b>Could not Register.</b>
      });

      registerPromise.then(()=>[navigate('/')])
    }
  })

/** upload image */
const onUpload=async e=>{
  const base64=await converToBase64(e.target.files[0]);
  setFile(base64)
}

  return (
    <div className="container mx-auto">

      <Toaster position='top-center' reverseOrder={false}></Toaster>


      <div className='flex justify-center items-center h-screen'>
        <div className={styles.glass} style={{width:"45%",paddingTop:'3em'}}>
          <div className='title flex flex-col items-center'>
            <h4 className='text-5xl font-bold'>Register</h4>
            <span className='py-4 text-xl w-2/3 text-center text-grey-500'>Happy to join You !!</span>
          </div>
          <form className='py-1' onSubmit={formik.handleSubmit}>
            <div className='profile flex justify-center py-4'>
              <label htmlFor='profile'>
                <img src={file || avatar} className={styles.profile_img} alt="avatar" />
              </label>
              <input onChange={onUpload} type="file" id="profile" name="profile" />
            </div>
            <div className='textbox flex flex-col items-center gap-6'>
              <input className={styles.textbox} type="text" {...formik.getFieldProps('email')} placeholder="email" />
              <input className={styles.textbox} type="text" {...formik.getFieldProps('username')} placeholder="username" />
              <input className={styles.textbox} type="password" {...formik.getFieldProps('password')} placeholder="password" />
              <button className={styles.btn} type="submit">Register</button>
            </div>
            <div className='text-center py-4'>
              <span className='text-grey-500'>Already Register ? <Link className='text-red-500' to="/">Login Now</Link></span>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
