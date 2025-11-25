/**
 * Seed Data Script
 * สร้างข้อมูล tickets ตัวอย่างสำหรับทดสอบ
 * 
 * Usage:
 *   npm install node-fetch (ครั้งแรก)
 *   node scripts/seedData.js
 */

import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:5000/api';

// ข้อมูลตัวอย่าง
const sampleTickets = [
  {
    title: 'Printer not working',
    description: 'Office printer on 2nd floor is not responding to print commands',
    contact: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '081-234-5678'
    }
  },
  {
    title: 'Cannot login to system',
    description: 'Getting 401 error when trying to login with correct credentials',
    contact: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '081-999-8888'
    }
  },
  {
    title: 'Slow internet connection',
    description: 'Internet speed in meeting room is very slow, cannot join video calls',
    contact: {
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      phone: '082-111-2222'
    }
  },
  {
    title: 'Computer freezing',
    description: 'Desktop computer keeps freezing every 10 minutes, need help urgently',
    contact: {
      name: 'Alice Williams',
      email: 'alice.w@example.com',
      phone: '083-333-4444'
    }
  },
  {
    title: 'Email not receiving',
    description: 'Not receiving any emails since this morning, mailbox seems stuck',
    contact: {
      name: 'Charlie Brown',
      email: 'charlie.brown@example.com',
      phone: '084-555-6666'
    }
  },
  {
    title: 'Software installation request',
    description: 'Need to install Adobe Photoshop on my workstation for design work',
    contact: {
      name: 'David Miller',
      email: 'david.miller@example.com',
      phone: '085-777-8888'
    }
  },
  {
    title: 'VPN connection issue',
    description: 'Cannot connect to company VPN from home, getting timeout error',
    contact: {
      name: 'Eva Davis',
      email: 'eva.davis@example.com',
      phone: '086-999-0000'
    }
  },
  {
    title: 'Monitor display problem',
    description: 'Second monitor keeps flickering and showing black screen randomly',
    contact: {
      name: 'Frank Wilson',
      email: 'frank.wilson@example.com',
      phone: '087-111-3333'
    }
  },
  {
    title: 'Keyboard keys not working',
    description: 'Several keys on keyboard stopped working: E, R, and Spacebar',
    contact: {
      name: 'Grace Lee',
      email: 'grace.lee@example.com',
      phone: '088-222-4444'
    }
  },
  {
    title: 'Access permission request',
    description: 'Need access to shared drive /projects/Q1-2025/ for team collaboration',
    contact: {
      name: 'Henry Taylor',
      email: 'henry.taylor@example.com',
      phone: '089-333-5555'
    }
  },
  {
    title: 'Laptop battery draining fast',
    description: 'Battery drains completely in 1 hour even when not using heavy apps',
    contact: {
      name: 'Iris Anderson',
      email: 'iris.anderson@example.com',
      phone: '081-444-6666'
    }
  },
  {
    title: 'WiFi keeps disconnecting',
    description: 'WiFi connection drops every few minutes, very disruptive to work',
    contact: {
      name: 'Jack Thomas',
      email: 'jack.thomas@example.com',
      phone: '082-555-7777'
    }
  },
  {
    title: 'Phone not ringing',
    description: 'Desk phone not ringing when receiving calls, only voicemail works',
    contact: {
      name: 'Kate Martinez',
      email: 'kate.martinez@example.com',
      phone: '083-666-8888'
    }
  },
  {
    title: 'Software update failed',
    description: 'Windows update stuck at 67% and cannot complete or cancel',
    contact: {
      name: 'Liam Garcia',
      email: 'liam.garcia@example.com',
      phone: '084-777-9999'
    }
  },
  {
    title: 'Data recovery request',
    description: 'Accidentally deleted important files from desktop, need recovery help',
    contact: {
      name: 'Mia Rodriguez',
      email: 'mia.rodriguez@example.com',
      phone: '085-888-0000'
    }
  }
];

/**
 * สร้าง ticket ผ่าน API
 */
async function createTicket(ticketData) {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ticketData)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('❌ Error creating ticket:', error.message);
    throw error;
  }
}

/**
 * อัปเดต status ของ ticket
 */
async function updateTicketStatus(ticketId, status) {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`❌ Error updating status for ${ticketId}:`, error.message);
    throw error;
  }
}

/**
 * สุ่ม status สำหรับ ticket
 */
function getRandomStatus() {
  const statuses = ['pending', 'pending', 'accepted', 'resolved', 'rejected'];
  return statuses[Math.floor(Math.random() * statuses.length)];
}

/**
 * หน่วงเวลา
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Main function
 */
async function seedData() {
  console.log('🌱 Starting data seeding...');
  console.log(`📦 Creating ${sampleTickets.length} tickets...\n`);

  let created = 0;
  let errors = 0;

  for (const [index, ticketData] of sampleTickets.entries()) {
    try {
      // สร้าง ticket
      const result = await createTicket(ticketData);
      const ticketId = result.data?.id || result.id;
      
      console.log(`✅ [${index + 1}/${sampleTickets.length}] Created: "${ticketData.title}" (ID: ${ticketId})`);
      created++;

      // สุ่มเปลี่ยน status บางตัว
      const shouldChangeStatus = Math.random() > 0.3; // 70% จะเปลี่ยน status
      
      if (shouldChangeStatus && ticketId) {
        const newStatus = getRandomStatus();
        
        // ถ้าไม่ใช่ pending ก็เปลี่ยน status
        if (newStatus !== 'pending') {
          await delay(100); // หน่วงเวลานิดหน่อย
          
          // ถ้าเป็น resolved ต้องไปที่ accepted ก่อน
          if (newStatus === 'resolved') {
            await updateTicketStatus(ticketId, 'accepted');
            await delay(100);
            await updateTicketStatus(ticketId, 'resolved');
            console.log(`   ↳ Status: pending → accepted → resolved`);
          } else {
            await updateTicketStatus(ticketId, newStatus);
            console.log(`   ↳ Status: pending → ${newStatus}`);
          }
        }
      }

      // หน่วงเวลาระหว่าง request
      await delay(200);

    } catch (error) {
      console.error(`❌ [${index + 1}/${sampleTickets.length}] Failed: "${ticketData.title}"`);
      errors++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Successfully created: ${created} tickets`);
  if (errors > 0) {
    console.log(`❌ Errors: ${errors} tickets`);
  }
  console.log('='.repeat(50));
  console.log('\n🎉 Data seeding completed!');
  console.log('📋 Go to http://localhost:3000/tickets to see the results');
}

// เริ่มต้น
seedData().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});