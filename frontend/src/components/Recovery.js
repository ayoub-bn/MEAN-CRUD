import React, { useEffect, useState } from 'react'
import { useAuthStore } from '../store/store'
import toast, { Toaster } from 'react-hot-toast'
import {useNavigate} from'react-router-dom'

import styles from '../styles/Username.module.css'
import { generateOTP, verifyOTP } from '../helper/helper'


export default function Recovery() {

  const { username } = useAuthStore(state => state.auth);
  const [OTP, setOTP] = useState();
  const navigate = useNavigate()

  useEffect(() => {
    generateOTP(username).then((OTP) => {
      //console.log(OTP)
      if(OTP) return toast.success('OTP has been send to your email!');
      return toast.error('Problem while generating OTP!')
    })
  }, [username]);

  async function onSubmit(e){
    e.preventDefault();

    try {
      let { status } = await verifyOTP({ username, code : OTP })
      if(status === 201){
        toast.success('Verify Successfully!')
        return navigate('/reset')
      }  
    } catch (error) {
      return toast.error('Wront OTP! Check email again!')
    }
  }

  // handler of resend OTP
  function resendOTP()
  {
    let sendPromise= generateOTP(username)
    toast.promise(sendPromise,{
      loading:"sending...",
      success:<b>Code has been sent Again...</b>,
      error:<b>Could Not send Code !!!</b>
    })

    sendPromise.then(OTP=>{
      //console.log(OTP)
    })
  }


  return (
    <div className="container mx-auto">

      <Toaster position='top-center' reverseOrder={false}></Toaster>


      <div className='flex justify-center items-center h-screen'>
        <div className={styles.glass}>
          <div className='title flex flex-col items-center'>
            <h4 className='text-5xl font-bold'>Recover Password</h4>
            <span className='py-4 text-xl w-2/3 text-center text-grey-500'>Enter email to recover password</span>
          </div>
          <form className='pt-5' onSubmit={onSubmit}>

            <div className='textbox flex flex-col items-center gap-6'>
              <div className='input text-center'>
                <span className=' text-sm text-left text-gray-500'>enter the code you got in the mail</span>
                <input onChange={(e) => setOTP(e.target.value)} className={styles.textbox} type="text" placeholder="OTP" />
              </div>

              <button className={styles.btn} type="submit">Recover</button>
            </div>
            
          </form>

          <div className='text-center py-4'>
              <span className='text-grey-500'>Didn't get the code? <button onClick={resendOTP} className='text-red-500'>Resend</button></span>
            </div>

        </div>
      </div>
    </div>
  )
}
