// auto-generated-menuSeeder.js
const mongoose = require('mongoose');
const Menu = require('./models/Menu');

const menus = [
  {
    "role": "user",
    "menu": [
      {
        "label": "AI Generators",
        "icon": "\u2728",
        "path": "/ai-generators",
        "type": "group",
        "sequence": 1,
        "subMenus": [
          {
            "label": "Template Setup (Proposal/SOW)",
            "path": "/template-setup-(proposal/sow)",
            "icon": "\ud83d\udcc4",
            "sequence": 8
          },
          {
            "label": "Generate Proposal",
            "path": "/generate-proposal",
            "icon": "\ud83d\udcc4",
            "sequence": 9
          },
          {
            "label": "Generate SoW",
            "path": "/generate-sow",
            "icon": "\ud83d\udcc4",
            "sequence": 10
          },
          {
            "label": "Generate Company Insight",
            "path": "/generate-company-insight",
            "icon": "\ud83d\udcc4",
            "sequence": 11
          },
          {
            "label": "Generator Usage Logs",
            "path": "/generator-usage-logs",
            "icon": "\ud83d\udcc4",
            "sequence": 12
          }
        ]
      },
      {
        "label": "Admin Panel (IDMS)",
        "icon": "\ud83d\udcc1",
        "path": "/admin-panel-(idms)",
        "type": "group",
        "sequence": 2,
        "subMenus": [
          {
            "label": "Tenant Config & Branding",
            "path": "/tenant-config-&-branding",
            "icon": "\ud83d\udcc4",
            "sequence": 37
          },
          {
            "label": "Push Templates/Prompts",
            "path": "/push-templates/prompts",
            "icon": "\ud83d\udcc4",
            "sequence": 38
          },
          {
            "label": "Tenant Analytics",
            "path": "/tenant-analytics",
            "icon": "\ud83d\udcc4",
            "sequence": 39
          }
        ]
      },
      {
        "label": "Archive",
        "icon": "\ud83d\udcc1",
        "path": "/archive",
        "type": "group",
        "sequence": 3,
        "subMenus": [
          {
            "label": "\u00e2\u20ac\u201d",
            "path": "/\u00e2\u20ac\u201d",
            "icon": "\ud83d\udcc4",
            "sequence": 34
          },
          {
            "label": "Download/Regenerate Documents",
            "path": "/download/regenerate-documents",
            "icon": "\ud83d\udcc4",
            "sequence": 35
          },
          {
            "label": "Retention Logs",
            "path": "/retention-logs",
            "icon": "\ud83d\udcc4",
            "sequence": 36
          }
        ]
      },
      {
        "label": "Auto Extraction",
        "icon": "\ud83e\udd16",
        "path": "/auto-extraction",
        "type": "group",
        "sequence": 4,
        "subMenus": [
          {
            "label": "Extraction Rules (Optional)",
            "path": "/extraction-rules-(optional)",
            "icon": "\ud83d\udcc4",
            "sequence": 4
          },
          {
            "label": "Process Documents",
            "path": "/process-documents",
            "icon": "\ud83d\udcc4",
            "sequence": 5
          },
          {
            "label": "Accuracy Report",
            "path": "/accuracy-report",
            "icon": "\ud83d\udcc4",
            "sequence": 6
          },
          {
            "label": "Retry & Error Logs",
            "path": "/retry-&-error-logs",
            "icon": "\ud83d\udcc4",
            "sequence": 7
          },
          {
            "label": "Extract Customer Sales Order",
            "path": "/extract-customer-sales-order",
            "icon": "\ud83d\udcc4",
            "sequence": 44
          },
          {
            "label": "Validation Rules Engine",
            "path": "/validation-rules-engine",
            "icon": "\ud83d\udcc4",
            "sequence": 45
          }
        ]
      },
      {
        "label": "Document Upload",
        "icon": "\ud83d\udcc2",
        "path": "/document-upload",
        "type": "group",
        "sequence": 5,
        "subMenus": [
          {
            "label": "Document Types Master",
            "path": "/document-types-master",
            "icon": "\ud83d\udcc4",
            "sequence": 1
          },
          {
            "label": "Upload Document",
            "path": "/upload-document",
            "icon": "\ud83d\udcc4",
            "sequence": 2
          },
          {
            "label": "Upload History",
            "path": "/upload-history",
            "icon": "\ud83d\udcc4",
            "sequence": 3
          },
          {
            "label": "Upload Purchase Order",
            "path": "/upload-purchase-order",
            "icon": "\ud83d\udcc4",
            "sequence": 40
          },
          {
            "label": "Upload Delivery Challan",
            "path": "/upload-delivery-challan",
            "icon": "\ud83d\udcc4",
            "sequence": 41
          },
          {
            "label": "Upload TDS Form (16A etc.)",
            "path": "/upload-tds-form-(16a-etc.)",
            "icon": "\ud83d\udcc4",
            "sequence": 42
          },
          {
            "label": "Upload Bank Statement",
            "path": "/upload-bank-statement",
            "icon": "\ud83d\udcc4",
            "sequence": 43
          }
        ]
      },
      {
        "label": "Integration Settings",
        "icon": "\ud83d\udd17",
        "path": "/integration-settings",
        "type": "group",
        "sequence": 6,
        "subMenus": [
          {
            "label": "API Key Management",
            "path": "/api-key-management",
            "icon": "\ud83d\udcc4",
            "sequence": 17
          },
          {
            "label": "ERP Field Mapping",
            "path": "/erp-field-mapping",
            "icon": "\ud83d\udcc4",
            "sequence": 18
          },
          {
            "label": "Webhook Setup",
            "path": "/webhook-setup",
            "icon": "\ud83d\udcc4",
            "sequence": 19
          },
          {
            "label": "Trigger Push to ERP",
            "path": "/trigger-push-to-erp",
            "icon": "\ud83d\udcc4",
            "sequence": 20
          },
          {
            "label": "Integration Logs",
            "path": "/integration-logs",
            "icon": "\ud83d\udcc4",
            "sequence": 21
          }
        ]
      },
      {
        "label": "Reports",
        "icon": "\ud83d\udcc1",
        "path": "/reports",
        "type": "group",
        "sequence": 7,
        "subMenus": [
          {
            "label": "PO-Invoice Validation Report",
            "path": "/po-invoice-validation-report",
            "icon": "\ud83d\udcc4",
            "sequence": 46
          },
          {
            "label": "GRN-Challan Match Report",
            "path": "/grn-challan-match-report",
            "icon": "\ud83d\udcc4",
            "sequence": 47
          },
          {
            "label": "TDS Summary Report",
            "path": "/tds-summary-report",
            "icon": "\ud83d\udcc4",
            "sequence": 48
          },
          {
            "label": "Bank Transaction Summary",
            "path": "/bank-transaction-summary",
            "icon": "\ud83d\udcc4",
            "sequence": 49
          }
        ]
      },
      {
        "label": "System Settings",
        "icon": "\u2699\ufe0f",
        "path": "/system-settings",
        "type": "group",
        "sequence": 8,
        "subMenus": [
          {
            "label": "OCR Engine Config",
            "path": "/ocr-engine-config",
            "icon": "\ud83d\udcc4",
            "sequence": 22
          },
          {
            "label": "Confidence Thresholds",
            "path": "/confidence-thresholds",
            "icon": "\ud83d\udcc4",
            "sequence": 23
          },
          {
            "label": "Retention Policy Setup",
            "path": "/retention-policy-setup",
            "icon": "\ud83d\udcc4",
            "sequence": 24
          },
          {
            "label": "Global Configurations",
            "path": "/global-configurations",
            "icon": "\ud83d\udcc4",
            "sequence": 25
          },
          {
            "label": "Audit Logs",
            "path": "/audit-logs",
            "icon": "\ud83d\udcc4",
            "sequence": 26
          }
        ]
      },
      {
        "label": "Templates",
        "icon": "\ud83d\udcd1",
        "path": "/templates",
        "type": "group",
        "sequence": 9,
        "subMenus": [
          {
            "label": "Upload Word Templates",
            "path": "/upload-word-templates",
            "icon": "\ud83d\udcc4",
            "sequence": 13
          },
          {
            "label": "Upload Prompt Templates",
            "path": "/upload-prompt-templates",
            "icon": "\ud83d\udcc4",
            "sequence": 14
          },
          {
            "label": "Template Version Control",
            "path": "/template-version-control",
            "icon": "\ud83d\udcc4",
            "sequence": 15
          },
          {
            "label": "Template History",
            "path": "/template-history",
            "icon": "\ud83d\udcc4",
            "sequence": 16
          }
        ]
      },
      {
        "label": "Usage & Logs",
        "icon": "\ud83d\udcc1",
        "path": "/usage-&-logs",
        "type": "group",
        "sequence": 10,
        "subMenus": [
          {
            "label": "\u00e2\u20ac\u201d",
            "path": "/\u00e2\u20ac\u201d",
            "icon": "\ud83d\udcc4",
            "sequence": 30
          },
          {
            "label": "\u00e2\u20ac\u201d",
            "path": "/\u00e2\u20ac\u201d",
            "icon": "\ud83d\udcc4",
            "sequence": 31
          },
          {
            "label": "Usage Summary",
            "path": "/usage-summary",
            "icon": "\ud83d\udcc4",
            "sequence": 32
          },
          {
            "label": "Billing Report",
            "path": "/billing-report",
            "icon": "\ud83d\udcc4",
            "sequence": 33
          }
        ]
      },
      {
        "label": "User Management",
        "icon": "\ud83d\udc64",
        "path": "/user-management",
        "type": "group",
        "sequence": 11,
        "subMenus": [
          {
            "label": "Roles & Permissions",
            "path": "/roles-&-permissions",
            "icon": "\ud83d\udcc4",
            "sequence": 27
          },
          {
            "label": "User Setup",
            "path": "/user-setup",
            "icon": "\ud83d\udcc4",
            "sequence": 28
          },
          {
            "label": "Login/Activity Logs",
            "path": "/login/activity-logs",
            "icon": "\ud83d\udcc4",
            "sequence": 29
          }
        ]
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
