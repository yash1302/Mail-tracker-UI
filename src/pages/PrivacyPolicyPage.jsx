import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      {" "}
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-6">Last updated: April 2026</p>

        <p className="mb-4">
          This application uses Google Sign-In and Gmail API to provide its core
          functionality.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          Information We Collect
        </h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Name and email address via Google Sign-In</li>
          <li>Gmail data only with your explicit consent</li>
          <li>Basic usage data for improving performance</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          Use of Google User Data
        </h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>We only access data required for functionality</li>
          <li>We do NOT sell or share your data</li>
          <li>We do NOT use data for advertising</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          How We Use Your Data
        </h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Authenticate users via Google OAuth</li>
          <li>Enable email features (send/read emails)</li>
          <li>Improve user experience</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">Security</h2>
        <p className="mb-4">
          We use industry-standard measures to protect your data.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">User Control</h2>
        <p className="mb-4">
          You can revoke access anytime from your Google account or request data
          deletion.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Contact</h2>
        <p>jadhavyash623@gmail.com</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
