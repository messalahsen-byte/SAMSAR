/**
 * Utilitaire de correspondance floue (Fuzzy Matching) basé sur la distance de Levenshtein
 * Conçu pour tolérer les erreurs de reconnaissance vocale en Darija, Arabizi et Français.
 */

export interface FuzzyCandidate {
  word: string;
  score: number;
  category?: 'city' | 'type' | 'operation' | 'quarter' | 'general' | string;
  label?: string;
  mappedValue?: string;
}

export type FuzzyMatchResult = FuzzyCandidate;

/**
 * Calcule la distance de Levenshtein entre deux chaînes de caractères.
 */
export function levenshteinDistance(str1: string, str2: string): number {
  const s1 = (str1 || '').toLowerCase().trim();
  const s2 = (str2 || '').toLowerCase().trim();

  if (s1 === s2) return 0;
  if (s1.length === 0) return s2.length;
  if (s2.length === 0) return s1.length;

  const row = Array.from({ length: s2.length + 1 }, (_, i) => i);

  for (let i = 1; i <= s1.length; i++) {
    let prev = i - 1;
    row[0] = i;
    for (let j = 1; j <= s2.length; j++) {
      const temp = row[j];
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + cost);
      prev = temp;
    }
  }

  return row[s2.length];
}

/**
 * Calcule le score de similarité entre deux chaînes sous forme de pourcentage (0 à 100).
 */
export function similarityScore(str1: string, str2: string): number {
  const s1 = (str1 || '').toLowerCase().trim();
  const s2 = (str2 || '').toLowerCase().trim();

  if (!s1 && !s2) return 100;
  if (!s1 || !s2) return 0;
  if (s1 === s2) return 100;

  const maxLen = Math.max(s1.length, s2.length);
  if (maxLen === 0) return 100;

  const distance = levenshteinDistance(s1, s2);
  const score = Math.round(((maxLen - distance) / maxLen) * 100);
  return Math.max(0, Math.min(100, score));
}

/**
 * Trouve les meilleures correspondances d'un mot dans une liste ou un dictionnaire donné.
 * @param input Le mot saisi ou capté par le micro
 * @param dictionary Liste de mots ou clés d'un dictionnaire
 * @param topN Nombre de résultats souhaités (par défaut 3)
 */
export function findBestMatches(
  input: string,
  dictionary: string[] | Record<string, any>,
  topN: number = 3
): FuzzyMatchResult[] {
  const cleanInput = (input || '').toLowerCase().trim();
  if (!cleanInput) return [];

  const candidates: string[] = Array.isArray(dictionary)
    ? dictionary
    : Object.keys(dictionary);

  const scored: FuzzyMatchResult[] = candidates.map((cand) => ({
    word: cand,
    score: similarityScore(cleanInput, cand)
  }));

  // Trie par score décroissant et ne retient que les topN
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, topN);
}

/**
 * Mots courants et mots de liaison (stop-words) Darija/Français
 * pour éviter de chercher des correspondances inutiles sur de simples prépositions.
 */
export const COMMON_STOP_WORDS = new Set([
  'f', 'fi', 'fe', 'في', 'ف',
  'dyal', 'dial', 'd', 'de', 'du', 'des', 'ديال',
  'bghit', 'bgheet', 'baghi', 'bghina', 'بغيت', 'باغي',
  'je', 'veux', 'voudrais', 'cherche', 'recherche',
  'un', 'une', 'le', 'la', 'les',
  'pour', 'avec', 'sans', 'dans', 'sur', 'pres', 'proche',
  '3la', 'fo9', 'm3a', 'kayn', 'kayna'
]);
