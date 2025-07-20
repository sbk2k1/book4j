import { Router } from 'express';
import {
  createUser,
  recommendBook,
  getRecommendations,
  makeFriends
} from '../services/recommendation';

const router = Router();

router.post('/user', createUser);
router.post('/recommend', recommendBook);
router.get('/recommendations/:userId', getRecommendations);
router.post('/friend', makeFriends);

export default router;
