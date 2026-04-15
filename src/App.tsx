import React from 'react';
import { motion } from 'framer-motion';
import { Database, TrendingDown, Users, Search, DollarSign, Lock, Terminal } from 'lucide-react';
import './App.css';

const accounts = [
  { id: "RL-772", client: "ASTRA ZEMPARI", debt: "14.2B ALPHA", status: "COLLECTED" },
  { id: "RL-889", client: "SIRA DINARI", debt: "2.1M ALPHA", status: "OVERDUE" },
  { id: "RL-901", client: "UNIDENTIFIED PILOT", debt: "450k ALPHA", status: "IN_RECOVERY" },
];

function App() {
  return (
    <div className="ledger-container">
      <header className="ledger-header">
        <div className="header-top">
          <Database size={20} />
          <span>RED_LEDGER_MAIN_CORE // ENCRYPTED</span>
        </div>
        <nav className="ledger-nav">
          <a href="#assets">ASSETS</a>
          <a href="#recovery">RECOVERY</a>
          <a href="#clients">CLIENTS</a>
          <a href="https://kybian.com">EXIT_HUB</a>
        </nav>
      </header>

      <main className="ledger-main">
        <section className="terminal-window hero-section">
          <div className="terminal-header">SESSION_INIT: SYSTEM_OVERVIEW</div>
          <div className="terminal-content hero-grid">
            <div className="hero-text">
              <h2>THE RED LEDGER</h2>
              <p>Everything has a price. Every debt is recorded. We are the auditors of the Fracture. We do not judge value; we ensure payment.</p>
              <div className="stats-strip">
                <div className="stat"><TrendingDown size={14}/> DEBT_INDEX: CRITICAL</div>
                <div className="stat"><Users size={14}/> AGENTS: 1,402</div>
              </div>
            </div>
            <div className="hero-img-wrap">
              <img src="/images/ledger-hero.png" alt="Data Core" />
            </div>
          </div>
        </section>

        <section className="terminal-window data-section">
          <div className="terminal-header">DATABASE: ACTIVE_RECOVERY_QUEUES</div>
          <table className="data-table">
            <thead>
              <tr>
                <th>ACC_ID</th>
                <th>CLIENT_ENTITY</th>
                <th>DEBT_VALUE</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map(acc => (
                <tr key={acc.id}>
                  <td>{acc.id}</td>
                  <td>{acc.client}</td>
                  <td>{acc.debt}</td>
                  <td className={acc.status === 'OVERDUE' ? 'blink' : ''}>{acc.status}</td>
                  <td><button className="btn-terminal">AUDIT</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="meeting-panel terminal-window">
          <div className="terminal-header">INTEL_FEED: BOARD_MEETING_242</div>
          <div className="meeting-content">
             <div className="meeting-img">
               <img src="/images/ledger-meeting.png" alt="Board" />
             </div>
             <div className="meeting-notes">
               <h3>AGENDA: ALPHA_COLLAPSE_MITIGATION</h3>
               <p>Targeting secondary faction assets. Authorization granted for Level 5 repossession.</p>
               <button className="btn-terminal mt-10">DOWNLOAD_TRANSCRIPT.PDF</button>
             </div>
          </div>
        </section>
      </main>

      <footer className="ledger-footer">
        <p>TERMINAL v4.2 // NO UNAUTHORIZED LOGS // ALL TRANSACTIONS FINAL</p>
      </footer>
    </div>
  );
}

export default App;
