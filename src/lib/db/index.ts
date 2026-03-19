/**
 * Database client for Cloudflare D1
 * 
 * Usage in API routes:
 * export async function onRequest({ env }) {
 *   const db = env.DONATE_DB; // D1 binding
 *   const results = await db.prepare('SELECT * FROM skills').all();
 * }
 */

export interface Database {
  prepare(query: string): PreparedStatement;
  transaction<T>(fcn: () => T): T;
}

export interface PreparedStatement {
  bind(...params: any[]): PreparedStatement;
  first<T>(...params: any[]): Promise<T | null>;
  all<T>(): Promise<{ results: T[] }>;
  run(): Promise<{ success: boolean }>;
}

/**
 * Initialize database tables
 */
export async function initializeDatabase(db: Database) {
  const schema = await fetch(new URL('./schema.sql', import.meta.url)).then(r => r.text());
  
  // Split by semicolons and execute each statement
  const statements = schema
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  for (const statement of statements) {
    try {
      await db.prepare(statement).run();
    } catch (error) {
      console.error('Error executing statement:', error);
      // Continue on error (table might already exist)
    }
  }

  console.log('Database initialized');
}

/**
 * Skill queries
 */
export const skillQueries = {
  getAll: async (db: Database) => {
    return await db.prepare('SELECT * FROM skills ORDER BY position_y, position_x').all();
  },

  getById: async (db: Database, id: string) => {
    return await db.prepare('SELECT * FROM skills WHERE id = ?').bind(id).first();
  },

  getByCategory: async (db: Database, category: string) => {
    return await db.prepare('SELECT * FROM skills WHERE category = ?').bind(category).all();
  },

  updateProgress: async (db: Database, id: string, totalDonated: number, cost: number) => {
    const progress = Math.min(100, Math.round((totalDonated * 10000) / cost) / 100);
    const status = totalDonated >= cost ? 'unlocked' : totalDonated > 0 ? 'funding' : 'locked';
    
    return await db.prepare(`
      UPDATE skills 
      SET total_donated = ?, progress = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(totalDonated, progress, status, id).run();
  },
};

/**
 * Donation queries
 */
export const donationQueries = {
  create: async (db: Database, donation: {
    id: string;
    donatorId: string;
    donatorName: string;
    donatorEmail?: string;
    amount: number;
    currency: string;
    skillId: string;
    paymentMethod: string;
    message?: string;
    isAnonymous: boolean;
  }) => {
    return await db.prepare(`
      INSERT INTO donations (
        id, donator_id, donator_name, donator_email, amount, currency,
        skill_id, payment_method, message, is_anonymous
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      donation.id,
      donation.donatorId,
      donation.donatorName,
      donation.donatorEmail || null,
      donation.amount,
      donation.currency,
      donation.skillId,
      donation.paymentMethod,
      donation.message || null,
      donation.isAnonymous ? 1 : 0
    ).run();
  },

  getById: async (db: Database, id: string) => {
    return await db.prepare('SELECT * FROM donations WHERE id = ?').bind(id).first();
  },

  updateStatus: async (db: Database, id: string, status: string, transactionId?: string) => {
    return await db.prepare(`
      UPDATE donations 
      SET status = ?, transaction_id = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(status, transactionId || null, id).run();
  },

  getBySkill: async (db: Database, skillId: string) => {
    return await db.prepare(`
      SELECT * FROM donations 
      WHERE skill_id = ? AND status = 'completed'
      ORDER BY created_at DESC
    `).bind(skillId).all();
  },

  getRecent: async (db: Database, limit = 10) => {
    return await db.prepare(`
      SELECT d.*, s.name as skill_name 
      FROM donations d
      JOIN skills s ON d.skill_id = s.id
      WHERE d.status = 'completed'
      ORDER BY d.created_at DESC
      LIMIT ?
    `).bind(limit).all();
  },
};

/**
 * Donator queries
 */
export const donatorQueries = {
  create: async (db: Database, donator: {
    id: string;
    name: string;
    email?: string;
    isAnonymous: boolean;
  }) => {
    return await db.prepare(`
      INSERT INTO donators (id, name, email, is_anonymous)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(id) DO NOTHING
    `).bind(donator.id, donator.name, donator.email || null, donator.isAnonymous ? 1 : 0).run();
  },

  getById: async (db: Database, id: string) => {
    return await db.prepare('SELECT * FROM donators WHERE id = ?').bind(id).first();
  },

  updateTotal: async (db: Database, id: string, amount: number) => {
    return await db.prepare(`
      UPDATE donators 
      SET total_donated = total_donated + ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(amount, id).run();
  },

  getLeaderboard: async (db: Database, limit = 10) => {
    return await db.prepare(`
      SELECT id, name, total_donated, skills_unlocked, badges_earned
      FROM donators
      WHERE is_anonymous = 0
      ORDER BY total_donated DESC
      LIMIT ?
    `).bind(limit).all();
  },
};

/**
 * Certificate queries
 */
export const certificateQueries = {
  create: async (db: Database, certificate: {
    id: string;
    donatorId: string;
    donatorName: string;
    skillId: string;
    skillName: string;
    amount: number;
    verificationHash: string;
  }) => {
    return await db.prepare(`
      INSERT INTO certificates (
        id, donator_id, donator_name, skill_id, skill_name, amount, verification_hash
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      certificate.id,
      certificate.donatorId,
      certificate.donatorName,
      certificate.skillId,
      certificate.skillName,
      certificate.amount,
      certificate.verificationHash
    ).run();
  },

  getById: async (db: Database, id: string) => {
    return await db.prepare('SELECT * FROM certificates WHERE id = ?').bind(id).first();
  },

  getByDonator: async (db: Database, donatorId: string) => {
    return await db.prepare(`
      SELECT * FROM certificates 
      WHERE donator_id = ?
      ORDER BY issued_at DESC
    `).bind(donatorId).all();
  },

  verify: async (db: Database, hash: string) => {
    return await db.prepare('SELECT * FROM certificates WHERE verification_hash = ?').bind(hash).first();
  },
};

/**
 * Stats queries
 */
export const statsQueries = {
  getOverview: async (db: Database) => {
    const skills = await db.prepare('SELECT COUNT(*) as count, SUM(total_donated) as total FROM skills').first<{ count: number, total: number }>();
    const donations = await db.prepare('SELECT COUNT(*) as count FROM donations WHERE status = ?').first<{ count: number }>('completed');
    const donators = await db.prepare('SELECT COUNT(*) as count FROM donators').first<{ count: number }>();

    return {
      totalSkills: skills?.count || 0,
      totalDonated: skills?.total || 0,
      totalDonations: donations?.count || 0,
      totalDonators: donators?.count || 0,
    };
  },
};
