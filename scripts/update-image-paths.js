#!/usr/bin/env node

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function updateImagePaths() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const items = await db.collection('items').find({}).toArray();

    console.log(`Updating ${items.length} items...`);

    for (const item of items) {
      const updates = {};

      if (item.thumb && !item.thumb.startsWith('/images/')) {
        updates.thumb = `/images/thumb/${item.thumb}`;
      }

      if (item.lg_img && !item.lg_img.startsWith('/images/')) {
        updates.lg_img = `/images/lg/${item.lg_img}`;
      }

      if (Object.keys(updates).length > 0) {
        await db.collection('items').updateOne(
          { _id: item._id },
          { $set: updates }
        );
        console.log(`✅ Updated: ${item.name}`);
      }
    }

    console.log('\n✅ All image paths updated!');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateImagePaths();
