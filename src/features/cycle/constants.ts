import type { PhaseKey } from './types';
import { colors } from '../../theme/warmDusk';

export const PHASE_NAMES: Record<PhaseKey, string> = {
  menstrual: 'Menštruácia',
  follicular: 'Folikulárna fáza',
  ovulation: 'Ovulácia',
  luteal: 'Luteálna fáza',
};

export const PHASE_COLORS: Record<PhaseKey, string> = {
  menstrual: colors.periodka,   // #C27A6E
  follicular: colors.strava,    // #7A9E78
  ovulation: colors.mysel,      // #A8848B
  luteal: colors.accent,        // #B8864A
};

export const PHASE_EMOJI: Record<PhaseKey, string> = {
  menstrual: '🌸',
  follicular: '🌱',
  ovulation: '✨',
  luteal: '🌙',
};

export const PHASE_MESSAGES: Record<PhaseKey, string> = {
  menstrual: 'Tvoje telo regeneruje — dopraj si pokoj a teplo',
  follicular: 'Energia rastie — skvelý čas na nové výzvy!',
  ovulation: 'Si na vrchole energie — využi to naplno!',
  luteal: 'Spomaľ a počúvaj svoje telo — zaslúžiš si starostlivosť',
};

export const PHASE_DESCRIPTIONS: Record<PhaseKey, string> = {
  menstrual: 'Tvoje telo sa regeneruje a obnovuje. Hladiny estrogénu a progesterónu sú nízke, čo môže spôsobiť únavu a potrebu odpočinku.',
  follicular: 'Energia sa postupne vracia! Estrogén stúpa, čo zlepšuje náladu a motiváciu. Ideálny čas na nové výzvy a projekty.',
  ovulation: 'Vrchol energie a sebavedomia. Estrogén je na maximum, telo uvoľňuje vajíčko. Cítiš sa sociálnejšia, komunikatívnejšia a plná sily.',
  luteal: 'Telo sa pripravuje na ďalší cyklus. Progesterón stúpa, môžeš cítiť potrebu spomalenia a starostlivosti o seba.',
};

export const FERTILITY_COLOR = '#E91E63';
export const FERTILITY_NAME = 'Plodné dni';
