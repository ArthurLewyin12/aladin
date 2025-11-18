// Enum pour les mois en français
export const MONTH_NAMES: Record<string, string> = {
  "01": "Janvier",
  "02": "Février",
  "03": "Mars",
  "04": "Avril",
  "05": "Mai",
  "06": "Juin",
  "07": "Juillet",
  "08": "Août",
  "09": "Septembre",
  "10": "Octobre",
  "11": "Novembre",
  "12": "Décembre",
};

/**
 * Convertit un code de mois (format "2025-06") en nom français ("Juin")
 * @param monthCode - Format "YYYY-MM"
 * @returns Nom du mois en français ou le code original si format invalide
 */
export const formatMonthFromCode = (monthCode: string): string => {
  if (!monthCode) return monthCode;
  const parts = monthCode.split("-");
  if (parts.length === 2) {
    return MONTH_NAMES[parts[1]] || monthCode;
  }
  return monthCode;
};

/**
 * Convertit un code de mois avec année (format "2025-06") en format "Juin 2025"
 * @param monthCode - Format "YYYY-MM"
 * @returns Format "Mois Année" (ex: "Juin 2025")
 */
export const formatMonthWithYear = (monthCode: string): string => {
  if (!monthCode) return monthCode;
  const parts = monthCode.split("-");
  if (parts.length === 2) {
    const [year, month] = parts;
    return `${MONTH_NAMES[month] || month} ${year}`;
  }
  return monthCode;
};
