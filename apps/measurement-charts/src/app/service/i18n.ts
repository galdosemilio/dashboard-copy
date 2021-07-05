import { api } from './api'
import { get } from 'lodash'

const texts = {
  ar: {
    AVERAGE: 'متوسط',
    CANCEL: 'يلغي',
    CONFIRM: 'يتأكد',
    CREATED_AT: 'أنشئت في',
    DATE: 'تاريخ',
    DELETE: 'حذف',
    DELETE_CONFIRM: 'هل أنت متأكد من حذف الإدخال؟',
    DETAILS: 'تفاصيل',
    GRAPH: 'رسم بياني',
    LIST: 'قائمة',
    MAX: 'الأعلى',
    MIN: 'مين',
    MONTH: 'شهر',
    NO_DATA: 'لايوجد بيانات',
    RANGE: 'نطاق',
    SOURCE: 'مصدر',
    TIME: 'زمن',
    WEEK: 'أسبوع',
    YEAR: 'سنة'
  },
  da: {
    AVERAGE: 'Gennemsnit',
    CANCEL: 'Afbestille',
    CONFIRM: 'Bekræfte',
    CREATED_AT: 'Oprettet kl',
    DATE: 'Dato',
    DELETE: 'Delete',
    DELETE_CONFIRM: 'Er du sikker på at slette posten?',
    DETAILS: 'Detaljer',
    GRAPH: 'Kurve',
    LIST: 'Liste',
    MAX: 'Max',
    MIN: 'Min',
    MONTH: 'Måned',
    NO_DATA: 'Ingen data',
    RANGE: 'Rækkevidde',
    SOURCE: 'Kilde',
    TIME: 'Tid',
    WEEK: 'Uge',
    YEAR: 'År'
  },
  de: {
    AVERAGE: 'Durchschnittlich',
    CANCEL: 'Stornieren',
    CONFIRM: 'Bestätigen',
    CREATED_AT: 'Hergestellt in',
    DATE: 'Datum',
    DELETE: 'Löschen',
    DELETE_CONFIRM: 'Möchten Sie den Eintrag wirklich löschen?',
    DETAILS: 'Einzelheiten',
    GRAPH: 'Graph',
    LIST: 'Aufführen',
    MAX: 'Max',
    MIN: 'Mindest',
    MONTH: 'Monat',
    NO_DATA: 'Keine Daten',
    RANGE: 'Reichweite',
    SOURCE: 'Quelle',
    TIME: 'Zeit',
    WEEK: 'Woche',
    YEAR: 'Jahr'
  },
  en: {
    AVERAGE: 'Average',
    CANCEL: 'Cancel',
    CONFIRM: 'Confirm',
    CREATED_AT: 'Created At',
    DATE: 'Date',
    DELETE: 'Delete',
    DELETE_CONFIRM: 'Are you sure to delete the entry?',
    DETAILS: 'Details',
    GRAPH: 'Graph',
    LIST: 'List',
    MAX: 'Max',
    MIN: 'Min',
    MONTH: 'Month',
    NO_DATA: 'No data',
    RANGE: 'Range',
    SOURCE: 'Source',
    TIME: 'Time',
    WEEK: 'Week',
    YEAR: 'Year'
  },
  es: {
    AVERAGE: 'Promedio',
    CANCEL: 'Cancelar',
    CONFIRM: 'Confirmar',
    CREATED_AT: 'Creado en',
    DATE: 'Fecha',
    DELETE: 'Borrar',
    DELETE_CONFIRM: '¿Estás segura de eliminar la entrada?',
    DETAILS: 'Detalles',
    GRAPH: 'Gráfico',
    LIST: 'Lista',
    MAX: 'Máx.',
    MIN: 'Min.',
    MONTH: 'Mes',
    NO_DATA: 'Sin datos',
    RANGE: 'Rango',
    SOURCE: 'Fuente',
    TIME: 'Hora',
    WEEK: 'Semana',
    YEAR: 'Año'
  },
  fr: {
    AVERAGE: 'Moyenne',
    CANCEL: 'Annuler',
    CONFIRM: 'Confirmer',
    CREATED_AT: 'Créé à',
    DATE: 'Date',
    DELETE: 'Effacer',
    DELETE_CONFIRM: "Êtes-vous sûr de supprimer l'entrée ?",
    DETAILS: 'Des détails',
    GRAPH: 'Graphique',
    LIST: 'Lister',
    MAX: 'Max',
    MIN: 'Min',
    MONTH: 'Mois',
    NO_DATA: 'Pas de données',
    RANGE: 'Pas de données',
    SOURCE: 'La source',
    TIME: 'Temps',
    WEEK: 'Semaine',
    YEAR: 'An'
  },
  he: {
    AVERAGE: 'מְמוּצָע',
    CANCEL: 'לְבַטֵל',
    CONFIRM: 'לְאַשֵׁר',
    CREATED_AT: 'נוצר ב',
    DATE: 'תַאֲרִיך',
    DELETE: 'לִמְחוֹק',
    DELETE_CONFIRM: 'האם אתה בטוח למחוק את הערך?',
    DETAILS: 'פרטים',
    GRAPH: 'גרָף',
    LIST: 'רשימה',
    MAX: 'מקס',
    MIN: 'מָנָה',
    MONTH: 'חוֹדֶשׁ',
    NO_DATA: 'אין מידע',
    RANGE: 'טווח',
    SOURCE: 'מָקוֹר',
    TIME: 'זְמַן',
    WEEK: 'שָׁבוּעַ',
    YEAR: 'שָׁנָה'
  },
  it: {
    AVERAGE: 'Media',
    CANCEL: 'Annulla',
    CONFIRM: 'Confermare',
    CREATED_AT: 'Creato a',
    DATE: 'Data',
    DELETE: 'Elimina',
    DELETE_CONFIRM: 'Sei sicuro di eliminare la voce?',
    DETAILS: 'Dettagli',
    GRAPH: 'Grafico',
    LIST: 'Elenco',
    MAX: 'Max.',
    MIN: 'Min.',
    MONTH: 'Mese',
    NO_DATA: 'Nessun dato',
    RANGE: 'Gamma',
    SOURCE: 'Fonte',
    TIME: 'Tempo',
    WEEK: 'Settimana',
    YEAR: 'Anno'
  },
  pt: {
    AVERAGE: 'Média',
    CANCEL: 'Cancelar',
    CONFIRM: 'Confirme',
    CREATED_AT: 'Criado em',
    DATE: 'Data',
    DELETE: 'Excluir',
    DELETE_CONFIRM: 'Tem certeza de que deseja excluir a entrada?',
    DETAILS: 'Detalhes',
    GRAPH: 'Gráfico',
    LIST: 'Lista',
    MAX: 'Max.',
    MIN: 'Min.',
    MONTH: 'Mês',
    NO_DATA: 'Sem dados',
    RANGE: 'Alcance',
    SOURCE: 'Fonte',
    TIME: 'Tempo',
    WEEK: 'Semana',
    YEAR: 'Ano'
  }
}

export const translate = (key: string): string => {
  const locale = api.baseData.locale || 'en'

  return get(texts[locale], key) ?? get(texts.en, key) ?? key
}
