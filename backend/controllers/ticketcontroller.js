const ticketmodel = require('../models/ticketModel');

const getAllTickets = async (req, res, next) => {
    try {
        const alltickets = await ticketmodel.find({})
        const openTicketsCount = alltickets.filter(ticket => ticket.status === 'open').length
        const closedTicketsCount = alltickets.filter(ticket => ticket.status === 'closed').length
        return res.status(200).json({
            success: true,
            message: 'All seats fetched successfully',
            data: alltickets,
            counts: {
                openticketscount: openTicketsCount,
                closedticketscount: closedTicketsCount
            }


        });

    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch all seats',
            error: error.message
        });
    }
}

const getOpenTickets = async (req, res, next) => {
    try {
        const opentickets = await ticketmodel.find({ status: 'open' })
        return res.status(200).json({
            success: true,
            message: 'Open seats fetched successfully',
            data: opentickets
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch open seats',
            error: error.message
        });
    }
};

const getClosedTickets = async (req, res, next) => {
    try {
        const closedtickets = await ticketmodel.find({ status: 'closed' })
        return res.status(200).json({
            success: true,
            message: 'Closed seats fetched successfully',
            data: closedtickets
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch closed seats',
            error: error.message
        });
    }
};

const getByIdTicketDetails = async (req, res, next) => {
    try {
        const ticketid = req.params.id;

        const ticketdetail = await ticketmodel.findById(ticketid);

        if (!ticketdetail) {
            return res.status(404).json({
                success: false,
                message: 'Ticket not found',
                data: null
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Ticket details fetched successfully',
            data: ticketdetail
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch ticket details',
            error: error.message
        });
    }
};

const getByIdPassengerDetails = async (req, res, next) => {
    try {
        const ticketid = req.params.id;

        const ticketdetail = await ticketmodel.findById(ticketid);


        if (!ticketdetail) {
            return res.status(404).json({
                success: false,
                message: 'Ticket not found',
                data: null
            });
        }


        if (ticketdetail.status === 'open') {
            return res.status(400).json({
                success: false,
                message: 'No passenger found, seat is not booked yet',
                data: null
            });
        }


        const passengerdetails = {
            passengerseat: ticketdetail.seatNumber,
            passengername: ticketdetail.firstName + " " + ticketdetail.lastName,
            passengeremail: ticketdetail.email,
            passengerbookedat: ticketdetail.bookedAt
        };

        return res.status(200).json({
            success: true,
            message: 'Passenger details fetched successfully',
            data: passengerdetails
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch passenger details',
            error: error.message
        });
    }
};

const updateTicketDetails = async (req, res, next) => {
    try {
        const ticketid = req.params.id;
        const updatedTicketDetails = req.body;


        const ticketdetail = await ticketmodel.findById(ticketid);

        if (!ticketdetail) {
            return res.status(404).json({
                success: false,
                message: 'Ticket not found',
                data: null
            });
        }


        const updatedTicket = await ticketmodel.findByIdAndUpdate(
            ticketid,
            { $set: updatedTicketDetails },
            { returnDocument: 'after', runValidators: true }
        );

        return res.status(200).json({
            success: true,
            message: 'Ticket updated successfully',
            data: updatedTicket
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to update ticket',
            error: error.message
        });
    }
};

const resetAllTickets = async (req, res, next) => {
    try {
        const adminkey = req.headers['x-admin-key'];

        if (adminkey !== process.env.ADMIN_KEY) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
                data: null
            });
        }

        const newTickets = await ticketmodel.updateMany(
            {},
            {
                $set: {
                    status: 'open',
                    firstName: null,
                    lastName: null,
                    email: null,
                    bookedAt: null
                }
            }
        );

        return res.status(200).json({
            success: true,
            message: 'All 40 tickets have been reset successfully',
            data: newTickets.matchedCount
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to reset tickets',
            error: error.message
        });
    }
};


const getAdminKeyDetails = async (req, res, next) => {
    res.json({ adminKey: process.env.ADMIN_KEY });
}

const deleteticketdetails = async (req, res, next) => {
    try {
        const ticketid = req.params.id;


        const ticketdetail = await ticketmodel.findById(ticketid);

        if (!ticketdetail) {
            return res.status(404).json({
                success: false,
                message: 'Ticket not found',
                data: null
            });
        }


        await ticketmodel.findByIdAndDelete(ticketid);

        return res.status(200).json({
            success: true,
            message: 'Ticket deleted successfully',
            data: null
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to delete ticket',
            error: error.message
        });
    }
};


const seedSeats = async (req, res, next) => {
    try {
        const seats = Array.from({ length: 40 }, (_, i) => ({
            seatNumber: i + 1,
            status: 'open',
            firstName: null,
            lastName: null,
            email: null,
            bookedAt: null,
        }));

        const existingCount = await ticketmodel.countDocuments();

        if (existingCount > 0) {
            return res.status(200).json({
                success: true,
                message: 'Seats already exist, skipping seeding',
                data: existingCount
            });
        }

        const result = await ticketmodel.insertMany(seats);

        return res.status(201).json({
            success: true,
            message: 'Seats seeded successfully',
            data: result
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error seeding seats',
            error: error.message
        });
    }
};

module.exports = { getAllTickets, getOpenTickets, getClosedTickets, getByIdTicketDetails, getByIdPassengerDetails, updateTicketDetails, resetAllTickets, getAdminKeyDetails, deleteticketdetails, seedSeats };