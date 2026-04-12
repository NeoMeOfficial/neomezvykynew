import jsPDF from 'jspdf';
import type { MealPlan, DayPlan, MealSlot } from './types';
import { recipes } from '../../data/recipes';
import type { Recipe } from '../../data/recipes';

// jsPDF default font cannot render Slovak diacritics — strip them
function n(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

const DAY_LABELS = ['Po', 'Ut', 'St', 'St', 'Pi', 'So', 'Ne'];
const MONTHS = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];

function shortDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return `${d.getDate()}. ${MONTHS[d.getMonth()]}`;
}

function getRecipe(id: string): Recipe | undefined {
  return recipes.find((r) => r.id === id);
}

function getMealCalories(slot: MealSlot): number {
  const r = getRecipe(slot.options[slot.selected]);
  return r ? Math.round(r.calories * slot.portionMultiplier) : 0;
}

function getMealTitle(slot: MealSlot): string {
  const r = getRecipe(slot.options[slot.selected]);
  return r ? r.title : '-';
}

// Build shopping list: Map<ingredientName, amounts[]>
function buildShoppingList(plan: MealPlan, weekIndex: number): Map<string, string[]> {
  const map = new Map<string, string[]>();
  const week = plan.weeks[weekIndex];
  if (!week) return map;

  for (const dayIdx of week.dayIndices) {
    const day = plan.days[dayIdx];
    if (!day) continue;
    for (const slot of day.meals) {
      const recipe = getRecipe(slot.options[slot.selected]);
      if (!recipe) continue;
      for (const ing of recipe.ingredients) {
        const name = typeof ing === 'string' ? ing : ing.name;
        const amount = typeof ing === 'string' ? '' : ing.amount;
        const key = name.toLowerCase().trim();
        if (!map.has(key)) map.set(key, []);
        if (amount) map.get(key)!.push(amount);
      }
    }
  }

  return map;
}

