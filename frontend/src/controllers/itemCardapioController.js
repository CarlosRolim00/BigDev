import ItemCardapio from '../models/ItemCardapio.js';

export const createItemCardapio = async (req, res) => {
  try {
    const newItem = new ItemCardapio(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getItemCardapio = async (req, res) => {
  try {
    const items = await ItemCardapio.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateItemCardapio = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedItem = await ItemCardapio.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedItem) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteItemCardapio = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await ItemCardapio.findByIdAndDelete(id);
    if (!deletedItem) return res.status(404).json({ message: 'Item not found' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};