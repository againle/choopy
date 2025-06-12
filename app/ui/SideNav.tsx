// /app/ui/SideNav.tsx
import React from 'react';
import Link from 'next/link';

interface SideNavProps {
  onClose?: () => void; 
}

export default function SideNav({ onClose }: SideNavProps) {
  return (
    <div className="side-nav">
      <nav>
        <ul>
          <li>
            <Link  
              href = "/"
              className="flex items-center justify-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold text-sm sm:text-base shadow-md hover:scale-105 hover:brightness-110 transition-transform transition-shadow duration-200"
            >
              Home
            </Link>
          </li>
          <li>
            <Link  
              href = "/main"
              className="flex items-center justify-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold text-sm sm:text-base shadow-md hover:scale-105 hover:brightness-110 transition-transform transition-shadow duration-200"
            >
              Main
            </Link>
          </li>
          <li>
            <Link  
              href = "/local"
              className="flex items-center justify-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold text-sm sm:text-base shadow-md hover:scale-105 hover:brightness-110 transition-transform transition-shadow duration-200"
            >
              Local
            </Link>
          </li>
        </ul>
      </nav>
      {/* Optional close button for mobile */}
      {onClose && (
        <button
          className="close-btn"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          ·
        </button>
      )}
      <style jsx>{`
        .side-nav {
          position: fixed;
          top: 0;
          left: 0;
          height: 100%;
          width: 250px;
          background-color: #fff;
          box-shadow: 2px 0 5px rgba(0,0,0,0.3);
          padding: 1rem;
          z-index: 1000;
          transform: translateX(0);
          transition: transform 0.3s ease-in-out;
        }
        /* Optional: add transition for slide-in effect if toggling visibility */
        nav ul {
          list-style: none;
          padding: 0;
        }
        nav ul li {
          margin: 1rem 0;
        }
        nav ul li a {
          text-decoration: none;
          color: #333;
        }
        .close-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background: transparent;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
