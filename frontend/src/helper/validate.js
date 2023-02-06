import toast from "react-hot-toast"
import { authenticate } from "./helper.js";

/** validate login page username */
export async function usernameValidate(values)
{
    const error=usernameVerify({},values)

    if(values.username)
    {
        // check for use existance
        const { status }=await authenticate(values.username)

        if(status!==200)
        {
            error.exist=toast.error('user does not exist')
        }
    }

    return error;
}

/**validate page login password */
export async function passwordValidate(values)
{
    const error=passwordVerify({},values)
    return error;
}

/** validate reset password */
export async function resetPasswordValidation(values)
{
    const errors = passwordVerify({},values)

    if(values.password!==values.confirm_pwd)
    errors.exist = toast.error("passwords does not match")

    return errors;
}

/** validate register form */
export async function registerValidation(values)
{
    const errors = usernameVerify({},values)
    passwordVerify(errors,values)
    emailVerify(errors,values)
    return errors
}

/** validate profile pagr */
export async function profileValidation(values)
{
    const error=emailVerify({},values)
    return error
}

/** validate username */
function usernameVerify(error = {},values)
{
    if(!values.username)
    {
        error.username=toast.error("username required")
    }
    else
    {
        if(values.username.includes(" "))
        {
            error.username=toast.error("invalid username")
        }
    }
    return error
}

/** validate password */
function passwordVerify(error = {},values)
{
    const specialChars=/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    if(!values.password)
    {
        error.password=toast.error("password required")
    }
    else
    
        if(values.password.includes(" "))
        {
            error.password=toast.error("invalid password")
        }
    
    else 
    if(values.password.length < 3)
    {
        error.password=toast.error("password must be more than 3 caracters")
    }
   /* else
    if (!specialChars.test(values.password))
    error.password=toast.error("password must have special caracter")*/
    return error
}

/** validate email */
function emailVerify(errors={},values)
{
    const specialChars=/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/;
    if(!values.email)
    {
        errors.email=toast.error("email required")
    }
    else
    if (values.email.includes(" "))
    {
        errors.email=toast.error("email invalid, must not contain space")
    }
    else 
    if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)){
        errors.email = toast.error("Invalid email address...!")
    }

    return errors
}
