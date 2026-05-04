import { useState, useEffect } from 'react'
import axios from 'axios'

import config from '../config/config';
const { BASE_URL } = config;

export default function Reservation() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSeat, setSelectedSeat] = useState(null)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' })
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchTickets = async () => {
    try {
      const openRes = await axios.get(`${BASE_URL}/tickets/status/open`)
      const closedRes = await axios.get(`${BASE_URL}/tickets/status/closed`)
      const all = [...openRes.data.data, ...closedRes.data.data]
      all.sort((a, b) => a.seatNumber - b.seatNumber)
      setTickets(all)
    } catch (error) {
      showToast('Failed to load seats', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTickets() }, [])

  const handleSeatClick = (ticket) => {
    if (ticket.status === 'closed') return
    setSelectedSeat(ticket)
    setForm({ firstName: '', lastName: '', email: '' })
  }

  const handleBook = async () => {
    if (!form.firstName || !form.lastName || !form.email) {
      showToast('Please fill all fields', 'error')
      return
    }
    setSubmitting(true)
    try {
      await axios.put(`${BASE_URL}/tickets/${selectedSeat._id}/updateticketdetails`, {
        status: 'closed',
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        bookedAt: new Date().toISOString()
      })
      showToast(`Seat ${selectedSeat.seatNumber} booked successfully!`)
      setSelectedSeat(null)
      fetchTickets()
    } catch (error) {
      showToast('Booking failed. Try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const lowerDeck = tickets.filter(t => t.seatNumber <= 20)
  const upperDeck = tickets.filter(t => t.seatNumber > 20)
  const openCount = tickets.filter(t => t.status === 'open').length
  const closedCount = tickets.filter(t => t.status === 'closed').length

  const chunkRows = (seats) => {
    const rows = []
    for (let i = 0; i < seats.length; i += 5) rows.push(seats.slice(i, i + 5))
    return rows
  }


  const SeatBox = ({ ticket }) => {
    const isBooked = ticket.status === 'closed'

    return (
      <button
        onClick={() => handleSeatClick(ticket)}
        disabled={isBooked}
        title={`Seat ${ticket.seatNumber} - ${isBooked ? 'Booked' : 'Available'}`}
        className={[

          'relative w-[88px] h-11 rounded-md p-0 border-none overflow-hidden bg-transparent transition-transform duration-100 flex-shrink-0',

          'hover:enabled:-translate-y-px hover:enabled:brightness-95 active:enabled:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-85',
        ].join(' ')}
      >
        {/* Outer shell */}
        <div
          className={[
            'absolute inset-0 rounded-md flex items-stretch',
            isBooked
              ? 'bg-[#fff1f2] border border-[#fca5a5]'
              : 'bg-[#f0fdf4] border border-[#6ee7b7]',
          ].join(' ')}
          style={{ borderWidth: '1.5px' }}
        >
          {/* Pillow end */}
          <div
            className={[
              'w-[22px] flex-shrink-0 rounded-l flex items-center justify-center',
              isBooked
                ? 'bg-[#fecdd3] border-r border-dashed border-[#fca5a5]'
                : 'bg-[#d1fae5] border-r border-dashed border-[#6ee7b7]',
            ].join(' ')}
          >
            <div
              className={[
                'w-[5px] h-[5px] rounded-full',
                isBooked ? 'bg-[#fda4af]' : 'bg-[#6ee7b7]',
              ].join(' ')}
            />
          </div>

          {/* Mattress */}
          <div className="flex-1 relative flex items-center justify-center">
            {/* Stitching border */}
            <div
              className={[
                'absolute inset-[6px] rounded-sm border border-dashed',
                isBooked ? 'border-[#fecdd3]' : 'border-[#a7f3d0]',
              ].join(' ')}
            />
            <span
              className={[
                'relative z-10 text-[11px] font-semibold leading-none',
                isBooked ? 'text-[#9f1239]' : 'text-[#065f46]',
              ].join(' ')}
            >
              {ticket.seatNumber}
            </span>
          </div>

          {/* Blanket / foot end */}
          <div
            className={[
              'w-3 flex-shrink-0 rounded-r',
              isBooked
                ? 'bg-[#fecaca] border-l border-[#fca5a5]'
                : 'bg-[#bbf7d0] border-l border-[#6ee7b7]',
            ].join(' ')}
          />
        </div>

        {/* Booked checkmark badge */}
        {isBooked && (
          <svg
            className="absolute top-1 right-[5px] w-3 h-3 z-10"
            viewBox="0 0 12 12"
            fill="none"
          >
            <circle
              cx="6" cy="6" r="5.5"
              fill="rgba(220,38,38,0.15)"
              stroke="#fca5a5"
              strokeWidth="0.5"
            />
            <path
              d="M3.5 6l1.8 1.8L8.5 4"
              stroke="#f43f5e"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
    )
  }

  const DeckLayout = ({ seats, label }) => {
    const rows = chunkRows(seats)
    return (
      <div className="bg-white border border-gray-200 rounded-xl mb-5 overflow-hidden">
        <div className="flex items-stretch">
          {/* Left stripe */}
          <div className="w-11 bg-gray-100 border-r border-gray-200 flex-shrink-0 flex flex-col items-center pt-3" />

          {/* Seat Grid */}
          <div className="flex-1 px-6 py-5">
            <p className="text-sm font-medium text-gray-500 mb-4">{label}</p>
            <div className="space-y-3">
              {rows.map((row, rowIdx) => (
                <div key={rowIdx} className="flex items-center gap-3">
                  {row.map((ticket, colIdx) => (
                    <div key={ticket._id} className="flex items-center gap-3">
                      {colIdx === 2 && <div className="w-5" />}
                      <SeatBox ticket={ticket} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Right door */}
          <div className="flex items-center justify-center flex-shrink-0 pr-3">
            <div className="flex items-center justify-center bg-gray-200 border border-gray-300 rounded w-[22px] h-14">
              <div className="bg-gray-400 rounded-full w-1 h-9" />
            </div>
          </div>
        </div>
      </div>
    )
  }


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Loading seats...</p>
        </div>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-gray-100 px-8 py-6">
      {/* Toast */}
      {toast && (
        <div
          className={[
            'fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium',
            toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white',
          ].join(' ')}
        >
          {toast.type === 'success' ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {toast.message}
        </div>
      )}

      {/* Banner */}
      <div className="w-full bg-red-500 text-white text-sm text-center py-2.5 rounded-lg mb-6 font-medium">
        Click on an Available seat to proceed with your transaction.
      </div>

      {/* Bus Layout */}
      <div className="max-w-2xl mx-auto">
        <DeckLayout seats={lowerDeck} label="Lower Deck" />
        <DeckLayout seats={upperDeck} label="Upper Deck" />

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-10 h-[22px] rounded-[5px] bg-[#f0fdf4] border border-[#6ee7b7]" />
            <span className="text-xs text-gray-500">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-[22px] rounded-[5px] bg-[#fff1f2] border border-[#fca5a5]" />
            <span className="text-xs text-gray-500">Booked</span>
          </div>
          <span className="text-xs text-green-600 font-semibold ml-4">{openCount} Available</span>
          <span className="text-xs text-red-500 font-semibold">{closedCount} Booked</span>
        </div>
      </div>

      {/* Booking Modal */}
      {selectedSeat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Book Seat</h2>
                <p className="text-sm text-gray-400 mt-0.5">
                  Seat number
                  <span className="ml-1 bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-lg">
                    {selectedSeat.seatNumber}
                  </span>
                </p>
              </div>
              <button
                onClick={() => setSelectedSeat(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">First Name</label>
                  <input
                    type="text"
                    placeholder="John"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Last Name</label>
                  <input
                    type="text"
                    placeholder="Doe"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setSelectedSeat(null)}
                className="flex-1 text-sm bg-gray-100 text-gray-700 py-2.5 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleBook}
                disabled={submitting}
                className="flex-1 text-sm bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {submitting ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}