'use client'

import { useEffect } from 'react'
import './signup.css'

export default function Home() {

    return (
        <main>
            <section className="page-section">
                <div className="section-wrapper">
                    <h1>Sign up</h1>
                    <form>
                        <label>
                            Email
                            <input type="email"></input>
                        </label>
                        <label>
                            Username
                            <input type="text"></input>
                        </label>
                        <label>
                            Password
                            <input type="password"></input>
                        </label>
                        <label>
                            Confirm password
                            <input type="password"></input>
                        </label>
                        <button type="submit">Submit</button>
                        <button onClick={()=> window.location.href='../'}>Cancel</button>
                    </form>
                </div>
            </section>
        </main>
)
}