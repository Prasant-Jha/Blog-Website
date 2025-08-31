import React from "react";

const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6 text-center">About Us</h1>

      <p className="text-lg text-gray-700 mb-6">
        Welcome to our platform! We are dedicated to providing high-quality, user-friendly, and modern web solutions tailored to your needs.
      </p>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
        <p className="text-gray-700">
          Our mission is to empower individuals and businesses through accessible and efficient digital tools. We believe in building applications that are both powerful and simple to use.
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">What We Offer</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>Custom web applications</li>
          <li>Mobile-friendly designs</li>
          <li>Secure backend integration</li>
          <li>Continuous improvement and support</li>
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">Our Team</h2>
        <p className="text-gray-700">
          Our team is composed of experienced developers, designers, and strategists who are passionate about crafting exceptional digital experiences.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
