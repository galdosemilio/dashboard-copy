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
    GO_TO_PREVIOUS_DATE_RANGE: 'الذهاب إلى نطاق التاريخ السابق',
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
    YEAR: 'سنة',
    BLOOD_PRESSURE: 'ضغط الدم',
    NO_RECORD: 'لا قياسات سابقة مسجلة ل',
    NO_DATA_CHOOSE_DIFF_RANGE:
      'لا توجد بيانات للفترة الحالية. من فضلك، اختر نطاق تاريخ مختلف.'
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
    GO_TO_PREVIOUS_DATE_RANGE: 'Gå til tidligere datointerval',
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
    YEAR: 'År',
    BLOOD_PRESSURE: 'Blodtryk',
    NO_RECORD: 'Ingen tidligere målinger registreret for',
    NO_DATA_CHOOSE_DIFF_RANGE:
      'Ingen data for den nuværende periode. Vælg venligst et andet datointerval.'
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
    GO_TO_PREVIOUS_DATE_RANGE: 'Gehen Sie zum vorherigen Datumsbereich',
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
    YEAR: 'Jahr',
    BLOOD_PRESSURE: 'Blutdruck',
    NO_RECORD: 'Keine vorherigen Messungen aufgezeichnet für',
    NO_DATA_CHOOSE_DIFF_RANGE:
      'Keine Daten für den aktuellen Zeitraum. Bitte wählen Sie einen anderen Datumsbereich.'
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
    GO_TO_PREVIOUS_DATE_RANGE: 'Go to Previous Date Range',
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
    YEAR: 'Year',
    BLOOD_PRESSURE: 'Blood Pressure',
    NO_RECORD: 'No previous measurements recorded for',
    NO_DATA_CHOOSE_DIFF_RANGE:
      'No data for the current period. Please, choose a different date range.'
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
    GO_TO_PREVIOUS_DATE_RANGE: 'Ir al rango de fechas anterior',
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
    YEAR: 'Año',
    BLOOD_PRESSURE: 'Presión sanguínea',
    NO_RECORD: 'No se han registrado mediciones previas para',
    NO_DATA_CHOOSE_DIFF_RANGE:
      'No hay datos para este período. Por favor, escoja un rango de fechas diferente.'
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
    GO_TO_PREVIOUS_DATE_RANGE: 'Aller à la plage de dates précédente',
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
    YEAR: 'An',
    BLOOD_PRESSURE: 'Pression artérielle',
    NO_RECORD: 'Aucune mesure précédente enregistrée pour',
    NO_DATA_CHOOSE_DIFF_RANGE:
      "Aucune donnée pour la période en cours. S'il vous plaît, choisissez une plage de date différente."
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
    GO_TO_PREVIOUS_DATE_RANGE: 'עבור אל טווח התאריך הקודם',
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
    YEAR: 'שָׁנָה',
    BLOOD_PRESSURE: 'לחץ דם',
    NO_RECORD: 'לא נרשמו מדידות קודמות עבור',
    NO_DATA_CHOOSE_DIFF_RANGE:
      'אין נתונים לתקופה הנוכחית. בבקשה, בחר טווח תאריך אחר.'
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
    GO_TO_PREVIOUS_DATE_RANGE: 'Vai alla portata precedente',
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
    YEAR: 'Anno',
    BLOOD_PRESSURE: 'Pressione sanguigna',
    NO_RECORD: 'Nessuna misurazione precedente registrata per',
    NO_DATA_CHOOSE_DIFF_RANGE:
      'Nessun dato per il periodo corrente. Per favore, scegli un intervallo di date diverso.'
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
    GO_TO_PREVIOUS_DATE_RANGE: 'Vá para o intervalo de data anterior',
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
    YEAR: 'Ano',
    BLOOD_PRESSURE: 'Pressão arterial',
    NO_RECORD: 'Nenhuma medição anterior registrada para',
    NO_DATA_CHOOSE_DIFF_RANGE:
      'Não há dados para o período atual. Por favor, escolha um intervalo de datas diferente.'
  }
}

export const translate = (key: string): string => {
  const locale = api.baseData.locale || 'en'

  return get(texts[locale], key) ?? get(texts.en, key) ?? key
}
