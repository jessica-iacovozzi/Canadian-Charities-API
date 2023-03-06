import React from 'react';
import '../App.css';

function Navbar() {
  return(
    <div className='container'>
      <nav className="navbar navbar-expand red-bg shadow fixed-top">
        <div className="container py-2">
          <a className="navbar-brand text-white gothic" href="/">Charity Finder</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarResponsive">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item active">
                <a className="nav-link text-white gothic" href="/">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white gothic" href="/">About</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white gothic" href="/">Contact</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar;