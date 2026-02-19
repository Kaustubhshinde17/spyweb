// Simple fetch wrapper since node-fetch might not be installed or ESM
const http = require('http');

function request(url, method, body, headers = {}) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: urlObj.pathname + urlObj.search,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, body: data ? JSON.parse(data) : {} });
                } catch (e) {
                    console.log("Raw body:", data);
                    resolve({ status: res.statusCode, body: data });
                }
            });
        });

        req.on('error', reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function runTest() {
    // Use 127.0.0.1 to avoid IPv6 issues
    const API_URL = 'http://127.0.0.1:5000/api';
    const BASE_URL = 'http://127.0.0.1:5000';
    const TIMESTAMP = Date.now();

    console.log("0️⃣ Checking Server Status...");
    try {
        const health = await request(`${BASE_URL}/health`, 'GET');
        console.log(`   Health Check: ${health.status}`);
        if (health.status !== 200) throw new Error("Server not healthy");
    } catch (e) {
        console.error("❌ Server Unreachable. Is it running?");
        throw e;
    }

    console.log("1️⃣ Registering new client...");
    const clientData = {
        name: `Test Client ${TIMESTAMP}`,
        email: `client${TIMESTAMP}@test.com`,
        password: 'password123',
        company: 'Test Corp',
        phone: '1234567890'
    };

    let res = await request(`${API_URL}/clients/auth/signup`, 'POST', clientData);
    let token = res.body.token;

    if (!token && res.status === 400) {
        // Maybe already exists, try login
        console.log("   Client exists, logging in...");
        res = await request(`${API_URL}/clients/auth/login`, 'POST', {
            email: clientData.email,
            password: clientData.password
        });
        token = res.body.token;
    }

    if (!token) {
        console.error("❌ Failed to get token", res.body);
        return;
    }
    console.log("✅ Client logged in.");

    console.log("\n2️⃣ Creating Support Ticket...");
    res = await request(`${API_URL}/messages`, 'POST', {
        subject: `Help me ${TIMESTAMP}`,
        content: "I need assistance with my project."
    }, { Authorization: `Bearer ${token}` });

    const ticketId = res.body._id;
    if (!ticketId) {
        console.error("❌ Failed to create ticket. Status:", res.status);
        console.error("Body:", JSON.stringify(res.body, null, 2));
        return;
    }
    console.log(`✅ Ticket created: ${ticketId}`);

    console.log("\n3️⃣ Admin: Fetching all tickets...");
    res = await request(`${API_URL}/messages/admin/all`, 'GET');
    const adminTickets = res.body;
    const found = adminTickets.find(t => t._id === ticketId);

    if (found) {
        console.log("✅ Admin sees the new ticket.");
    } else {
        console.error("❌ Admin DID NOT see the ticket.");
        return;
    }

    console.log("\n4️⃣ Admin: Replying to ticket...");
    res = await request(`${API_URL}/messages/${ticketId}/reply`, 'PUT', {
        reply: "We are looking into it.",
        status: "In Progress"
    });

    if (res.status === 200) {
        console.log("✅ Admin reply sent.");
    } else {
        console.error("❌ Admin reply failed", res.body);
        return;
    }

    console.log("\n5️⃣ Client: Checking for reply...");
    res = await request(`${API_URL}/messages`, 'GET', null, { Authorization: `Bearer ${token}` });
    const clientTickets = res.body;
    const updatedTicket = clientTickets.find(t => t._id === ticketId);

    if (updatedTicket.adminReply === "We are looking into it." && updatedTicket.status === "In Progress") {
        console.log("✅ Client sees the reply and status change.");
        console.log("🎉 VERIFICATION SUCCESSFUL!");
    } else {
        console.error("❌ verification failed:", updatedTicket);
    }
}

runTest().catch(err => console.error("FATAL ERROR:", err));
