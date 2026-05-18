import * as heroSlideService from '../services/heroSlideService.js';

export const getAll = async (req, res) => {
  try {
    const slides = await heroSlideService.findAll();
    res.json(slides);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const slide = await heroSlideService.findById(req.params.id);
    if (!slide) return res.status(404).json({ error: 'Slide non trovata' });
    res.json(slide);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const create = async (req, res) => {
  try {
    const slide = await heroSlideService.create(req.body);
    res.status(201).json(slide);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const slide = await heroSlideService.update(req.params.id, req.body);
    res.json(slide);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    await heroSlideService.remove(req.params.id);
    res.json({ message: 'Slide eliminata' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
