CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  issuing_organization TEXT NOT NULL,
  estimated_value INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  deadline TEXT NOT NULL,
  status TEXT NOT NULL,
  summary TEXT NOT NULL,
  thumbnail TEXT NOT NULL,
  public_notice TEXT NOT NULL,
  package_price INTEGER NOT NULL,
  package_code TEXT NOT NULL,
  issuing_type TEXT NOT NULL,
  timeline_json TEXT NOT NULL,
  scope_json TEXT NOT NULL,
  requirements_json TEXT NOT NULL,
  premium_documents_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contractors (
  id TEXT PRIMARY KEY,
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  country TEXT,
  registration_number TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS purchases (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  contractor_email TEXT NOT NULL,
  package_code TEXT NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  provider_reference TEXT,
  status TEXT NOT NULL,
  receipt_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id)
);

CREATE TABLE IF NOT EXISTS bids (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  contractor_id TEXT NOT NULL,
  proposal_title TEXT NOT NULL,
  commercial_value INTEGER,
  currency TEXT NOT NULL DEFAULT 'USD',
  submission_json TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'submitted',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (contractor_id) REFERENCES contractors(id)
);

CREATE TABLE IF NOT EXISTS audit_events (
  id TEXT PRIMARY KEY,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  metadata_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_deadline ON projects(deadline);
CREATE INDEX IF NOT EXISTS idx_bids_project ON bids(project_id);
CREATE INDEX IF NOT EXISTS idx_purchases_project ON purchases(project_id);
