type DataKey =
    | 'Weight'
    | 'BMI'
    | 'Body Fat'
    | 'BP Sys'
    | 'BP Dia'
    | 'Temperature'
    | 'Fasting Glucose'
    | 'Calories'
    | 'Protein'
    | 'Carbs'
    | 'Fat'
    | 'Water Intake'
    | 'Exercise'
    | 'Supplements';

type DataValue = {
    order: number;
    format: string;
    unit?: string;
    start: number;
    end: number;
    change: {
        value: number;
        percentage?: number;
    };
    daysOfTransmission: number;
};

export interface PatientRPMReportDataItem {
    key: DataKey;
    value: DataValue;
}
