const express = require('express');
const router = express.Router();
const {getAllTickets,getOpenTickets,getClosedTickets,getByIdTicketDetails,getByIdPassengerDetails,updateTicketDetails,resetAllTickets,getAdminKeyDetails,deleteticketdetails,seedSeats}=require('../controllers/ticketcontroller');

router.get('/status/alltickets',getAllTickets);
router.get('/status/open', getOpenTickets);
router.get('/status/closed',getClosedTickets);
router.get('/:id',getByIdTicketDetails);
router.get('/:id/passengerdetails',getByIdPassengerDetails);
router.put('/:id/updateticketdetails',updateTicketDetails);
router.post('/admin/resetalltickets',resetAllTickets)
router.delete('/:id/deleteticketdetails',deleteticketdetails);
router.get('/admin/config', getAdminKeyDetails);
router.post('/seedseats',seedSeats);



module.exports=router;
