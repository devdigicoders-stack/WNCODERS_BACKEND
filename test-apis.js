const http = require('http');

const request = (method, path, body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

const runTests = async () => {
  try {
    console.log("1. Testing Registration...");
    const email = 'test' + Date.now() + '@example.com';
    const regRes = await request('POST', '/api/admin/register', {
      name: 'Test Admin',
      email: email,
      password: 'password123'
    });
    console.log("Status:", regRes.status);
    console.log("Data:", regRes.data);
    
    const token = regRes.data.token;
    if (!token) {
        console.log("Failed to get token, stopping tests.");
        return;
    }

    console.log("\n2. Testing Get Profile...");
    const profileRes = await request('GET', '/api/admin/profile', null, token);
    console.log("Status:", profileRes.status);
    console.log("Data:", profileRes.data);

    console.log("\n3. Testing Update Profile...");
    const updateRes = await request('PUT', '/api/admin/profile', {
      name: 'Updated Admin Name'
    }, token);
    console.log("Status:", updateRes.status);
    console.log("Data:", updateRes.data);

    console.log("\n4. Testing Change Password...");
    const cpRes = await request('PUT', '/api/admin/change-password', {
      currentPassword: 'password123',
      newPassword: 'newpassword456'
    }, token);
    console.log("Status:", cpRes.status);
    console.log("Data:", cpRes.data);

    console.log("\n5. Testing Login with New Password...");
    const loginRes = await request('POST', '/api/admin/login', {
      email: email,
      password: 'newpassword456'
    });
    console.log("Status:", loginRes.status);
    console.log("Data:", loginRes.data);
    
  } catch (error) {
    console.error("Test Failed:", error);
  }
};

runTests();
