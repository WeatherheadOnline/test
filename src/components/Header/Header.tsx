'use client'

import React from 'react'
import './header.css'
import LogoutButton from '../LogoutButton/LogoutButton'
import { supabase } from '@/lib/supabase'


export default function Header() {
    return (
    <header>
        <div id="logo">
            <a className="navlink" id="homeLink" href="#Home">
                <img src="../../assets/01_logo.svg" />
            </a>
        </div>

        <nav>
            <a className="navlink" id="" href=""><p>Settings</p></a>
            <a className="navlink" id="" href="./dashboard"><p>Dashboard</p></a>
            <a className="navlink" id="" href="./"><p>Home</p></a>
            {/* <LogoutButton /> */}
            <button
                onClick={async () => {
                await supabase.auth.signOut()
                }}
            >
                Log out
            </button>
            <a className="navlink" id="portfolioLink" href=""><p>Theme switcher</p></a>
        </nav>

        {/* <div id="menu-wrapper">
            <div id="hamburger">
                <img src="../../assets/hamburger.png" />
            </div>
            <div id="menu">
                <span id="closeMenu">&times;</span>
                <a href="#Home"><h4>Home</h4></a>
                <a href="#About"><h4>About</h4></a>
                <a href="#Effects"><h4>Special Effects</h4></a>
                <a href="#Portfolio"><h4>Portfolio</h4></a>
                <a href="#Contact"><h4>Contact</h4></a>
            </div>
        </div>
        <p></p> */}
    </header>
  )
}