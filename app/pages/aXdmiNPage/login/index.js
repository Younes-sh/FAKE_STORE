import React from 'react'

export default function index() {


    const adminLogin = async () => {
        const res = await fetch('')
    }
  return (
    <div className='container main'>
        <h1>Login</h1>
        <form>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" required />
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" required />
            <button type="submit">Login</button>
        </form>
    </div>
  )
}
