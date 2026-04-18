import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, TrendingDown, Users, FileText, Rocket } from 'lucide-react';
import DebtRun from './components/DebtRun';
import './App.css';

const accounts = [
  { id: "RL-772", client: "ASTRA ZEMPARI", debt: "14.2B ALPHA", status: "COLLECTED" },
  { id: "RL-889", client: "SIRA DINARI", debt: "2.1M ALPHA", status: "OVERDUE" },
  { id: "RL-901", client: "UNIDENTIFIED PILOT", debt: "450k ALPHA", status: "IN_RECOVERY" },
  { id: "RL-942", client: "AXIUM_NODE_04", debt: "1.2M ALPHA", status: "OVERDUE" },
];

function App() {
  const [debtInput, setDebtInput] = useState('500000');
  const [calculatedLife, setCalculatedLife] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateLease = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    setTimeout(() => {
      const debt = parseInt(debtInput);
      setCalculatedLife(Math.max(1, Math.floor(1000000 / debt * 10)));
      setIsCalculating(false);
    }, 1500);
  };

  return (
    <div className="ledger-container">
      <div className="grid-overlay" />
      <header className="ledger-header">
        <div className="header-top">
          <Database size={16} />
          <span className="mono">RED_LEDGER_MAIN_CORE // ENCRYPTED_LINK_0x42A</span>
        </div>
        <nav className="ledger-nav">
          <a href="#assets">ASSETS</a>
          <a href="#recovery">RECOVERY</a>
          <a href="#lease">LIFE-LEASE</a>
          <a href="#veil-runner" className="active-nav"><Rocket size={14} /> VEIL_RUNNER</a>
          <a href="https://kybian.com" className="exit-btn">EXIT_HUB</a>
        </nav>
      </header>

      <main className="ledger-main">
        <section className="terminal-window hero-section">
          <div className="terminal-header">SESSION_INIT: SYSTEM_OVERVIEW</div>
          <div className="terminal-content hero-grid">
            <div className="hero-text">
              <h2 className="mono">THE RED LEDGER</h2>
              <p>Everything has a price. Every debt is recorded. We are the auditors of the Fracture. We do not judge value; we ensure payment.</p>
              <div className="stats-strip">
                <div className="stat"><TrendingDown size={14}/> DEBT_INDEX: CRITICAL</div>
                <div className="stat"><Users size={14}/> AGENTS: 1,402</div>
              </div>
            </div>
            <div className="hero-img-wrap">
              <img src="/images/ledger-hero.png" alt="Data Core" />
              <div className="data-flicker" />
            </div>
          </div>
        </section>

        <div className="ledger-split">
          <section id="veil-runner" className="game-section">
            <DebtRun />
          </section>

          <div className="side-column">
            <section id="lease" className="terminal-window lease-section">
              <div className="terminal-header">CALCULATOR: LIFE-LEASE_VALUATION</div>
              <div className="lease-content">
                <div className="lease-info">
                  <Database size={20} />
                  <p>Calculate your remaining operational life based on Alpha-debt holdings.</p>
                </div>
                <form onSubmit={calculateLease} className="lease-form">
                  <div className="input-row">
                    <label>CURRENT_DEBT (ALPHA):</label>
                    <input 
                      type="number" 
                      value={debtInput} 
                      onChange={(e) => setDebtInput(e.target.value)}
                    />
                  </div>
                  <button type="submit" disabled={isCalculating}>
                    {isCalculating ? 'ANALYZING_MARKET...' : 'GENERATE_LEASE_TERM'}
                  </button>
                </form>
                <AnimatePresence>
                  {calculatedLife !== null && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="lease-result"
                    >
                      <div className="result-label">ESTIMATED_REMAINING_LIFE:</div>
                      <div className="result-value">{calculatedLife} MONTHS</div>
                      <div className="result-warning">WARNING: INTEREST RATES SUBJECT TO FRACTURE INSTABILITY.</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>

            <section className="terminal-window data-section">
              <div className="terminal-header">DATABASE: ACTIVE_RECOVERY_QUEUES</div>
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ACC_ID</th>
                      <th>CLIENT_ENTITY</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.map(acc => (
                      <tr key={acc.id} className={acc.status === 'OVERDUE' ? 'row-overdue' : ''}>
                        <td>{acc.id}</td>
                        <td>{acc.client}</td>
                        <td className={acc.status === 'OVERDUE' ? 'blink' : ''}>{acc.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>

        <section className="meeting-panel terminal-window">
          <div className="terminal-header">INTEL_FEED: BOARD_MEETING_242</div>
          <div className="meeting-content">
             <div className="meeting-img">
               <img src="/images/ledger-meeting.png" alt="Board" />
             </div>
             <div className="meeting-notes">
               <h3 className="mono">AGENDA: ALPHA_COLLAPSE_MITIGATION</h3>
               <p>Targeting secondary faction assets. Authorization granted for Level 5 repossession of all Axium-aligned ore-haulers in Sector 4.</p>
               <button className="btn-terminal mt-10"><FileText size={14}/> DOWNLOAD_TRANSCRIPT.PDF</button>
             </div>
          </div>
        </section>
      </main>

      <footer className="ledger-footer">
        <div className="ticker-ledger">
          <span>DEBT_RECOVERY_IN_PROGRESS... RL-442: 12.1M... RL-109: 44k... RL-882: 1.5B... RL-332: 9.4M... RL-551: 2.2M...</span>
        </div>
        <p className="mono">TERMINAL v4.2 // NO UNAUTHORIZED LOGS // ALL TRANSACTIONS FINAL</p>
      </footer>
    </div>
  );
}

export default App;
