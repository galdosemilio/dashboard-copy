import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CCRConfig } from '@app/config';
import { resolveConfig } from '@app/config/section';
import {
  MeasurementAggregation,
  MeasurementDatabase,
  MeasurementDataSource,
  MeasurementSummaryData,
  MeasurementTimeframe
} from '@app/dashboard/accounts/dieters/services';
import {
  ContextService,
  EventsService,
  NotifierService,
  SelectedOrganization
} from '@app/service';
import { _, CcrPaginator, DateNavigatorOutput } from '@app/shared';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'lodash';
import * as moment from 'moment-timezone';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Subject } from 'rxjs';
import { MeasurementChartOutput } from './chart/chart.component';

export type MeasurementSections =
  | 'composition'
  | 'circumference'
  | 'energy'
  | 'food'
  | 'vitals';
export type MeasurementDataElement = {
  code: MeasurementSummaryData;
  displayName: string;
  dynamic?: boolean;
};
export type MeasurementConfig = {
  [S in MeasurementSections]: {
    data: MeasurementDataElement[];
    columns: string[];
    allowDetail?: boolean;
    useNewEndpoint?: boolean;
  };
};

@Component({
  selector: 'app-dieter-measurements',
  templateUrl: 'measurements.component.html',
  styleUrls: ['measurements.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DieterMeasurementsComponent implements OnInit, OnDestroy {
  @ViewChild(CcrPaginator, { static: true }) paginator: CcrPaginator;
  // controls with their config
  aggregation: MeasurementAggregation;
  allowListView: boolean = false;
  components = ['composition', 'circumference', 'energy', 'food', 'vitals'];
  component: MeasurementSections = 'composition';
  sections: MeasurementConfig = {
    composition: {
      data: [
        {
          code: 'weight',
          displayName: _('MEASUREMENT.WEIGHT')
        },
        {
          code: 'bmi',
          displayName: _('MEASUREMENT.BMI')
        },
        {
          code: 'visceralFatPercentage',
          displayName: _('MEASUREMENT.VISCERAL_FAT')
        },
        {
          code: 'visceralFatTanita',
          displayName: _('MEASUREMENT.VISCERAL_FAT_TANITA.VISCERAL_FAT_TANITA')
        },
        {
          code: 'visceralAdiposeTissue',
          displayName: _('MEASUREMENT.VISCERAL_ADIP_TISSUE')
        },
        { code: 'bodyFat', displayName: _('MEASUREMENT.BODY_FAT') },
        { code: 'waterPercentage', displayName: _('MEASUREMENT.HYDRATION') },
        {
          code: 'extracellularWaterToBodyWater',
          displayName: _('MEASUREMENT.EXTRACELLULAR_WATER'),
          dynamic: true
        },
        {
          code: 'totalBodyWater',
          displayName: _('MEASUREMENT.TOTAL_BODY_WATER'),
          dynamic: true
        },
        {
          code: 'visceralFatMass',
          displayName: _('MEASUREMENT.VISCERAL_FAT_MASS'),
          dynamic: true
        },
        {
          code: 'ketones',
          displayName: _('MEASUREMENT.KETONES')
        }
      ],
      columns: [
        'date',
        'device',
        'weight',
        'bmi',
        'bodyFat',
        'leanMass',
        'visceralFatPercentage',
        'visceralFatTanita',
        'visceralAdiposeTissue',
        'waterPercentage',
        'extracellularWaterToBodyWater',
        'totalBodyWater',
        'visceralFatMass',
        'ketones'
      ],
      allowDetail: true,
      useNewEndpoint: true
    },
    circumference: {
      data: [
        {
          code: 'waist',
          displayName: _('MEASUREMENT.WAIST')
        },
        { code: 'arm', displayName: _('MEASUREMENT.ARM') },
        { code: 'chest', displayName: _('MEASUREMENT.CHEST') },
        { code: 'hip', displayName: _('MEASUREMENT.HIP') },
        { code: 'thigh', displayName: _('MEASUREMENT.THIGH') },
        { code: 'neck', displayName: _('MEASUREMENT.NECK') },
        { code: 'thorax', displayName: _('MEASUREMENT.THORAX') }
      ],
      columns: [
        'date',
        'device',
        'waist',
        'arm',
        'chest',
        'hip',
        'thigh',
        'neck',
        'thorax'
      ],
      allowDetail: true,
      useNewEndpoint: true
    },
    energy: {
      data: [
        {
          code: 'steps',
          displayName: _('MEASUREMENT.STEPS')
        },
        { code: 'total', displayName: _('MEASUREMENT.SLEEP') },
        { code: 'sleepQuality', displayName: _('MEASUREMENT.RESTFULNESS') },
        { code: 'distance', displayName: _('MEASUREMENT.DISTANCE') }
      ],
      columns: ['date', 'steps', 'distance', 'total', 'sleepQuality']
    },
    food: {
      data: [
        { code: 'calories', displayName: _('MEASUREMENT.CALORIES') },
        { code: 'protein', displayName: _('BOARD.PROTEIN') },
        { code: 'carbohydrates', displayName: _('MEASUREMENT.CARBS') },
        { code: 'totalFat', displayName: _('BOARD.FAT') }
      ],
      columns: ['date', 'calories', 'protein', 'carbohydrates', 'totalFat']
    },
    vitals: {
      data: [
        { code: 'totalCholesterol', displayName: _('MEASUREMENT.TOTAL_CHOLESTEROL') },
        { code: 'ldl', displayName: _('MEASUREMENT.LDL') },
        { code: 'hdl', displayName: _('MEASUREMENT.HDL') },
        { code: 'vldl', displayName: _('MEASUREMENT.VLDL') },
        { code: 'triglycerides', displayName: _('MEASUREMENT.TRIGLYCERIDES') },
        { code: 'fastingGlucose', displayName: _('MEASUREMENT.FASTING_GLUCOSE') },
        { code: 'hba1c', displayName: _('MEASUREMENT.HBA1C') },
        { code: 'insulin', displayName: '' },
        { code: 'hsCrp', displayName: _('MEASUREMENT.HSCRP') },
        { code: 'temperature', displayName: _('MEASUREMENT.TEMPERATURE') },
        { code: 'respirationRate', displayName: _('MEASUREMENT.RESPIRATION_RATE') },
        { code: 'heartRate', displayName: _('MEASUREMENT.HEART_RATE') },
        {
          code: 'bloodPressureSystolic',
          displayName: _('MEASUREMENT.BLOOD_PRESSURE_SYSTOLIC')
        },
        {
          code: 'bloodPressureDiastolic',
          displayName: _('MEASUREMENT.BLOOD_PRESSURE_DIASTOLIC')
        },
        { code: 'insulin', displayName: _('MEASUREMENT.INSULIN') }
      ],
      columns: [
        'date',
        'device',
        'totalCholesterol',
        'ldl',
        'hdl',
        'vldl',
        'triglycerides',
        'fastingGlucose',
        'hba1c',
        'hsCrp',
        'temperature',
        'respirationRate',
        'heartRate',
        'bloodPressureString',
        'insulin'
      ],
      allowDetail: true,
      useNewEndpoint: true
    }
  };

  timeframe = 'week';
  view = 'table';
  dates: DateNavigatorOutput = {};
  data: MeasurementSummaryData[];
  chartColumns: string[];
  columns: string[];
  filteredColumns: string[] = [];
  useNewEndpoint: boolean;

  // datasource refresh trigger
  refresh$ = new Subject<any>();

  source: MeasurementDataSource | null;

  hiddenMeasurementTabs: string[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private translator: TranslateService,
    private context: ContextService,
    private bus: EventsService,
    private notifier: NotifierService,
    private database: MeasurementDatabase,
    private store: Store<CCRConfig>
  ) {}

  ngOnInit() {
    this.bus.trigger('right-panel.component.set', 'addMeasurements');
    this.source = new MeasurementDataSource(
      this.notifier,
      this.database,
      this.translator,
      this.context,
      this.store
    );
    this.source.result$.pipe(untilDestroyed(this)).subscribe((values) => {
      const allColumns = this.sections[this.section].columns.slice();
      const dynamicColumns = this.sections[this.section].data
        .filter((element) => element.dynamic)
        .map((element) => element.code);
      let filteredColumns = [];

      filteredColumns = allColumns.filter(
        (column) =>
          !this.filteredColumns.find((filteredColumn) => column === filteredColumn)
      );

      if (dynamicColumns.length) {
        filteredColumns = filteredColumns.filter(
          (column) =>
            !dynamicColumns.find((dynamicColumn) => dynamicColumn === column) ||
            !!values.find((val) => val[column] !== 0)
        );
      } else {
        filteredColumns = allColumns;
      }

      this.columns = filteredColumns;
    });
    this.source.addDefault({
      account: this.context.accountId
    });

    this.source.addOptional(this.refresh$, () => {
      return {
        data:
          this.view === 'table' || this.view === 'list'
            ? this.data
            : this.source.getData(),
        timeframe:
          this.view !== 'list'
            ? (this.dates.timeframe as MeasurementTimeframe)
            : undefined,
        // aggregation: this.aggregation,
        startDate:
          this.view !== 'list' ? moment(this.dates.startDate).toISOString() : undefined,
        endDate:
          this.view !== 'list' ? moment(this.dates.endDate).toISOString() : undefined,
        unit: 'day',
        useNewEndpoint: this.useNewEndpoint,
        max: 'all',
        omitEmptyDays: this.view === 'chart' || this.view === 'list' ? true : false
      };
    });

    this.source.addOptional(this.paginator.page, () =>
      this.view === 'list'
        ? {
            offset: this.source.pageIndex * this.source.pageSize,
            limit: this.source.pageSize
          }
        : {}
    );

    // component initialization
    this.route.paramMap.subscribe((params: ParamMap) => {
      // TODO add timeframe, date
      const s = params.get('s') as MeasurementSections;
      this.section = this.components.indexOf(s) >= 0 ? s : this.component;

      const v = params.get('v');
      this.view = ['table', 'chart', 'list'].indexOf(v) >= 0 ? v : this.view;

      if (this.view === 'list' && !this.sections[this.section].useNewEndpoint) {
        this.view = 'table';
      }

      if (!this.allowListView && this.view === 'list') {
        this.view = 'table';
      } else if (this.view === 'table' && this.useNewEndpoint && this.allowListView) {
        this.view = 'list';
      }
    });

    this.cdr.detectChanges();
    this.bus.register('dieter.measurement.refresh', this.refreshData.bind(this));

    this.context.organization$
      .pipe(untilDestroyed(this))
      .subscribe((organization: SelectedOrganization) => {
        this.allowListView = resolveConfig(
          'JOURNAL.ALLOW_MEASUREMENT_LIST_VIEW',
          this.context.organization
        );

        this.filteredColumns = resolveConfig(
          'JOURNAL.HIDDEN_COMPOSITION_COLUMNS',
          this.context.organization
        );

        if (!this.allowListView && this.view === 'list') {
          this.view = 'table';
        } else if (this.view === 'table' && this.useNewEndpoint && this.allowListView) {
          this.view = 'list';
        }
        this.resolveHiddenMeasurementTabs(organization);
      });
    this.resolveHiddenMeasurementTabs(this.context.organization);
  }

  ngOnDestroy() {
    this.source.disconnect();

    this.bus.unregister('dieter.measurement.refresh');
  }

  onAggChange(aggregation: MeasurementAggregation) {
    this.aggregation = aggregation;
    this.refreshData();
  }

  get section(): MeasurementSections {
    return this.component;
  }
  set section(target: MeasurementSections) {
    this.component = target;
    this.data = this.sections[target].data.map((data) => data.code);
    this.useNewEndpoint = this.sections[target].useNewEndpoint;
    this.columns = this.sections[target].columns;
    this.chartColumns = this.sections[target].columns;

    if (this.filteredColumns && this.filteredColumns.length) {
      this.chartColumns = this.chartColumns.filter(
        (column) =>
          !this.filteredColumns.find((filteredColumn) => filteredColumn === column)
      );
    }

    if (!this.source.measurement || !filter(this.data, this.source.measurement).length) {
      this.source.measurement = this.data[0];
    }
    this.refresh$.next('measurements.section');
    this.bus.trigger('add-measurement.section.change', { value: target });
  }

  toggleView(mode?: string) {
    if (this.view === 'chart') {
      this.timeframe = 'week';
    }
    const params = {
      s: this.component,
      v: mode ? mode : this.view === 'table' ? 'chart' : 'table'
    };
    this.router.navigate(['.', params], {
      relativeTo: this.route
    });
  }

  updateDates(dates: DateNavigatorOutput) {
    this.dates = dates;
    this.refresh$.next('measurements.updateDates');
    // prevents exception when changing timeframe from child component
    this.cdr.detectChanges();
  }

  chartChanged(data: MeasurementChartOutput) {
    this.aggregation = data.aggregation;
    this.source.measurement = data.measurement;
    if (this.timeframe !== data.timeframe) {
      this.timeframe = data.timeframe;
      // and the date-navigator will trigger the update
    } else {
      this.refresh$.next('measurements.chartChanged');
    }
  }

  refreshData(): void {
    this.source.refresh();
  }

  private resolveHiddenMeasurementTabs(organization: SelectedOrganization) {
    this.hiddenMeasurementTabs =
      resolveConfig('JOURNAL.HIDDEN_MEASUREMENT_TABS', organization) || [];
  }
}
