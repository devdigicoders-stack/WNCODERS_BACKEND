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
    console.log("--- SETUP ADMIN ---");
    const email = 'admin' + Date.now() + '@test.com';
    const regRes = await request('POST', '/api/admin/register', {
      name: 'Super Admin', email: email, password: 'password123'
    });
    const token = regRes.data.token;
    if (!token) {
      console.log("Failed to get token:", regRes.data);
      return;
    }
    console.log("Admin registered successfully.");

    console.log("\n--- TESTING CONSULTATIONS ---");
    // Public Create
    const cCreate = await request('POST', '/api/consultations', {
      fullName: 'John Doe', phoneNumber: '1234567890', message: 'Test consultation'
    });
    console.log("Create Consultation (Public):", cCreate.status === 201 ? "Success" : "Failed", cCreate.status);
    const cId = cCreate.data._id;
    // Private Get
    const cGet = await request('GET', '/api/consultations', null, token);
    console.log("Get Consultations (Protected):", cGet.status === 200 ? "Success" : "Failed", cGet.status);
    // Private Update
    const cUpdate = await request('PUT', `/api/consultations/${cId}`, { status: 'Reviewed' }, token);
    console.log("Update Consultation (Protected):", cUpdate.status === 200 ? "Success" : "Failed", cUpdate.status);
    // Private Delete
    const cDelete = await request('DELETE', `/api/consultations/${cId}`, null, token);
    console.log("Delete Consultation (Protected):", cDelete.status === 200 ? "Success" : "Failed", cDelete.status);

    console.log("\n--- TESTING MESSAGES ---");
    // Public Create
    const mCreate = await request('POST', '/api/messages', {
      name: 'Jane', email: 'jane@test.com', phoneNumber: '0987654321', subject: 'Hello', message: 'Hi there'
    });
    console.log("Create Message (Public):", mCreate.status === 201 ? "Success" : "Failed", mCreate.status);
    const mId = mCreate.data._id;
    // Private Get
    const mGet = await request('GET', '/api/messages', null, token);
    console.log("Get Messages (Protected):", mGet.status === 200 ? "Success" : "Failed", mGet.status);
    // Private Update
    const mUpdate = await request('PUT', `/api/messages/${mId}`, { status: 'Read' }, token);
    console.log("Update Message (Protected):", mUpdate.status === 200 ? "Success" : "Failed", mUpdate.status);
    // Private Delete
    const mDelete = await request('DELETE', `/api/messages/${mId}`, null, token);
    console.log("Delete Message (Protected):", mDelete.status === 200 ? "Success" : "Failed", mDelete.status);

    console.log("\n--- TESTING PROJECTS ---");
    // Protected Create
    const pCreate = await request('POST', '/api/projects', {
      title: 'Test Project', description: 'Test Desc', imageUrl: 'http://img.com', projectLink: 'http://link.com', technologies: ['Node', 'React']
    }, token);
    console.log("Create Project (Protected):", pCreate.status === 201 ? "Success" : "Failed", pCreate.status);
    const pId = pCreate.data._id;
    // Public Get
    const pGet = await request('GET', '/api/projects');
    console.log("Get Projects (Public):", pGet.status === 200 ? "Success" : "Failed", pGet.status);
    // Protected Update
    const pUpdate = await request('PUT', `/api/projects/${pId}`, { title: 'Updated Title' }, token);
    console.log("Update Project (Protected):", pUpdate.status === 200 ? "Success" : "Failed", pUpdate.status);
    // Protected Delete
    const pDelete = await request('DELETE', `/api/projects/${pId}`, null, token);
    console.log("Delete Project (Protected):", pDelete.status === 200 ? "Success" : "Failed", pDelete.status);

    console.log("\n--- TESTING TEAM MEMBERS ---");
    // Protected Create
    const tCreate = await request('POST', '/api/team-members', {
      name: 'Michael', role: 'CTO', description: 'Tech lead', imageUrl: 'http://img.com', category: 'Leadership'
    }, token);
    console.log("Create Team Member (Protected):", tCreate.status === 201 ? "Success" : "Failed", tCreate.status);
    const tId = tCreate.data._id;
    // Public Get
    const tGet = await request('GET', '/api/team-members');
    console.log("Get Team Members (Public):", tGet.status === 200 ? "Success" : "Failed", tGet.status);
    // Protected Update
    const tUpdate = await request('PUT', `/api/team-members/${tId}`, { status: 'Inactive', socialLinks: { linkedin: 'http://in' } }, token);
    console.log("Update Team Member (Protected):", tUpdate.status === 200 ? "Success" : "Failed", tUpdate.status);
    // Protected Delete
    const tDelete = await request('DELETE', `/api/team-members/${tId}`, null, token);
    console.log("Delete Team Member (Protected):", tDelete.status === 200 ? "Success" : "Failed", tDelete.status);

  } catch (error) {
    console.error("Test Failed with Error:", error);
  }
};

runTests();
