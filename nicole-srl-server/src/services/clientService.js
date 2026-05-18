import { Client } from '../models/Client.js';

export const findAll = async () => Client.find().sort({ createdAt: -1 });

export const findById = async (id) => Client.findById(id);

export const create = async (data) => {
  const client = new Client(data);
  await client.save();
  return client;
};

export const update = async (id, data) => Client.findByIdAndUpdate(id, data, { new: true });

export const remove = async (id) => Client.findByIdAndDelete(id);
