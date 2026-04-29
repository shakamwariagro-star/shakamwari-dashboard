'use client';

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import type { Lab } from '@/lib/types';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Title, Tooltip, Legend, Filler);

ChartJS.defaults.font.family = "'Nunito', sans-serif";
ChartJS.defaults.color = '#6b8560';

export default function SummaryCharts({ labs }: { labs: Lab[] }) {
  const labels = labs.map(l => `${l.district}-${l.block}`);

  // 1. Target vs Sanctioned vs Tested Bar Chart
  const targetData = {
    labels,
    datasets: [
      {
        label: 'Target',
        data: labs.map(l => l.target),
        backgroundColor: 'rgba(78, 138, 62, 0.65)',
        borderColor: '#4e8a3e',
        borderWidth: 1,
      },
      {
        label: 'Sanctioned',
        data: labs.map(l => l.sanctioned_target),
        backgroundColor: 'rgba(106, 170, 88, 0.65)',
        borderColor: '#6aaa58',
        borderWidth: 1,
      },
      {
        label: 'Tested',
        data: labs.map(l => l.sample_tested),
        backgroundColor: 'rgba(107, 76, 42, 0.65)',
        borderColor: '#6b4c2a',
        borderWidth: 1,
      },
    ],
  };

  // 2. Payment Doughnut
  const totalPayment = labs.reduce((s, l) => s + l.sanctioned_payment, 0);
  const totalReceived = labs.reduce((s, l) => s + l.payment_received, 0);
  const totalExpenses = labs.reduce((s, l) => s + l.expenses_total, 0);
  const totalBilling = labs.reduce((s, l) => s + l.billing_amount, 0);

  const paymentData = {
    labels: ['Received', 'Outstanding', 'Expenses'],
    datasets: [{
      data: [totalReceived, totalPayment - totalReceived, totalExpenses],
      backgroundColor: ['rgba(45, 110, 31, 0.8)', 'rgba(139, 32, 32, 0.8)', 'rgba(122, 82, 0, 0.8)'],
      borderWidth: 0,
    }],
  };

  // 3. Company-wise Pie Chart
  const companies = ['SRH', 'Radhika', 'Porsa'];
  const companyColors = ['rgba(78, 138, 62, 0.8)', 'rgba(107, 76, 42, 0.8)', 'rgba(30, 90, 150, 0.8)'];
  const companyData = {
    labels: companies.map(c => `${c} (${labs.filter(l => l.company_name === c).length} labs)`),
    datasets: [{
      data: companies.map(c => labs.filter(l => l.company_name === c).reduce((s, l) => s + l.sample_tested, 0)),
      backgroundColor: companyColors,
      borderWidth: 0,
    }],
  };

  // 4. Achievement % per lab (horizontal bar)
  const achievementData = {
    labels: labs.slice(0, 20).map(l => l.lab_code),
    datasets: [{
      label: 'Achievement %',
      data: labs.slice(0, 20).map(l => l.target > 0 ? Math.round((l.sample_tested / l.target) * 100) : 0),
      backgroundColor: labs.slice(0, 20).map(l => {
        const pct = l.target > 0 ? (l.sample_tested / l.target) * 100 : 0;
        return pct >= 80 ? 'rgba(45, 110, 31, 0.7)' : pct >= 50 ? 'rgba(180, 140, 20, 0.7)' : 'rgba(139, 32, 32, 0.7)';
      }),
      borderWidth: 0,
      borderRadius: 4,
    }],
  };

  // 5. Pipeline funnel data
  const totalHandover = labs.reduce((s, l) => s + l.hand_over_samples, 0);
  const totalTested = labs.reduce((s, l) => s + l.sample_tested, 0);
  const totalSHC = labs.reduce((s, l) => s + l.shc_printed, 0);
  const totalSHCHandover = labs.reduce((s, l) => s + l.shc_handover, 0);

  const pipelineData = {
    labels: ['Handover Samples', 'Tested', 'SHC Printed', 'SHC Handover'],
    datasets: [{
      label: 'Samples',
      data: [totalHandover, totalTested, totalSHC, totalSHCHandover],
      backgroundColor: 'rgba(78, 138, 62, 0.15)',
      borderColor: '#4e8a3e',
      borderWidth: 2,
      fill: true,
      tension: 0.3,
      pointBackgroundColor: '#4e8a3e',
      pointRadius: 5,
    }],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' as const, labels: { font: { family: "'Nunito', sans-serif", size: 11 } } },
    },
  };

  const barScales = {
    y: { beginAtZero: true, ticks: { font: { family: "'Fira Mono', monospace", size: 10 } }, grid: { color: 'rgba(61,107,48,0.08)' } },
    x: { ticks: { font: { family: "'Nunito', sans-serif", size: 9 }, maxRotation: 45 }, grid: { display: false } },
  };

  return (
    <div className="space-y-4">
      {/* Row 1: Target bar + Payment doughnut */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        <div className="theme-card">
          <div className="theme-card-title">Target vs Sanctioned vs Tested</div>
          <Bar data={targetData} options={{ ...chartOptions, scales: barScales }} />
        </div>
        <div className="theme-card">
          <div className="theme-card-title">Payment Overview</div>
          <div className="max-w-[280px] mx-auto">
            <Doughnut data={paymentData} options={chartOptions} />
          </div>
          <div className="flex justify-center gap-4 mt-3">
            <div className="text-center">
              <div className="text-[10px] mn" style={{ color: 'var(--color-tx-f)' }}>Received</div>
              <div className="text-sm mn font-bold" style={{ color: 'var(--color-ok)' }}>{totalReceived.toLocaleString('en-IN')}</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] mn" style={{ color: 'var(--color-tx-f)' }}>Outstanding</div>
              <div className="text-sm mn font-bold" style={{ color: 'var(--color-er)' }}>{(totalPayment - totalReceived).toLocaleString('en-IN')}</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] mn" style={{ color: 'var(--color-tx-f)' }}>Expenses</div>
              <div className="text-sm mn font-bold" style={{ color: 'var(--color-earth)' }}>{totalExpenses.toLocaleString('en-IN')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Company-wise + Achievement % */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        <div className="theme-card">
          <div className="theme-card-title">Company-wise Testing (Samples Tested)</div>
          <div className="max-w-[280px] mx-auto">
            <Doughnut data={companyData} options={chartOptions} />
          </div>
        </div>
        <div className="theme-card">
          <div className="theme-card-title">Achievement % by Lab (Top 20)</div>
          <Bar
            data={achievementData}
            options={{
              ...chartOptions,
              indexAxis: 'y' as const,
              scales: {
                x: { beginAtZero: true, max: 100, ticks: { font: { family: "'Fira Mono', monospace", size: 10 }, callback: (v: any) => `${v}%` }, grid: { color: 'rgba(61,107,48,0.08)' } },
                y: { ticks: { font: { family: "'Fira Mono', monospace", size: 10 } }, grid: { display: false } },
              },
            }}
          />
        </div>
      </div>

      {/* Row 3: Sample Pipeline */}
      <div className="theme-card">
        <div className="theme-card-title">Sample Pipeline (All Labs)</div>
        <Line
          data={pipelineData}
          options={{
            ...chartOptions,
            scales: {
              y: { beginAtZero: true, ticks: { font: { family: "'Fira Mono', monospace", size: 10 } }, grid: { color: 'rgba(61,107,48,0.08)' } },
              x: { ticks: { font: { family: "'Nunito', sans-serif", size: 11 } }, grid: { display: false } },
            },
          }}
        />
      </div>
    </div>
  );
}
