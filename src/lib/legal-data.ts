import { fallbackLegalPart1 } from './legal-data-part1';
import { fallbackLegalPart2 } from './legal-data-part2';

export type LegalStatus = 'Published' | 'Draft';

export type LegalSection = {
  id: string;
  n: string;
  title: string;
  shortTitle: string;
  paragraphs: string[];
  highlight?: { label: string; value: string } | null;
  cta?: { label: string } | null;
};

export type LegalDoc = {
  id?: string;
  slug: string;
  title: string;
  description: string;
  subtitle?: string;
  content?: string;
  status: LegalStatus;
  version: string;
  effectiveDate?: string;
  updatedAt?: string;
  sections: LegalSection[];
};

export const legalData: LegalDoc[] = [
  ...fallbackLegalPart1,
  ...fallbackLegalPart2,
];

export function getLegalDocBySlug(slug: string): LegalDoc | undefined {
  const clean = slug.trim().toLowerCase();
  return legalData.find((doc) => doc.slug.toLowerCase() === clean);
}
