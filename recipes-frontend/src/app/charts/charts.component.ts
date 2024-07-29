import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { NgChartsModule } from 'ng2-charts';
import { selectRecipesLabelsAndCounters } from '../recipes-list/store/recipes-list.selectors';
import { fetchRecipes } from '../recipes-list/store/recipes-list.actions';
import { ChartData, ChartType } from 'chart.js';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';

@UntilDestroy()
@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [
    NgChartsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    CommonModule,
  ],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.css',
})
export class ChartsComponent implements OnInit {
  chartData: ChartData;
  chartType: ChartType = 'bar';
  responsive$ = this.responsive.observe([Breakpoints.HandsetPortrait]);

  constructor(
    private store: Store,
    private snackbar: MatSnackBar,
    private responsive: BreakpointObserver
  ) {}

  ngOnInit() {
    this.store.dispatch(fetchRecipes({ loading: true }));
    this.store
      .select(selectRecipesLabelsAndCounters)
      .pipe(untilDestroyed(this))
      .subscribe((res) => {
        if (res.labels.length > 0) {
          this.chartData = {
            labels: res.labels,
            datasets: [
              {
                data: res.counter,
                label: 'Shopping List Counter',
                backgroundColor: 'rgba(103, 58, 183, 0.7)',
                borderColor: 'rgba(103, 58, 183, 0.7)',
                pointBackgroundColor: 'rgba(239, 168, 38, 0.7)',
                barPercentage: 0.8,
              },
            ],
          };
        }
      });
  }

  onExport() {
    if (this.chartData.labels) {
      const labels = this.chartData.labels;
      const data = this.chartData.datasets[0].data;
      const csvRows = [];
      csvRows.push(['Label', 'Counter']);
      for (let i = 0; i < labels.length; i++) {
        csvRows.push([labels[i], data[i]]);
      }
      const csvString = csvRows.map((row) => row.join(';')).join('\n');
      const blob = new Blob([csvString], { type: 'text/csv' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'chart-data.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      this.snackbar.open('No data to export');
    }
  }

  toggleChartType() {
    this.chartType = this.chartType === 'bar' ? 'line' : 'bar';
  }
}
