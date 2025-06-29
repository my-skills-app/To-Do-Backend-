const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let authToken = '';

// Test data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123'
};

const testTodo = {
  title: 'Test Todo',
  description: 'This is a test todo item',
  priority: 'high',
  status: 'pending'
};

// Helper function to make authenticated requests
const makeAuthRequest = async (method, url, data = null) => {
  const config = {
    method,
    url: `${BASE_URL}${url}`,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { 'Authorization': `Bearer ${authToken}` })
    }
  };
  
  if (data) {
    config.data = data;
  }
  
  return axios(config);
};

// Test functions
const testHealthCheck = async () => {
  try {
    console.log('🔍 Testing health check...');
    const response = await axios.get(`${BASE_URL.replace('/api', '')}/api/health`);
    console.log('✅ Health check passed:', response.data.message);
    return true;
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    return false;
  }
};

const testRegister = async () => {
  try {
    console.log('🔍 Testing user registration...');
    const response = await makeAuthRequest('POST', '/auth/register', testUser);
    console.log('✅ Registration successful:', response.data.message);
    return true;
  } catch (error) {
    if (error.response?.data?.message?.includes('already exists')) {
      console.log('ℹ️  User already exists, proceeding to login...');
      return true;
    }
    console.log('❌ Registration failed:', error.response?.data?.message || error.message);
    return false;
  }
};

const testLogin = async () => {
  try {
    console.log('🔍 Testing user login...');
    const response = await makeAuthRequest('POST', '/auth/login', {
      email: testUser.email,
      password: testUser.password
    });
    authToken = response.data.token;
    console.log('✅ Login successful:', response.data.message);
    return true;
  } catch (error) {
    console.log('❌ Login failed:', error.response?.data?.message || error.message);
    return false;
  }
};

const testCreateTodo = async () => {
  try {
    console.log('🔍 Testing todo creation...');
    const response = await makeAuthRequest('POST', '/todos', testTodo);
    console.log('✅ Todo created successfully:', response.data.message);
    return response.data.data._id;
  } catch (error) {
    console.log('❌ Todo creation failed:', error.response?.data?.message || error.message);
    return null;
  }
};

const testGetTodos = async () => {
  try {
    console.log('🔍 Testing get todos...');
    const response = await makeAuthRequest('GET', '/todos');
    console.log('✅ Get todos successful:', `${response.data.data.length} todos found`);
    return true;
  } catch (error) {
    console.log('❌ Get todos failed:', error.response?.data?.message || error.message);
    return false;
  }
};

const testUpdateTodo = async (todoId) => {
  try {
    console.log('🔍 Testing todo update...');
    const updateData = {
      title: 'Updated Test Todo',
      description: 'This todo has been updated',
      status: 'in-progress'
    };
    const response = await makeAuthRequest('PUT', `/todos/${todoId}`, updateData);
    console.log('✅ Todo updated successfully:', response.data.message);
    return true;
  } catch (error) {
    console.log('❌ Todo update failed:', error.response?.data?.message || error.message);
    return false;
  }
};

const testDeleteTodo = async (todoId) => {
  try {
    console.log('🔍 Testing todo deletion...');
    const response = await makeAuthRequest('DELETE', `/todos/${todoId}`);
    console.log('✅ Todo deleted successfully:', response.data.message);
    return true;
  } catch (error) {
    console.log('❌ Todo deletion failed:', error.response?.data?.message || error.message);
    return false;
  }
};

// Main test function
const runTests = async () => {
  console.log('🚀 Starting API Tests...\n');
  
  // Wait for server to start
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const tests = [
    { name: 'Health Check', fn: testHealthCheck },
    { name: 'User Registration', fn: testRegister },
    { name: 'User Login', fn: testLogin },
    { name: 'Create Todo', fn: testCreateTodo },
    { name: 'Get Todos', fn: testGetTodos }
  ];
  
  let todoId = null;
  
  for (const test of tests) {
    console.log(`\n📋 Running: ${test.name}`);
    const result = await test.fn();
    
    if (test.name === 'Create Todo' && result) {
      todoId = result;
    }
    
    if (!result) {
      console.log(`\n❌ Test failed: ${test.name}`);
      break;
    }
  }
  
  if (todoId) {
    console.log('\n📋 Running: Update Todo');
    await testUpdateTodo(todoId);
    
    console.log('\n📋 Running: Delete Todo');
    await testDeleteTodo(todoId);
  }
  
  console.log('\n🎉 API Tests completed!');
};

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests }; 