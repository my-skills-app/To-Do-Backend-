const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middlewares/authMiddleware');
const {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
  toggleTodo
} = require('../controllers/todoController');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// Validation middleware
const todoValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot be more than 500 characters'),
  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed'])
    .withMessage('Status must be pending, in-progress, or completed'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),
  body('isCompleted')
    .optional()
    .isBoolean()
    .withMessage('isCompleted must be a boolean value')
];

const updateTodoValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot be more than 500 characters'),
  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed'])
    .withMessage('Status must be pending, in-progress, or completed'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),
  body('isCompleted')
    .optional()
    .isBoolean()
    .withMessage('isCompleted must be a boolean value')
];

// @route   POST /api/todos
// @desc    Create a new todo
// @access  Private
router.post('/', todoValidation, createTodo);

// @route   GET /api/todos
// @desc    Get all todos for authenticated user
// @access  Private
router.get('/', getTodos);

// @route   GET /api/todos/:id
// @desc    Get single todo by ID
// @access  Private
router.get('/:id', getTodoById);

// @route   PUT /api/todos/:id
// @desc    Update todo
// @access  Private
router.put('/:id', updateTodoValidation, updateTodo);

// @route   DELETE /api/todos/:id
// @desc    Delete todo
// @access  Private
router.delete('/:id', deleteTodo);

// @route   PATCH /api/todos/:id/toggle
// @desc    Toggle todo completion status
// @access  Private
router.patch('/:id/toggle', toggleTodo);

module.exports = router; 