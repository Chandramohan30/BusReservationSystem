import { useState, useEffect } from 'react'
import axios from 'axios'
import config from '../config/config';   
const { BASE_URL } = config;

export default function ClosedTickets() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchClosedTickets = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/tickets/status/closed`)
      setTickets(res.data.data)
    } catch (error) {
      console.error('Failed to fetch Closed tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClosedTickets()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Loading Closed tickets...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Closed Tickets</h1>
        <p className="text-sm text-gray-500 mt-1">All available seats that are not yet booked</p>
      </div>

      {/* Table */}
      {tickets.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm font-medium">No Closed tickets available</p>
          <p className="text-gray-400 text-xs mt-1">All seats are currently booked</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

          {/* Table header row */}
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">
              Closed Seats
              <span className="ml-2 bg-green-50 text-green-600 text-xs font-medium px-2 py-0.5 rounded-full">
                {tickets.length}
              </span>
            </p>
          </div>

          <table className="w-full text-sm border border-black-200">
            <thead className="bg-gray-50 border-b border-black-100">
              <tr>
                <th className="text-left px-5 py-3 text-xs text-black-400 uppercase tracking-wider font-medium border-r border-black-200">Seat No.</th>
                <th className="text-left px-5 py-3 text-xs text-black-400 uppercase tracking-wider font-medium border-r border-black-200">Deck</th>
                <th className="text-left px-5 py-3 text-xs text-black-400 uppercase tracking-wider font-medium border-r border-black-200">Status</th>
                <th className="text-left px-5 py-3 text-xs text-black-400 uppercase tracking-wider font-medium border-r border-black-200">Passenger</th>
                <th className="text-left px-5 py-3 text-xs text-black-400 uppercase tracking-wider font-medium border-r border-black-200">Email</th>
                <th className="text-left px-5 py-3 text-xs text-black-400 uppercase tracking-wider font-medium border-r border-black-200">Booked At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black-300">
              {tickets.map((ticket) => (
                <tr key={ticket._id} className="hover:bg-gray-50 transition-colors">

                  {/* Seat Number */}
                  <td className="px-5 py-3.5 border-r border-black-100">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-green-50 text-green-700 text-xs font-semibold rounded-lg">
                      {ticket.seatNumber}
                    </span>
                  </td>

                  {/* Deck */}
                  <td className="px-5 py-3.5 border-r border-black-100">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full
                      ${ticket.seatNumber <= 20
                        ? 'bg-blue-50 text-blue-600'
                        : 'bg-purple-50 text-purple-600'}`}>
                      {ticket.seatNumber <= 20 ? 'Lower Deck' : 'Upper Deck'}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-3.5 border-r border-black-100">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      {ticket.status}
                    </span>
                  </td>

                  {/* Passenger */}
                  <td className="px-5 py-3.5 text-black-400 border-r border-black-100 text-xs">
                    {ticket.firstName+" "+ticket.lastName}
                  </td>

                  {/* Email */}
                  <td className="px-5 py-3.5 text-black-400  border-r border-black-100 text-xs ">
                    {ticket.email}
                  </td>

                  {/* Booked At */}
                   <td className="px-5 py-3.5 border-r border-black-100">
                    <div>
                      <p className="text-black-700 text-xs">
                        {new Date(ticket.bookedAt).toLocaleString('en-IN', {
                          timeZone: 'Asia/Kolkata',
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="text-gray-400  text-xs">
                        {new Date(ticket.bookedAt).toLocaleString('en-IN', {
                          timeZone: 'Asia/Kolkata',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </p>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}