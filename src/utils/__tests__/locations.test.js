import { describe, it, expect } from 'vitest';
import { resolveLocationForUser, getRoomsForBuilding, ADMIN_SUPPORT_BUILDINGS } from '@/constants/locations';

describe('Locations & Building Auto-fill Utility', () => {
  it('resolves exact match for Support / Administrative buildings', () => {
    expect(resolveLocationForUser('Administration Building (Admin)')).toBe('Administration Building (Admin)');
    expect(resolveLocationForUser('General Services Office (GSO)')).toBe('General Services Office (GSO)');
    expect(resolveLocationForUser('Student Center / OSA')).toBe('Student Center / OSA');
    expect(resolveLocationForUser('Motorpool Depot')).toBe('Motorpool Depot');
  });

  it('resolves college with acronym code to its campus building in LOCATIONS', () => {
    // CIS
    expect(resolveLocationForUser('College of Information Sciences (CIS)')).toBe('College of Information Sciences Building (CIS)');
    // CE
    expect(resolveLocationForUser('College of Engineering (CE)')).toBe('College of Engineering Complex (CE)');
    // CTE
    expect(resolveLocationForUser('College of Teacher Education (CTE)')).toBe('College of Teacher Education Building (CTE)');
    // CNS
    expect(resolveLocationForUser('College of Natural Sciences (CNS)')).toBe('College of Natural Sciences Building (CNS)');
    // CF
    expect(resolveLocationForUser('College of Forestry (CF)')).toBe('College of Forestry Building (CF)');
    // CHK
    expect(resolveLocationForUser('College of Human Kinetics (CHK)')).toBe('College of Human Kinetics Building (CHK)');
  });

  it('resolves college with base name match (e.g. CHET)', () => {
    expect(resolveLocationForUser('College of Home Economics & Technology (CHET)')).toBe('College of Home Economics & Technology (Strawberry Hall)');
  });

  it('resolves exact matches for CA, CAH, CSS, CPAG', () => {
    expect(resolveLocationForUser('College of Agriculture (CA)')).toBe('College of Agriculture (CA)');
    expect(resolveLocationForUser('College of Arts and Humanities (CAH)')).toBe('College of Arts and Humanities (CAH)');
    expect(resolveLocationForUser('College of Social Sciences (CSS)')).toBe('College of Social Sciences (CSS)');
    expect(resolveLocationForUser('College of Public Administration & Governance (CPAG)')).toBe('College of Public Administration & Governance (CPAG)');
  });

  it('falls back to raw string for custom or unlisted locations', () => {
    expect(resolveLocationForUser('External Compound Lab')).toBe('External Compound Lab');
  });

  it('returns empty string for null or empty input', () => {
    expect(resolveLocationForUser(null)).toBe('');
    expect(resolveLocationForUser('')).toBe('');
    expect(resolveLocationForUser('   ')).toBe('');
  });

  it('populates rooms for resolved buildings correctly', () => {
    const adminRooms = getRoomsForBuilding('Administration Building (Admin)');
    expect(adminRooms).toContain("President's Office");

    const cisRooms = getRoomsForBuilding('College of Information Sciences Building (CIS)');
    expect(cisRooms).toContain("Dean's Office");
    expect(cisRooms).toContain('Computer Laboratory 1');
  });
});
