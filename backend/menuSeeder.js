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
        type: 'link',
        sequence: 1
      },
      {
        label: 'Document Upload',
        icon: '📂',
        path: '/document-upload',
        type: 'group',
        sequence: 2,
        subMenus: [
          { label: 'Upload Customer PO', path: '/upload-customer-po', icon: '📄', sequence: 1 },
          { label: 'Upload Invoice', path: '/upload-invoice', icon: '📑', sequence: 2 },
          { label: 'Upload COA', path: '/upload-coa', icon: '🧾', sequence: 3 },
          { label: 'Upload Bank Statement', path: '/upload-bank-statement', icon: '🏦', sequence: 4 },
          { label: 'Upload TDS Form', path: '/upload-tds-form', icon: '📝', sequence: 5 }
        ]
      },
      {
        label: 'Auto Extraction',
        icon: '🤖',
        path: '/auto-extraction',
        type: 'link',
        sequence: 3
      },
      {
        label: 'AI Generators',
        icon: '✨',
        path: '/ai-generators',
        type: 'link',
        sequence: 4
      },
      {
        label: 'Validation Dashboard',
        icon: '📋',
        path: '/validation-dashboard',
        type: 'link',
        sequence: 5
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
        type: 'link',
        sequence: 1
      },
      {
        label: 'Manage Tenants',
        icon: '📋',
        path: '/admin/tenants',
        type: 'link',
        sequence: 2
      },
      {
        label: 'Manage Users',
        icon: '👤',
        path: '/admin/users',
        type: 'link',
        sequence: 3
      },
      {
        label: 'Manage Prompts',
        icon: '⚙️',
        path: '/manage-prompts',
        type: 'link',
        sequence: 4
      },
      {
        label: 'Manage Menus',
        icon: '📝',
        path: '/admin/menus',
        type: 'link',
        sequence: 5
      }
    ]
  }
];

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/docuwise', {
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
