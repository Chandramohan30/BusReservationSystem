import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

import config from '../config/config';
const { BASE_URL } = config;

export default function TopBar() {
  const [resetting, setResetting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleResetClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmReset = async () => {
    setShowConfirm(false);
    setResetting(true);

    try {

      const configRes = await axios.get(`${BASE_URL}/api/tickets/admin/config`);
      const adminKey = configRes.data.adminKey;

      await axios.post(`${BASE_URL}/api/tickets/admin/resetalltickets`, {}, {
        headers: {
          'x-admin-key': adminKey
        }
      });

      showToast('All tickets have been reset successfully.', 'success');
    } catch (error) {
      showToast('Reset failed. Please try again.', 'error');
    } finally {
      setResetting(false);
    }
  };

  return (
    <>
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[999] flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium
          ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.type === 'success'
            ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          }
          {toast.message}
        </div>
      )}

      {/* Confirm Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-[998] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl">
            <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900 text-center mb-1">Reset all tickets?</h3>
            <p className="text-sm text-gray-400 text-center mb-6">
              This will clear all passenger data and mark every seat as open. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 text-sm bg-gray-100 text-gray-700 py-2.5 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="flex-1 text-sm bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700 transition-colors font-medium">
                Yes, reset all
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TopBar */}
      <div className="w-full bg-white border-b border-gray-200 px-6 py-0 flex items-center justify-between h-14 sticky top-0 z-50">

        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
            <svg className="w-4 h-4" fill="white" viewBox="0 0 24 24">
              <path d="M4 16c0 1.1.9 2 2 2h1v1a1 1 0 002 0v-1h6v1a1 1 0 002 0v-1h1c1.1 0 2-.9 2-2V8H4v8zM4 6h16v1H4V6zm1-2h14l1 2H4l1-2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 leading-none">BusTicket</p>
            <p className="text-xs text-gray-400 leading-none mt-0.5">Management system</p>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex items-center gap-1">

          <NavLink to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors
              ${isActive ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`
            }>
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
            </svg>
            Dashboard
          </NavLink>

          <NavLink to="/reservation"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors
              ${isActive ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`
            }>
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 16c0 1.1.9 2 2 2h1v1a1 1 0 002 0v-1h6v1a1 1 0 002 0v-1h1c1.1 0 2-.9 2-2V8H4v8zM4 6h16v1H4V6zm1-2h14l1 2H4l1-2z" />
            </svg>
            Seat reservation
          </NavLink>

          {/* Divider */}
          <div className="w-px h-5 bg-gray-200 mx-1" />

          <NavLink to="/tickets/open"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors
              ${isActive ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`
            }>
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 12c0-1.1.9-2 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v4c1.1 0 2 .9 2 2s-.9 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2z" />
            </svg>
            Open tickets
          </NavLink>

          <NavLink to="/tickets/closed"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors
              ${isActive ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`
            }>
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            Closed tickets
          </NavLink>

        </nav>

        {/* Admin Reset Button */}
        <button
          onClick={handleResetClick}
          disabled={resetting}
          className="flex items-center gap-2 bg-red-50 hover:bg-red-100 rounded-lg px-3 py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {resetting
            ? <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
            : (
              <svg className="w-4 h-4 shrink-0" fill="#A32D2D" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
              </svg>
            )
          }
          <span className="text-sm font-medium text-red-700">
            {resetting ? 'Resetting...' : 'Admin reset'}
          </span>
        </button>

      </div>
    </>
  );
}

