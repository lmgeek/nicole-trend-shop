import * as categoryService from '../services/categoryService.js';

export const getAll = async (req, res) => {
  try {
    const categories = await categoryService.findAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getEnabled = async (req, res) => {
  try {
    const categories = await categoryService.findEnabled();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const category = await categoryService.findById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Categoria non trovata' });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const create = async (req, res) => {
  try {
    const category = await categoryService.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const category = await categoryService.update(req.params.id, req.body);
    res.json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    await categoryService.remove(req.params.id);
    res.json({ message: 'Categoria eliminata' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
