/**
 * Chart.js config values.
 */
import { isEmpty } from 'lodash';

import { Colors, Palette } from './palette.config';

const BarColors = () =>
  Colors.list().map((color, i) => ({
    backgroundColor: color,
    hoverBackgroundColor: Colors.get(i, 'contrast'),
    borderColor: 'rgba(0, 0, 0, 0)' // transparent
  }));

const PieColors = () => [
  {
    backgroundColor: Colors.list(),
    hoverBackgroundColor: Colors.list('contrast')
  }
];

const LineColors = () => [
  {
    backgroundColor: 'rgba(0, 0, 0, 0)', // transparent
    borderColor: Palette.accent,
    pointBackgroundColor: Palette.primary,
    pointBorderColor: '#ffffff',
    pointHoverBackgroundColor: Palette.base,
    pointHoverBorderColor: 'rgba(0, 0, 0, 0)', // transparent
    pointRadius: 6,
    pointHoverRadius: 7
  }
];

const ChartOptions = () => ({
  responsive: true,
  maintainAspectRatio: false,
  spanGaps: true,
  tooltips: {
    enabled: false,
    intersect: false,
    custom: function (tooltipModel) {
      // Tooltip Element
      let tooltipEl = document.getElementById('chartjs-tooltip');

      // Create element on first render
      if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.id = 'chartjs-tooltip';
        tooltipEl.innerHTML = '<table></table>';
        // tslint:disable-next-line:no-invalid-this
        this._chart.canvas.parentElement.appendChild(tooltipEl);
      }

      // Hide if no tooltip
      if (tooltipModel.opacity === 0) {
        tooltipEl.style.opacity = '0';
        return;
      }

      // Set caret Position
      tooltipEl.classList.remove('above', 'below', 'no-transform');
      if (tooltipModel.yAlign) {
        tooltipEl.classList.add(tooltipModel.yAlign);
      } else {
        tooltipEl.classList.add('no-transform');
      }

      // Set Text
      if (tooltipModel.body) {
        const titleLines = tooltipModel.title || [];
        const bodyLines = tooltipModel.body.map((bodyItem) => bodyItem.lines);

        // check if the tooltip has content to show
        const emptyLines = bodyLines.reduce((prev, curr) => prev && isEmpty(curr), true);
        if (emptyLines) {
          tooltipEl.style.opacity = '0';
          return;
        }

        let innerHtml = '<thead>';

        titleLines.forEach(function (title) {
          innerHtml += !isEmpty(title) ? '<tr><th>' + title + '</th></tr>' : '';
        });
        innerHtml += '</thead><tbody>';

        bodyLines.forEach(function (body, i) {
          innerHtml += !isEmpty(body) ? '<tr><td>' + body + '</td></tr>' : '';
        });
        innerHtml += '</tbody>';

        const tableRoot = tooltipEl.querySelector('table');

        tableRoot.innerHTML = innerHtml;
      }

      // `this` will be the overall tooltip
      // tslint:disable-next-line:no-invalid-this
      const position = this._chart.canvas.getBoundingClientRect();

      // display, position, and set styles for font
      tooltipEl.style.opacity = '1';
      tooltipEl.style.left = tooltipModel.caretX + 'px';
      tooltipEl.style.top = tooltipModel.caretY + 'px';
      // TODO customize the adjustment according graph type
      const tooltipHeight = tooltipEl.scrollHeight || tooltipEl.clientHeight;
      tooltipEl.style.marginTop = '-' + tooltipHeight / 2 + 'px';
    }
  },
  legend: {
    display: false,
    onClick: null
  },
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
          callback: function (value, index, values) {
            return value.toFixed(1);
          }
        }
      }
    ]
  }
});

const pieOptions = () => ({
  responsive: true,
  maintainAspectRatio: false,
  tooltips: {
    enabled: true,
    xPadding: 10,
    yPadding: 10,
    displayColors: false,
    backgroundColor: '#f5f5f5',
    titleFontColor: '#484848',
    bodyFontColor: '#484848',
    borderColor: '#484848',
    borderWidth: 1
  },
  legend: {
    display: false
  }
});

function ChartConfigFactory(type: string) {
  switch (type) {
    case 'bar':
      return {
        colors: BarColors(),
        options: ChartOptions()
      };
    case 'pie':
      return {
        colors: PieColors(),
        options: pieOptions()
      };
    case 'line':
    default:
      return {
        colors: LineColors(),
        options: ChartOptions()
      };
  }
}

export const ChartConfig = {
  factory: ChartConfigFactory
};
