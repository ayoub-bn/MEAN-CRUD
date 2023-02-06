import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Username from './components/Username'
import Password from './components/Password'
import Register from './components/Register'
import Reset from './components/Reset'
import Profile from './components/Profile'
import Recovery from './components/Recovery'
import PageNotFound from './components/PageNotFound'




/** Auth Middleware */
import { AuthorizeUser, ProtectRoute } from './middleware/auth'



/** root routes */
const router = createBrowserRouter([
    {
        path: '/',
        element:<Username></Username>
    },
    {
        path: '/register',
        element:<Register></Register>
    },
    {
        path: '/profile',
        element:<AuthorizeUser><Profile></Profile></AuthorizeUser> 
    },
    {
        path: '/password',
        element:<ProtectRoute><Password></Password></ProtectRoute>
    },
    {
        path: '/recovery',
        element:<Recovery></Recovery>
    },
    {
        path: '/reset',
        element:<Reset></Reset>
    },
    {
        path: '*',
        element:<PageNotFound></PageNotFound>
    },
])

export default function App() {
    return (
        <main>
            <RouterProvider router={router}></RouterProvider>
        </main>
    )
}
