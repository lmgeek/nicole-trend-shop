import { connectDB } from '@/lib/db';
import { SiteConfig } from '@/lib/models/SiteConfig';

async function seedSiteConfig() {
  await connectDB();

  const existing = await SiteConfig.findOne({ key: 'showLogo' });
  if (existing) {
    console.log('Site config already exists. Skipping seed.');
    return;
  }

  const configs = [
    { key: 'showLogo', value: true },
    { key: 'showTagline', value: true },
    { key: 'menuPosition', value: 'right' },
    {
      key: 'social',
      value: {
        instagram: { enabled: true, url: 'https://www.instagram.com/nicoletrend.shop/' },
        x: { enabled: false, url: '' },
        facebook: { enabled: false, url: '' },
        youtube: { enabled: false, url: '' },
        tiktok: { enabled: false, url: '' },
      },
    },
  ];

  await SiteConfig.insertMany(configs);
  console.log('Site config seeded successfully!');
}

seedSiteConfig()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
