const mongoose = require('mongoose')

const ticketSchema = new mongoose.Schema({
  seatNumber: { 
    type: Number, 
    required: true, 
    unique: true, 
    min: 1, 
    max: 40 
  },
  status: { 
    type: String, 
    enum: ['open', 'closed'], 
    default: 'open' 
  },
  firstName: { type: String, default: null },
  lastName:  { type: String, default: null },
  email:     { type: String, default: null },
  bookedAt:  { type: Date,   default: null },
}, { 
  timestamps: true  
});

module.exports = mongoose.model('Ticket', ticketSchema);


