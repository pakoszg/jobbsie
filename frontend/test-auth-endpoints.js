#!/usr/bin/env node
import axios from 'axios';

const API_BASE_URL = 'http://localhost:7000/api';
const TEST_USER = {
  email: 'test@example.com',
  password: 'testpassword123',
};

let authToken = null;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth interceptor
api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

async function login() {
  try {
    console.log('🔐 Logging in...');
    const response = await api.post('/auth/login', TEST_USER);
    authToken = response.data.token;
    console.log('✅ Login successful');
    console.log('📝 Token:', authToken.substring(0, 20) + '...');
    return authToken;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    throw error;
  }
}

async function testAuthenticatedEndpoint(
  endpoint,
  method = 'GET',
  data = null
) {
  try {
    console.log(`\n🧪 Testing ${method} ${endpoint}`);
    const response = await api.request({
      method,
      url: endpoint,
      data,
    });
    console.log('✅ Success:', response.status, response.statusText);
    console.log('📄 Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error(
      '❌ Failed:',
      error.response?.status,
      error.response?.statusText
    );
    console.error('📄 Error:', error.response?.data || error.message);
    throw error;
  }
}

async function testWithoutAuth(endpoint, method = 'GET') {
  try {
    console.log(`\n🚫 Testing ${method} ${endpoint} (without auth)`);
    const tempToken = authToken;
    authToken = null; // Remove auth temporarily

    const response = await api.request({
      method,
      url: endpoint,
    });
    console.log(
      '⚠️  Unexpected success (should have failed):',
      response.status
    );
    authToken = tempToken; // Restore auth
  } catch (error) {
    console.log(
      '✅ Correctly rejected:',
      error.response?.status,
      error.response?.statusText
    );
    authToken = tempToken; // Restore auth
  }
}

async function main() {
  try {
    // Test login
    await login();

    // Test authenticated endpoints
    await testAuthenticatedEndpoint('/auth/me');
    await testAuthenticatedEndpoint('/jobs', 'POST', {
      title: 'Test Job',
      company: 'Test Company',
      location: 'Test Location',
      description: 'Test Description',
      requirements: ['Test requirement'],
      salary: '$50,000',
      type: 'full-time',
    });

    // Test endpoints without auth (should fail)
    await testWithoutAuth('/auth/me');
    await testWithoutAuth('/jobs', 'POST');

    console.log('\n🎉 All tests completed!');
  } catch (error) {
    console.error('\n💥 Test suite failed:', error.message);
    process.exit(1);
  }
}

main();