export function exportMealPlanPDF(plan: MealPlan): void {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageW = 210;
  const pageH = 297;
  const margin = 14;
  const contentW = pageW - margin * 2;

  // ─── Cover page ──────────────────────────────────────────────────────────────
  doc.setFillColor(240, 230, 218); // warm cream background
  doc.rect(0, 0, pageW, pageH, 'F');

  doc.setFontSize(28);
  doc.setTextColor(46, 34, 24);
  doc.text(n('NeoMe Jedalnicek'), pageW / 2, 60, { align: 'center' });

  doc.setFontSize(14);
  doc.setTextColor(139, 117, 96);
  doc.text(n('6-tyzdenny plan'), pageW / 2, 74, { align: 'center' });

  // Date range
  const startDate = plan.weeks[0]?.startDate ?? '';
  const endDate = plan.weeks[5]?.endDate ?? '';
  if (startDate && endDate) {
    doc.setFontSize(11);
    doc.text(n(`${shortDate(startDate)} - ${shortDate(endDate)}`), pageW / 2, 85, { align: 'center' });
  }

  // Macro targets box
  const p = plan.profile;
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, 105, contentW, 55, 4, 4, 'F');
  doc.setFontSize(12);
  doc.setTextColor(46, 34, 24);
  doc.text(n('Denné ciele'), margin + 8, 118);
  doc.setFontSize(10);
  doc.setTextColor(139, 117, 96);
  doc.text(n(`Kalorii: ${p.dailyCalories} kcal`), margin + 8, 130);
  doc.text(n(`Protein: ${p.dailyProtein} g`), margin + 8, 140);
  doc.text(n(`Sacharidy: ${p.dailyCarbs} g`), margin + 8, 150);
  doc.text(n(`Tuky: ${p.dailyFat} g`), margin + 8, 160);
  doc.text(n(`Stravovanie: ${p.mealsPerDay}x denne`), margin + 80, 130);
  doc.text(n(`Ciel: ${p.goal === 'lose' ? 'Chudnut' : p.goal === 'gain' ? 'Naberat' : 'Udrzat'}`), margin + 80, 140);

  doc.setFontSize(9);
  doc.setTextColor(160, 144, 126);
  doc.text(n(`Vygenerovane: ${new Date(plan.generatedAt).toLocaleDateString('sk-SK')}`), pageW / 2, 285, { align: 'center' });
  doc.text(n('NeoMe Wellness App'), pageW / 2, 291, { align: 'center' });

  // ─── Week pages (pages 2–7) ──────────────────────────────────────────────────
  for (let wi = 0; wi < 6; wi++) {
    const week = plan.weeks[wi];
    if (!week) continue;

    doc.addPage();
    doc.setFillColor(240, 230, 218);
    doc.rect(0, 0, pageW, pageH, 'F');

    // Week header
    doc.setFillColor(122, 158, 120); // strava green
    doc.roundedRect(margin, 10, contentW, 14, 3, 3, 'F');
    doc.setFontSize(13);
    doc.setTextColor(255, 255, 255);
    doc.text(
      n(`Tyzden ${week.weekNumber}  |  ${shortDate(week.startDate)} - ${shortDate(week.endDate)}`),
      pageW / 2,
      19.5,
      { align: 'center' }
    );

    let y = 30;

    for (let di = 0; di < 7; di++) {
      const dayIdx = week.dayIndices[di];
      const day: DayPlan = plan.days[dayIdx];
      if (!day) continue;

      // Day header row
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(margin, y, contentW, 7, 2, 2, 'F');
      doc.setFontSize(9);
      doc.setTextColor(46, 34, 24);
      doc.text(n(`${DAY_LABELS[di]}  ${shortDate(day.date)}`), margin + 3, y + 5);
      doc.setTextColor(122, 158, 120);
      doc.text(n(`${day.totalCalories} kcal  |  B:${day.totalProtein}g  S:${day.totalCarbs}g  T:${day.totalFat}g`), margin + contentW - 3, y + 5, { align: 'right' });
      y += 9;

      // Meal rows
      for (const slot of day.meals) {
        const title = getMealTitle(slot);
        const kcal = getMealCalories(slot);
        doc.setFontSize(8);
        doc.setTextColor(107, 76, 59);
        doc.text(n(slot.label), margin + 4, y + 4);
        doc.setTextColor(139, 117, 96);
        const titleTrunc = title.length > 48 ? title.substring(0, 45) + '...' : title;
        doc.text(n(titleTrunc), margin + 22, y + 4);
        doc.setTextColor(160, 144, 126);
        doc.text(`${kcal} kcal`, margin + contentW - 3, y + 4, { align: 'right' });
        y += 6;
      }

      y += 2; // gap between days
      if (y > pageH - 20) break; // safety: don't overflow page
    }
  }

  // ─── Shopping list pages (pages 8–13) ────────────────────────────────────────
  for (let wi = 0; wi < 6; wi++) {
    const week = plan.weeks[wi];
    if (!week) continue;

    const shoppingList = buildShoppingList(plan, wi);
    const items = [...shoppingList.entries()].sort(([a], [b]) => a.localeCompare(b));

    doc.addPage();
    doc.setFillColor(240, 230, 218);
    doc.rect(0, 0, pageW, pageH, 'F');

    // Header
    doc.setFillColor(184, 134, 74); // copper accent
    doc.roundedRect(margin, 10, contentW, 14, 3, 3, 'F');
    doc.setFontSize(13);
    doc.setTextColor(255, 255, 255);
    doc.text(
      n(`Nakupny zoznam — Tyzden ${week.weekNumber}  (${shortDate(week.startDate)} - ${shortDate(week.endDate)})`),
      pageW / 2,
      19.5,
      { align: 'center' }
    );

    // 2-column layout
    const colW = (contentW - 6) / 2;
    const col1X = margin;
    const col2X = margin + colW + 6;
    let y1 = 32;
    let y2 = 32;
    let col = 0;

    for (const [name, amounts] of items) {
      const amountStr = amounts.length > 0 ? amounts.slice(0, 3).join(', ') : '';
      const displayName = name.length > 28 ? name.substring(0, 26) + '…' : name;

      const x = col === 0 ? col1X : col2X;
      let y = col === 0 ? y1 : y2;

      // Checkbox circle
      doc.setDrawColor(122, 158, 120);
      doc.circle(x + 2.5, y + 2.5, 2, 'S');

      doc.setFontSize(8);
      doc.setTextColor(46, 34, 24);
      doc.text(n(displayName), x + 7, y + 4);

      if (amountStr) {
        doc.setFontSize(7);
        doc.setTextColor(160, 144, 126);
        doc.text(n(amountStr), x + colW - 2, y + 4, { align: 'right' });
      }

      if (col === 0) {
        y1 += 8;
        if (y1 > pageH - 15) col = 1; // switch to column 2
      } else {
        y2 += 8;
        if (y2 > pageH - 15) break; // page full
      }

      col = col === 0 ? (y1 > pageH - 15 ? 1 : 0) : 1;
    }
  }

  // Save
  const filename = `neome-jedalnicek-6-tyzdnov.pdf`;
  doc.save(filename);
}
