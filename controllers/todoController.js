const { validationResult } = require('express-validator');
const Todo = require('../models/Todo');

// @desc    Create a new todo
// @route   POST /api/todos
// @access  Private
const createTodo = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { title, description, status, priority, dueDate } = req.body;

    const todo = await Todo.create({
      title,
      description,
      status,
      priority,
      dueDate,
      user: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      data: todo
    });
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({ message: 'Server error while creating todo' });
  }
};

// @desc    Get all todos for authenticated user
// @route   GET /api/todos
// @access  Private
const getTodos = async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    // Build filter object
    const filter = { user: req.user._id };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const todos = await Todo.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'name email');

    const total = await Todo.countDocuments(filter);

    res.json({
      success: true,
      data: todos,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({ message: 'Server error while fetching todos' });
  }
};

// @desc    Get single todo by ID
// @route   GET /api/todos/:id
// @access  Private
const getTodoById = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id).populate('user', 'name email');

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    // Check if todo belongs to the authenticated user
    if (todo.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this todo' });
    }

    res.json({
      success: true,
      data: todo
    });
  } catch (error) {
    console.error('Get todo by ID error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.status(500).json({ message: 'Server error while fetching todo' });
  }
};

// @desc    Update todo
// @route   PUT /api/todos/:id
// @access  Private
const updateTodo = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    let todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    // Check if todo belongs to the authenticated user
    if (todo.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this todo' });
    }

    const { title, description, status, priority, dueDate, isCompleted } = req.body;

    // Update todo
    todo = await Todo.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        status,
        priority,
        dueDate,
        isCompleted
      },
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    res.json({
      success: true,
      message: 'Todo updated successfully',
      data: todo
    });
  } catch (error) {
    console.error('Update todo error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.status(500).json({ message: 'Server error while updating todo' });
  }
};

// @desc    Delete todo
// @route   DELETE /api/todos/:id
// @access  Private
const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    // Check if todo belongs to the authenticated user
    if (todo.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this todo' });
    }

    await Todo.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Todo deleted successfully'
    });
  } catch (error) {
    console.error('Delete todo error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.status(500).json({ message: 'Server error while deleting todo' });
  }
};

// @desc    Toggle todo completion status
// @route   PATCH /api/todos/:id/toggle
// @access  Private
const toggleTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    // Check if todo belongs to the authenticated user
    if (todo.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this todo' });
    }

    // Toggle completion status
    todo.isCompleted = !todo.isCompleted;
    todo.status = todo.isCompleted ? 'completed' : 'pending';
    
    await todo.save();

    res.json({
      success: true,
      message: 'Todo status toggled successfully',
      data: todo
    });
  } catch (error) {
    console.error('Toggle todo error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.status(500).json({ message: 'Server error while toggling todo' });
  }
};

module.exports = {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
  toggleTodo
}; 