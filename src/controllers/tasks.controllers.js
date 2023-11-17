import Tarea from "../models/tarea.model.js";

export const getTasks = async (req, res) => {
  try {
    const tasks = await Tarea.find({ user: req.user.id }).populate("user");
    res.json(tasks);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createTask = async (req, res) => {
  const { description } = req.body;
  console.log(description);

  const newTask = new Tarea({
    description,
    completada: false,
    user: req.user.id,
  });
  console.log(newTask);
  try {

    await newTask.save();
    res.json(newTask);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Tarea.findByIdAndDelete(req.params.id);
    if (!deletedTask)
      return res.status(404).json({ message: "Tarea not found" });

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { description, completada } = req.body;
    const taskUpdated = await Tarea.findOneAndUpdate(
      { _id: req.params.id },
      { description, completada },
      { new: true }
    );
    return res.json(taskUpdated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getTask = async (req, res) => {
  try {
    const task = await Tarea.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Tarea not found" });
    return res.json(task);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
