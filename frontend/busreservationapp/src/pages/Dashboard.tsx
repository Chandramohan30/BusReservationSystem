import { useState, useEffect } from 'react'
import axios from 'axios'

import config from '../config/config';
const { BASE_URL } = config;


interface Passenger {
  _id: string
  seatNumber: number
  firstName: string
  lastName: string
  email: string
  status: 'open' | 'closed'
  bookedAt: string | null
}

interface EditForm {
  firstName: string
  lastName: string
  email: string
  status: 'open' | 'closed'
}

interface TicketCounts {
  openticketscount: number
  closedticketscount: number
}

interface Toast {
  message: string
  type: 'success' | 'error'
}



export default function Dashboard() {
  const [passengers, setPassengers] = useState<Passenger[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<EditForm>({
    firstName: '',
    lastName: '',
    email: '',
    status: 'open',
  })
  const [loading, setLoading] = useState<boolean>(true)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [saveLoading, setSaveLoading] = useState<boolean>(false)
  const [ticketsCounts, setTicketsCounts] = useState<TicketCounts>({
    openticketscount: 0,
    closedticketscount: 0,
  })
  const [toast, setToast] = useState<Toast | null>(null)

  const showToast = (message: string, type: 'success' | 'error' = 'success'): void => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchPassengers = async (): Promise<void> => {
    try {
      const res = await axios.get<{ data: Passenger[]; counts: TicketCounts }>(
        `${BASE_URL}/api/tickets/status/alltickets`
      )
      const sortedPassengers = [...res.data.data].sort(
      (a, b) => a.seatNumber - b.seatNumber
    )

    setPassengers(sortedPassengers)
      setTicketsCounts(res.data.counts)
    } catch (error) {
      console.error('Failed to fetch passengers:', error)
      showToast('Failed to fetch passengers', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPassengers()
  }, [])

  const handleEdit = (passenger: Passenger): void => {
    setEditingId(passenger._id)
    setEditForm({
      firstName: passenger.firstName,
      lastName: passenger.lastName,
      email: passenger.email,
      status: passenger.status,
    })
  }

  const handleSave = async (id: string): Promise<void> => {
    setSaveLoading(true)
    try {
      await axios.put(`${BASE_URL}/api/tickets/${id}/updateticketdetails`, editForm)
      setEditingId(null)
      fetchPassengers()
      showToast('Passenger details updated successfully')
    } catch (error) {
      console.error('Failed to update passenger:', error)
      showToast('Failed to update passenger', 'error')
    } finally {
      setSaveLoading(false)
    }
  }

  const handleCancel = (): void => {
    setEditingId(null)
    setEditForm({ firstName: '', lastName: '', email: '', status: 'open' })
  }

  const handleDelete = async (id: string): Promise<void> => {
    try {
      await axios.delete(`${BASE_URL}/api/tickets/${id}/deleteticketdetails`)
      setDeleteConfirmId(null)
      fetchPassengers()
      showToast('Reservation deleted successfully')
    } catch (error) {
      console.error('Failed to delete:', error)
      showToast('Failed to delete reservation', 'error')
    }
  }

  const totalSeats = 40
  const bookedSeats: number = ticketsCounts.closedticketscount ?? 0
  const availableSeats: number = ticketsCounts.openticketscount ?? 0
  const occupancyPercent: number =
    totalSeats > 0 ? Math.round((bookedSeats / totalSeats) * 100) : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-400 text-sm">Loading passengers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-all
            ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
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

      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Passenger Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Manage all reservations and passenger details</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total Seats</p>
          <p className="text-2xl font-semibold text-gray-900">{totalSeats}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Booked</p>
          <p className="text-2xl font-semibold text-blue-600">{bookedSeats}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Available</p>
          <p className="text-2xl font-semibold text-green-600">{availableSeats}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Occupancy</p>
          <p className="text-2xl font-semibold text-gray-900">{occupancyPercent}%</p>
          <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all"
              style={{ width: `${occupancyPercent}%` }}
            />
          </div>
        </div>
      </div>

      {passengers.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm font-medium">No passengers booked yet</p>
          <p className="text-gray-400 text-xs mt-1">Reservations will appear here once booked</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">
              All Tickets
              <span className="ml-2 bg-blue-50 text-blue-600 text-xs font-medium px-2 py-0.5 rounded-full">
                {passengers.length}
              </span>
            </p>
          </div>

          <table className="w-full text-sm border border-black-200">
            <thead className="bg-gray-50 border-b border-black-100">
              <tr>
                <th className="text-left px-5 py-3 text-xs text-gray-700 uppercase tracking-wider font-bold border-r border-black-200">Seat</th>
                <th className="text-left px-5 py-3 text-xs text-gray-700 uppercase tracking-wider font-bold border-r border-black-200">First Name</th>
                <th className="text-left px-5 py-3 text-xs text-gray-700 uppercase tracking-wider font-bold border-r border-black-200">Last Name</th>
                <th className="text-left px-5 py-3 text-xs text-gray-700 uppercase tracking-wider font-bold border-r border-black-200">Email</th>
                <th className="text-left px-5 py-3 text-xs text-gray-700 uppercase tracking-wider font-bold border-r border-black-200">Booked At</th>
                <th className="text-left px-5 py-3 text-xs text-gray-700 uppercase tracking-wider font-bold border-r border-black-200">Status</th>
                <th className="text-left px-5 py-3 text-xs text-gray-700 uppercase tracking-wider font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black-300">
              {passengers.map((p: Passenger) => (
                <tr
                  key={p._id}
                  className={`hover:bg-gray-50 transition-colors ${editingId === p._id ? 'bg-blue-50/30' : ''}`}
                >

                  {/* Seat */}
                  <td className="px-5 py-3.5 border-r border-black-100">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg">
                      {p.seatNumber}
                    </span>
                  </td>

                  {/* First Name */}
                  <td className="px-5 py-3.5 border-r border-black-100">
                    {editingId === p._id ? (
                      <input
                        className="border border-blue-300 rounded-lg px-3 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        value={editForm.firstName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setEditForm({ ...editForm, firstName: e.target.value })
                        }
                      />
                    ) : (
                      <span className="text-black-800">{p.firstName}</span>
                    )}
                  </td>

                  {/* Last Name */}
                  <td className="px-5 py-3.5 border-r border-black-100">
                    {editingId === p._id ? (
                      <input
                        className="border border-blue-300 rounded-lg px-3 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        value={editForm.lastName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setEditForm({ ...editForm, lastName: e.target.value })
                        }
                      />
                    ) : (
                      <span className="text-black-800">{p.lastName}</span>
                    )}
                  </td>

                  {/* Email */}
                  <td className="px-5 py-3.5 border-r border-black-100">
                    {editingId === p._id ? (
                      <input
                        className="border border-blue-300 rounded-lg px-3 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        value={editForm.email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setEditForm({ ...editForm, email: e.target.value })
                        }
                      />
                    ) : (
                      <span className="text-black-500">{p.email}</span>
                    )}
                  </td>

                  {/* Booked At */}
                  <td className="px-5 py-3.5 border-r border-black-100">
                    <div>
                      {p.bookedAt ? (
                        <>
                          <p className="text-black-700 text-xs">
                            {new Date(p.bookedAt).toLocaleString('en-IN', {
                              timeZone: 'Asia/Kolkata',
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {new Date(p.bookedAt).toLocaleString('en-IN', {
                              timeZone: 'Asia/Kolkata',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true,
                            })}
                          </p>
                        </>
                      ) : (
                        <p className="text-black-400 text-xs">Not yet booked</p>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-3.5 border-r border-black-100">
                    {editingId === p._id ? (
                      <select
                        className="border border-blue-300 rounded-lg px-3 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        value={editForm.status}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          setEditForm({
                            ...editForm,
                            status: e.target.value as 'open' | 'closed',
                          })
                        }
                      >
                        <option value="open">open</option>
                        <option value="closed">closed</option>
                      </select>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        {p.status}
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3.5 border-r border-black-100">
                    {editingId === p._id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSave(p._id)}
                          disabled={saveLoading}
                          className="flex items-center gap-1.5 text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                          {saveLoading ? (
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="flex items-center gap-1.5 text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(p._id)}
                          className="flex items-center gap-1.5 text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirmId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.4)' }}
        >
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-xl">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">Delete reservation</h3>
            <p className="text-sm text-gray-500 mb-5">
              This will permanently remove the reservation. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 text-sm bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 text-sm bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
