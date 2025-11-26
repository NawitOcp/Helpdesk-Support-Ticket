/**
 * Initialize Ticket Positions Script
 * Adds position values to existing tickets for Kanban board
 */

import 'dotenv/config';
import { initDatastore, getDatastore } from '../src/infrastructure/datastore/index.js';

const STATUS_ORDER = ['pending', 'accepted', 'resolved', 'rejected'];

async function initializePositions() {
  console.log('🚀 Starting position initialization...\n');

  try {
    // Initialize datastore first
    await initDatastore();
    console.log('✓ Datastore initialized\n');
    
    const datastore = getDatastore();

    // Fetch all tickets
    const tickets = await datastore.findAll();
    console.log(`📋 Found ${tickets.length} tickets\n`);

    if (tickets.length === 0) {
      console.log('ℹ️  No tickets found. Nothing to initialize.');
      process.exit(0);
    }

    // Group by status
    const ticketsByStatus = {
      pending: [],
      accepted: [],
      resolved: [],
      rejected: []
    };

    tickets.forEach(ticket => {
      if (ticketsByStatus[ticket.status]) {
        ticketsByStatus[ticket.status].push(ticket);
      }
    });

    // Initialize positions for each status
    let updateCount = 0;
    let alreadyInitialized = 0;

    for (const status of STATUS_ORDER) {
      const statusTickets = ticketsByStatus[status];
      
      if (statusTickets.length === 0) {
        console.log(`⊘ Skipping ${status} column (0 tickets)`);
        continue;
      }

      console.log(`\n📌 Processing ${status} column (${statusTickets.length} tickets)...`);

      for (let i = 0; i < statusTickets.length; i++) {
        const ticket = statusTickets[i];
        
        // Only update if position is not set
        if (ticket.position === undefined || ticket.position === null) {
          const position = i * 1000; // Space positions by 1000
          
          await datastore.update(ticket.id, {
            position,
            updatedAt: ticket.updatedAt // Keep original updatedAt
          });

          console.log(`  ✓ Updated ticket ${ticket.id.substring(0, 8)}... → position ${position}`);
          updateCount++;
        } else {
          console.log(`  - Ticket ${ticket.id.substring(0, 8)}... already has position ${ticket.position}`);
          alreadyInitialized++;
        }
      }
    }

    console.log(`\n✅ Initialization complete!`);
    console.log(`📊 Statistics:`);
    console.log(`   Total tickets:        ${tickets.length}`);
    console.log(`   Updated:              ${updateCount}`);
    console.log(`   Already initialized:  ${alreadyInitialized}`);
    
    if (updateCount > 0) {
      console.log(`\n🎉 All done! Your Kanban board is ready to use.`);
    } else {
      console.log(`\nℹ️  All tickets already have positions. No updates needed.`);
    }

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error during initialization:', error);
    console.error('\nDebug info:');
    console.error('- Current directory:', process.cwd());
    console.error('- Node version:', process.version);
    console.error('- Error stack:', error.stack);
    process.exit(1);
  }
}

// Run the script
initializePositions();