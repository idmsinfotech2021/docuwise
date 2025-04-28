// seeder.js
const mongoose = require('mongoose');
const Menu = require('./models/Menu');

const menus = [
  {
    role: 'user',
    menu: [
      {
        label: 'Dashboard',
        icon: '🏠',
        path: '/user-dashboard',
        type: 'link'
      },
      {
        label: 'Document Upload',
        icon: '📂',
        path: '/document-upload',
        type: 'group',
        subMenus: [
          { label: 'Upload Customer PO', path: '/upload-customer-po', icon: '📄' },
          { label: 'Upload Invoice', path: '/upload-invoice', icon: '📑' },
          { label: 'Upload COA', path: '/upload-coa', icon: '🧾' },
          { label: 'Upload Bank Statement', path: '/upload-bank-statement', icon: '🏦' },
          { label: 'Upload TDS Form', path: '/upload-tds-form', icon: '📝' }
        ]
      },
      {
        label: 'Auto Extraction',
        icon: '🤖',
        path: '/auto-extraction',
        type: 'link'
      },
      {
        label: 'AI Generators',
        icon: '✨',
        path: '/ai-generators',
        type: 'link'
      }
    ]
  },
  {
    role: 'admin',
    menu: [
      {
        label: 'Admin Dashboard',
        icon: '🏠',
        path: '/admin-dashboard',
        type: 'link'
      },
      {
        label: 'Manage Tenants',
        icon: '📋',
        path: '/admin/tenants',
        type: 'link'
      },
      {
        label: 'Manage Users',
        icon: '👤',
        path: '/admin/users',
        type: 'link'
      },
      {
        label: 'Manage Prompts',
        icon: '⚙️',
        path: '/manage-prompts',
        type: 'link'
      }
    ]
  }
];

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/docuwise-poc', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('Connected to MongoDB');

  await Menu.deleteMany(); // Clear existing menus
  await Menu.insertMany(menus);

  console.log('Menus Seeded Successfully');
  mongoose.connection.close();
})
.catch(err => {
  console.error('Error:', err);
});
