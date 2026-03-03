import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { useWizard } from '../context/WizardContext';
import { Button } from './ui/Button';
import { formatCurrency, formatPercent, formatMonths } from '../utils/calculations';

interface AnalysisState {
  text: string;
  loading: boolean;
  error: string | null;
}

// Simple markdown → React renderer for **bold** and numbered sections
function renderMarkdown(text: string) {
  return text.split('\n\n').map((para, i) => {
    if (!para.trim()) return null;
    // Lines that look like "1. **Title**:" — render as subheading
    if (/^\d+\.\s+\*\*/.test(para)) {
      const clean = para.replace(/\*\*(.*?)\*\*/g, '$1');
      return (
        <p key={i} className="font-semibold text-navy-800 mt-4 mb-1">
          {clean}
        </p>
      );
    }
    // Normal paragraph with inline bold
    const parts = para.split(/\*\*(.*?)\*\*/g);
    return (
      <p key={i} className="mb-3 text-gray-700 leading-relaxed">
        {parts.map((part, j) =>
          j % 2 === 1 ? <strong key={j}>{part}</strong> : part
        )}
      </p>
    );
  });
}

export function Results() {
  const { data, results, reset } = useWizard();
  const navigate = useNavigate();
  const analysisRef = useRef('');

  const [analysis, setAnalysis] = useState<AnalysisState>({
    text: '',
    loading: true,
    error: null,
  });

  useEffect(() => {
    fetchAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchAnalysis() {
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    if (!apiKey) {
      setAnalysis({
        text: '',
        loading: false,
        error:
          'API-Key nicht konfiguriert. Legen Sie VITE_ANTHROPIC_API_KEY in Ihrer .env-Datei fest und starten Sie den Dev-Server neu.',
      });
      return;
    }

    const usageLabel: Record<string, string> = {
      none: 'Kein KI-Einsatz',
      basic: 'Basisnutzung',
      advanced: 'Fortgeschritten',
      extensive: 'Intensiv',
    };

    const prompt = `Du bist ein erfahrener KI-Strategieberater. Analysiere die folgenden ROI-Daten und erstelle eine präzise, handlungsorientierte strategische Empfehlung auf Deutsch.

**Unternehmensdaten:**
- Unternehmen: ${data.company.name} (${data.company.industry})
- Mitarbeiter: ${data.company.employees}, Jahresumsatz: ${formatCurrency(parseFloat(data.company.revenue) || 0)}
- Abteilung: ${data.company.department}
- KI-Reifegrad: ${usageLabel[data.aiStatus.currentUsage] || '–'} (Stufe ${data.aiStatus.maturityLevel}/5)
- Herausforderungen: ${data.aiStatus.challenges.join(', ') || 'Keine angegeben'}
- KI-Ziele: ${data.aiStatus.goals.join(', ') || 'Keine angegeben'}

**Finanzielle Kennzahlen (3-Jahres-Horizont):**
- Gesamtinvestition: ${formatCurrency(results.totalInvestment)}
- Gesamtertrag (brutto): ${formatCurrency(results.totalReturn)}
- Scheiterwahrscheinlichkeit: ${data.risks.failureProbability}%
- Risikoadjustierter Ertrag: ${formatCurrency(results.riskAdjustedReturn)}
- Verzögerungskosten: ${formatCurrency(results.delayCosts)}
- Nettoertrag: ${formatCurrency(results.netBenefit)}
- ROI (risikoadjustiert): ${formatPercent(results.riskAdjustedROI)}
- Amortisationszeit: ${formatMonths(results.paybackPeriodMonths)}

**Identifizierte Hauptrisiken:** ${data.risks.mainRisks.join(', ') || 'Keine angegeben'}

Erstelle eine strukturierte Analyse (350–450 Wörter) mit diesen vier Abschnitten:

1. **Bewertung der Investitionsstrategie**: Ist der ROI attraktiv? Was treibt den Wert?
2. **Kritische Erfolgsfaktoren**: Die 3–4 entscheidenden Hebel für den Projekterfolg.
3. **Risikoanalyse und Mitigation**: Wie werden die wichtigsten Risiken adressiert?
4. **Empfohlene nächste Schritte**: Konkrete, priorisierte Handlungsempfehlungen.

Schreibe direkt, konkret und auf das spezifische Unternehmen bezogen. Keine Allgemeinplätze.`;

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1024,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`HTTP ${response.status}: ${err}`);
      }

      const json = await response.json();
      const text: string = json.content?.[0]?.text ?? '';
      analysisRef.current = text;
      setAnalysis({ text, loading: false, error: null });
    } catch (e) {
      setAnalysis({
        text: '',
        loading: false,
        error: e instanceof Error ? e.message : 'Unbekannter Fehler beim API-Aufruf.',
      });
    }
  }

  function handleExportPDF() {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();
    const margin = 20;
    const cw = W - 2 * margin;
    let y = 0;

    // ── Header band ──────────────────────────────────────────────────────────
    doc.setFillColor(15, 34, 68);
    doc.rect(0, 0, W, 42, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('KI-ROI-Analyse', margin, 18);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`${data.company.name} · ${data.company.industry}`, margin, 28);
    doc.setFontSize(9);
    doc.setTextColor(180, 195, 220);
    doc.text(`Erstellt am ${new Date().toLocaleDateString('de-DE')}`, margin, 37);
    y = 54;

    // ── Key metrics ──────────────────────────────────────────────────────────
    doc.setTextColor(15, 34, 68);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('ROI-Kennzahlen', margin, y);
    y += 6;
    doc.setDrawColor(15, 34, 68);
    doc.setLineWidth(0.5);
    doc.line(margin, y, W - margin, y);
    y += 6;

    const metrics: [string, string][] = [
      ['Gesamtinvestition (3 Jahre)',  formatCurrency(results.totalInvestment)],
      ['Gesamtertrag brutto (3 J.)',   formatCurrency(results.totalReturn)],
      ['Risikoadjustierter Ertrag',    formatCurrency(results.riskAdjustedReturn)],
      ['Verzögerungskosten',           formatCurrency(results.delayCosts)],
      ['Nettoertrag',                  formatCurrency(results.netBenefit)],
      ['ROI (risikoadjustiert)',        formatPercent(results.riskAdjustedROI)],
      ['Amortisationszeit',            formatMonths(results.paybackPeriodMonths)],
      ['Scheiterwahrscheinlichkeit',   `${data.risks.failureProbability} %`],
    ];

    doc.setFontSize(10);
    metrics.forEach(([label, value], idx) => {
      if (idx % 2 === 0) doc.setFillColor(248, 249, 250);
      else doc.setFillColor(255, 255, 255);
      doc.rect(margin, y - 4, cw, 8, 'F');
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 70, 80);
      doc.text(label, margin + 2, y + 1);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 34, 68);
      doc.text(value, W - margin - 2, y + 1, { align: 'right' });
      y += 8;
    });

    // ── AI Analysis ──────────────────────────────────────────────────────────
    if (analysisRef.current) {
      y += 8;
      if (y > H - 60) { doc.addPage(); y = margin; }

      doc.setTextColor(15, 34, 68);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text('KI-Strategieanalyse', margin, y);
      y += 5;
      doc.setLineWidth(0.5);
      doc.line(margin, y, W - margin, y);
      y += 6;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(40, 50, 60);

      const cleaned = analysisRef.current.replace(/\*\*/g, '');
      const lines = doc.splitTextToSize(cleaned, cw);
      lines.forEach((line: string) => {
        if (y > H - 18) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += 5.5;
      });
    }

    // ── Footer on each page ──────────────────────────────────────────────────
    const pages = doc.getNumberOfPages();
    for (let p = 1; p <= pages; p++) {
      doc.setPage(p);
      doc.setFontSize(8);
      doc.setTextColor(160, 160, 160);
      doc.text(
        `KI-ROI-Rechner | Alle Angaben sind Schätzungen | Seite ${p} von ${pages}`,
        W / 2,
        H - 8,
        { align: 'center' }
      );
    }

    doc.save(`ki-roi-analyse-${data.company.name.replace(/\s+/g, '-').toLowerCase()}.pdf`);
  }

  function handleReset() {
    reset();
    navigate('/');
  }

  const roiPositive = results.riskAdjustedROI >= 0;
  const maxBar = Math.max(results.totalInvestment, results.riskAdjustedReturn, 1);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-navy-800 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold tracking-tight">KI-ROI-Rechner</h1>
            <p className="text-xs text-navy-200 mt-0.5">
              Analyseergebnisse · {data.company.name}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportPDF} size="sm">
              PDF exportieren
            </Button>
            <Button variant="ghost" onClick={handleReset} size="sm"
              className="text-white hover:bg-navy-700">
              ← Neue Analyse
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* ── Key metrics ── */}
        <section>
          <h2 className="text-xl font-bold text-navy-800 mb-4">ROI-Ergebnisse</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: 'ROI (risikoadj.)',
                value: formatPercent(results.riskAdjustedROI),
                sub: '3-Jahres-Horizont',
                accent: roiPositive ? 'text-green-700' : 'text-red-600',
                bg: roiPositive ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200',
              },
              {
                label: 'Nettoertrag',
                value: formatCurrency(results.netBenefit),
                sub: 'nach Risiko & Verzögerung',
                accent: roiPositive ? 'text-navy-800' : 'text-red-600',
                bg: 'bg-white border-gray-200',
              },
              {
                label: 'Amortisation',
                value: formatMonths(results.paybackPeriodMonths),
                sub: 'Payback-Zeitraum',
                accent: 'text-navy-800',
                bg: 'bg-white border-gray-200',
              },
              {
                label: 'Gesamtinvestition',
                value: formatCurrency(results.totalInvestment),
                sub: '3 Jahre inkl. lfd. Kosten',
                accent: 'text-navy-800',
                bg: 'bg-white border-gray-200',
              },
            ].map((m) => (
              <div key={m.label} className={`rounded-xl border p-4 ${m.bg}`}>
                <div className="text-xs text-gray-500 mb-1">{m.label}</div>
                <div className={`text-xl font-bold ${m.accent}`}>{m.value}</div>
                <div className="text-xs text-gray-400 mt-0.5">{m.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Visual comparison ── */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-navy-800 mb-5">
            Investition vs. Ertrag (3 Jahre)
          </h2>
          <div className="space-y-4">
            {[
              { label: 'Gesamtinvestition', value: results.totalInvestment, color: 'bg-navy-800' },
              { label: 'Gesamtertrag (brutto)', value: results.totalReturn, color: 'bg-gray-400' },
              { label: 'Risikoadj. Ertrag', value: results.riskAdjustedReturn, color: 'bg-navy-500' },
              { label: 'Nettoertrag', value: results.netBenefit, color: roiPositive ? 'bg-green-500' : 'bg-red-500' },
            ].map((row) => (
              <div key={row.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{row.label}</span>
                  <span className="font-medium text-gray-800">{formatCurrency(row.value)}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-6 overflow-hidden">
                  <div
                    className={`h-6 rounded-full transition-all duration-700 ${row.color}`}
                    style={{
                      width: `${Math.max(2, Math.min(100, (Math.abs(row.value) / maxBar) * 100))}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Detail table ── */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-navy-800 mb-4">Detailaufschlüsselung</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-gray-500 font-medium">Kennzahl</th>
                  <th className="text-right py-2 text-gray-500 font-medium">Wert</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  ['Bisherige KI-Investition',           formatCurrency(parseFloat(data.investments.previousInvestment) || 0)],
                  ['Geplante Budgets (J1–J3)',            formatCurrency((parseFloat(data.investments.budgetYear1)||0)+(parseFloat(data.investments.budgetYear2)||0)+(parseFloat(data.investments.budgetYear3)||0))],
                  ['Laufende Betriebskosten (3 J.)',      formatCurrency(3*((parseFloat(data.investments.personnelCostsAnnual)||0)+(parseFloat(data.investments.infrastructureCostsAnnual)||0)+(parseFloat(data.investments.serviceCostsAnnual)||0)))],
                  ['Verzögerungskosten',                   formatCurrency(results.delayCosts)],
                  ['— Gesamtkosten',                       formatCurrency(results.totalCost)],
                  ['Jährl. Kosteneinsparung',              formatCurrency(parseFloat(data.returns.costSavingsAnnual)||0)],
                  ['Jährl. Umsatzsteigerung',              formatCurrency(parseFloat(data.returns.revenueIncreaseAnnual)||0)],
                  ['Jährl. Zeiteinsparwert',               formatCurrency((parseFloat(data.returns.timeSavingsHoursPerWeek)||0)*(parseFloat(data.returns.hourlyRate)||0)*52)],
                  ['— Jährl. Gesamtertrag',                formatCurrency(results.annualReturn)],
                  ['Gesamtertrag (3 J. brutto)',           formatCurrency(results.totalReturn)],
                  ['Risikofaktor',                         `${data.risks.failureProbability} % Abschlag`],
                  ['Risikoadj. Ertrag',                    formatCurrency(results.riskAdjustedReturn)],
                  ['ROI (risikoadjustiert)',                formatPercent(results.riskAdjustedROI)],
                ].map(([label, value]) => (
                  <tr key={label} className={label.startsWith('—') ? 'font-semibold bg-navy-50' : ''}>
                    <td className="py-2 text-gray-700">{label.replace('— ', '')}</td>
                    <td className="py-2 text-right text-gray-900">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── AI Strategy Analysis ── */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-navy-800 rounded-lg flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-navy-800">KI-Strategieanalyse</h2>
          </div>

          {analysis.loading && (
            <div className="flex items-center gap-3 py-8 justify-center">
              <div className="w-5 h-5 border-2 border-navy-800 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-gray-600">Analyse wird erstellt …</span>
            </div>
          )}

          {analysis.error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              <strong>Fehler:</strong> {analysis.error}
            </div>
          )}

          {analysis.text && (
            <div className="prose-sm max-w-none text-sm">
              {renderMarkdown(analysis.text)}
            </div>
          )}
        </section>

        {/* ── Actions ── */}
        <div className="flex flex-wrap gap-3 justify-end pb-4">
          <Button variant="secondary" onClick={handleReset}>
            ← Neue Analyse
          </Button>
          <Button onClick={handleExportPDF}>
            PDF exportieren
          </Button>
        </div>
      </main>

      <footer className="border-t border-gray-200 py-4 text-center text-xs text-gray-400">
        KI-ROI-Rechner · Alle Berechnungen sind Schätzungen und ersetzen keine Unternehmensberatung.
      </footer>
    </div>
  );
}
