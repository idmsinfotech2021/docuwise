// Revised menuSeeder.js for Smart Document Processing (DocuWise)
const mongoose = require('mongoose');
const Menu = require('./models/Menu');

const menus = [
  {
    "role": "user",
    "menu": [
      {
        "label": "Dashboard",
        "icon": "\ud83d\udcca",
        "path": "/user-dashboard",
        "type": "link",
        "sequence": 1
      },
      {
        "label": "Smart Upload",
        "icon": "\ud83d\udcc2",
        "path": "/document-upload",
        "type": "group",
        "sequence": 2,
        "subMenus": [
          {
            "label": "Upload Customer PO",
            "path": "/upload-customer-po",
            "icon": "\ud83d\udcc4",
            "sequence": 1
          },
          {
            "label": "Upload Invoice",
            "path": "/upload-invoice",
            "icon": "\ud83d\udcd1",
            "sequence": 2
          },
          {
            "label": "Upload COA",
            "path": "/upload-coa",
            "icon": "\ud83d\udcdc",
            "sequence": 3
          },
          {
            "label": "Upload Bank Statement",
            "path": "/upload-bank-statement",
            "icon": "\ud83c\udfe6",
            "sequence": 4
          },
          {
            "label": "Upload TDS Form",
            "path": "/upload-tds-form",
            "icon": "\ud83d\udcdd",
            "sequence": 5
          },
          {
            "label": "Upload PAN/Aadhaar",
            "path": "/upload-kyc",
            "icon": "\ud83c\udd94",
            "sequence": 6
          },
          {
            "label": "Upload Challan",
            "path": "/upload-challan",
            "icon": "\ud83d\ude9a",
            "sequence": 7
          },
          {
            "label": "Upload Contract",
            "path": "/upload-contract",
            "icon": "\ud83d\udcc3",
            "sequence": 8
          }
        ]
      },
      {
        "label": "AI Extraction Queue",
        "icon": "\ud83e\udd16",
        "path": "/auto-extraction",
        "type": "link",
        "sequence": 3
      },
      {
        "label": "AI Generators",
        "icon": "\u2728",
        "path": "/ai-generators",
        "type": "group",
        "sequence": 4,
        "subMenus": [
          {
            "label": "Proposal Generator",
            "path": "/generate-proposal",
            "icon": "\ud83d\udcc4",
            "sequence": 1
          },
          {
            "label": "SOW Generator",
            "path": "/generate-sow",
            "icon": "\ud83d\udcdc",
            "sequence": 2
          },
          {
            "label": "Company Insight",
            "path": "/generate-company-insight",
            "icon": "\ud83c\udfe2",
            "sequence": 3
          }
        ]
      },
      {
        "label": "History & Archive",
        "icon": "\ud83d\udcc1",
        "path": "/document-history",
        "type": "link",
        "sequence": 5
      },
      {
        "label": "ERP Integration",
        "icon": "\ud83d\udd04",
        "path": "/push-to-erp",
        "type": "link",
        "sequence": 6
      },
      {
        "label": "Tenant Settings",
        "icon": "\u2699\ufe0f",
        "path": "/tenant-settings",
        "type": "link",
        "sequence": 7,
        "subMenus": [
          {
            "label": "User Management",
            "path": "/tenant-settings/users",
            "icon": "👥",
            "sequence": 1
          },
          {
            "label": "Field Mapping View",
            "path": "/tenant-settings/field-mapping",
            "icon": "🔁",
            "sequence": 2
          },
          {
            "label": "Retention Policies",
            "path": "/tenant-settings/retention",
            "icon": "📁",
            "sequence": 3
          },
          {
            "label": "Branding Setup",
            "path": "/tenant-settings/branding",
            "icon": "🎨",
            "sequence": 4
          }
        ]
      }
    ]
  },
  {
    "role": "admin",
    "menu": [
      {
        "label": "Admin Dashboard",
        "icon": "\ud83c\udfe0",
        "path": "/admin-dashboard",
        "type": "link",
        "sequence": 1
      },
      {
        "label": "Manage Tenants",
        "icon": "\ud83c\udfe2",
        "path": "/admin/tenants",
        "type": "link",
        "sequence": 2
      },
      {
        "label": "Manage Users",
        "icon": "\ud83d\udc65",
        "path": "/admin/users",
        "type": "link",
        "sequence": 3
      },
      {
        "label": "Document Monitor",
        "icon": "\ud83d\udcc4",
        "path": "/admin/documents",
        "type": "link",
        "sequence": 4
      },
      {
        "label": "Template & Prompt Setup",
        "icon": "\ud83e\udde0",
        "path": "/manage-prompts",
        "type": "link",
        "sequence": 5
      },
      {
        "label": "ERP & API Integration",
        "icon": "\ud83d\udd0c",
        "path": "/admin/integrations",
        "type": "link",
        "sequence": 6
      },
      {
        "label": "Audit & Logs",
        "icon": "\ud83d\udcca",
        "path": "/admin/logs",
        "type": "link",
        "sequence": 7
      },
      {
        "label": "System Settings",
        "icon": "\ud83d\udee0\ufe0f",
        "path": "/admin/settings",
        "type": "link",
        "sequence": 8
      },
      {
        label: 'Manage Menus',
        icon: '📝',
        path: '/admin/menus',
        type: 'link',
        sequence: 9
      }
    ]
  }
];

mongoose.connect('mongodb://127.0.0.1:27017/docuwise', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('Connected to MongoDB');
  await Menu.deleteMany();
  await Menu.insertMany(menus);
  console.log('Menus Seeded Successfully');
  mongoose.connection.close();
})
.catch(err => {
  console.error('Error:', err);
});
