import { User } from '../models/User.js';

export const findAll = async () => User.find().select('-password');
