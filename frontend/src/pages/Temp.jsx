import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Temp = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-custom-green to-custom-pink font-sans">
      <header className="w-full bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold text-blue-900">SID 2021</div>
            </div>
            <nav className="flex space-x-4 text-blue-700">
              <a href="#" className="hover:underline">Home</a>
              <a href="#" className="hover:underline">About</a>
              <a href="#" className="hover:underline">Resource</a>
              <a href="#" className="hover:underline">Contact</a>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex flex-col items-center justify-center flex-grow text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-blue-900 mt-8">Safer Internet Day 2021</h1>
        <p className="text-xl md:text-2xl mt-4">February 9, 2021</p>
        <div className="mt-6">
          <img src="/lock.png" alt="Lock" className="h-32 mx-auto" />
        </div>
        <div className="flex items-center justify-center mt-4">
          <span className="text-4xl">*</span>
          <span className="text-4xl mx-1">*</span>
          <span className="text-4xl">*</span>
          <img src="/lock-icon.png" alt="Lock Icon" className="h-10 ml-2" />
        </div>
        <p className="text-lg text-blue-900 mt-6 max-w-xl">
          Whose main objective is to raise awareness of the importance of making the Internet a more secure digital platform.
        </p>
        <div className="flex space-x-4 mt-4 text-blue-900">
          <span>Responsible</span>
          <span>Respectful</span>
          <span>Creative</span>
        </div>
      </main>
      <footer className="w-full bg-white py-4">
        <div className="flex justify-center space-x-6">
          <FaFacebook className="text-blue-700 h-6 w-6" />
          <FaTwitter className="text-blue-700 h-6 w-6" />
          <FaInstagram className="text-blue-700 h-6 w-6" />
        </div>
      </footer>
    </div>
  );
}

export default Temp;
