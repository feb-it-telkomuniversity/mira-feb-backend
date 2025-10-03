import { Router } from 'express';
import { getAllOpenTickets, getConversationDetails } from '../controller/ticket';

const route = Router()

route.get('/tickets', getAllOpenTickets)
route.get('/conversations/:id', getConversationDetails)

export default route