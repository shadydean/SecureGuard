import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom'
import sgLogo from '../assets/sgLogo.jpg';
import Login from '../components/Login';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
      
          <Login />
          <button onClick={onClose} className="float-right text-gray-600">&times;</button>
      </div>
    ,
    document.body
  );
};

const Temp = () => {
  const topPage = useRef(null);
  const aboutUs = useRef(null);
  const contactUs = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto text-black">
      <nav className="flex justify-between items-center py-3 sticky top-0 bg-white backdrop-blur-md z-10">
        <div className="flex items-center gap-x-2 py-1">
          <img src={sgLogo} alt="logo" className="w-8 h-8 rounded-full" />
          <button onClick={() => scrollToSection(topPage)} className="text-xl font-bold outline-none border-none">
            SecureGuard
          </button>
        </div>
        <div>
          <button className="mx-5 font-semibold px-2 py-2 rounded-lg hover:text-slate-900 hover:bg-white" onClick={() => scrollToSection(aboutUs)}>
            About us
          </button>
          <button className="mx-5 font-semibold px-2 py-2 rounded-lg hover:text-slate-900 hover:bg-white" onClick={() => scrollToSection(contactUs)}>
            Contact us
          </button>
          <button onClick={openModal} className="font-semibold mx-5 px-6 py-2 bg-blue-700 rounded-lg hover:bg-blue-600 shadow-md shadow-black">
            Login
          </button>
        </div>
      </nav>

      <section className="h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600" id="hero" ref={topPage}>
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Your Data, Our Priority</h1>
          <p className="text-lg mb-8">Keep your sensitive information safe with SecureGuard – our state-of-the-art encryption ensures your data remains private and protected.</p>
          <button onClick={openModal} className="bg-white text-blue-700 font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-gray-200">Get Started</button>
        </div>
      </section>

      <section className="py-20 bg-gray-100" id="features">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">Robust Encryption</h3>
              <p>SecureGuard uses industry-leading encryption technology to protect your data.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">User-Friendly Interface</h3>
              <p>Easily organize and access your files with our intuitive platform.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">Real-Time Monitoring</h3>
              <p>Stay informed with real-time monitoring and alerts for your data.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white" id="benefits">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">Data Security</h3>
              <p>Keep your sensitive information safe and secure from unauthorized access.</p>
            </div>
            <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">Privacy Protection</h3>
              <p>Your data privacy is our top priority, ensuring complete confidentiality.</p>
            </div>
            <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">Ease of Use</h3>
              <p>Our platform is designed for ease of use, making data management simple.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-100" id="testimonials">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <p className="mb-4">"SecureGuard has transformed the way we manage our data. It's incredibly secure and easy to use!"</p>
              <p className="font-bold">- Jane Doe</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <p className="mb-4">"I feel much safer knowing that my sensitive information is protected by SecureGuard."</p>
              <p className="font-bold">- John Smith</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <p className="mb-4">"The best data protection service I've used. Highly recommend SecureGuard!"</p>
              <p className="font-bold">- Mary Johnson</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white" id="contactUs" ref={contactUs}>
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Contact Us</h2>
          <p className="text-lg">For any inquiries or support, feel free to reach out to us.</p>
          <div className="mt-8">
            <button className="bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-blue-600" onClick={() => scrollToSection(contactUs)}>
              Get in Touch
            </button>
          </div>
        </div>
      </section>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" id="email" name="email" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" id="password" name="password" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" />
          </div>
          <button type="submit" className="w-full bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-blue-600">Login</button>
        </form>
      </Modal>
    </div>
  );
};

export default Temp;
