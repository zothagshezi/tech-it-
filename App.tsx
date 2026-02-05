
import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import CopilotChat from './components/CopilotChat';
import KnowledgeBase from './components/KnowledgeBase';
import { AppView, Ticket, TicketClassification } from './types';
import { 
  Ticket as TicketIcon, 
  Clock, 
  ShieldAlert, 
  ExternalLink, 
  ListChecks, 
  Timer
} from 'lucide-react';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>(AppView.DASHBOARD);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const calculateSLA = (priority: string): string => {
    switch (priority) {
      case 'High': return '2 Hours';
      case 'Medium': return '8 Hours';
      default: return '24 Hours';
    }
  };

  const handleTicketSubmit = (classification: TicketClassification) => {
    const newTicket: Ticket = {
      ...classification,
      id: `INC-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Pending Tier-2',
      createdAt: new Date(),
      slaTarget: calculateSLA(classification.priority),
      slaStatus: 'Healthy'
    };
    setTickets(prev => [newTicket, ...prev]);
  };

  const getPriorityColor = (level: string) => {
    switch(level) {
      case 'High': return 'bg-red-50 text-red-600';
      case 'Medium': return 'bg-yellow-50 text-yellow-600';
      default: return 'bg-green-50 text-green-600';
    }
  };

  const renderView = () => {
    switch (activeView) {
      case AppView.DASHBOARD:
        return <Dashboard onViewChange={setActiveView} />;
      case AppView.COPILOT:
        return <CopilotChat onTicketSubmit={handleTicketSubmit} />;
      case AppView.KNOWLEDGE_BASE:
        return <KnowledgeBase />;
      case AppView.TICKET_HISTORY:
        return (
          <div className="max-w-6xl mx-auto p-4 lg:p-8 space-y-8 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Escalated Tickets</h1>
              <p className="text-slate-500 text-sm">Review status, troubleshooting logs, and SLAs for your active escalations.</p>
            </div>

            {tickets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-8 flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl">
                          <TicketIcon size={24} />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-lg">{ticket.id}</h3>
                          <p className="text-xs text-slate-400">{ticket.category}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority} Priority
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium uppercase">
                          <Clock size={12} />
                          {ticket.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>

                    <div className="mb-6 p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Timer size={16} className="text-blue-600" />
                        <div>
                          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest leading-none mb-1">Resolution SLA</p>
                          <p className="text-sm font-bold text-blue-900">{ticket.slaTarget}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-600 text-white rounded uppercase">On Track</span>
                    </div>
                    
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6 flex-1">
                      <p className="text-sm text-slate-700 font-medium mb-4 italic leading-relaxed">
                        "{ticket.summary}"
                      </p>
                      
                      {ticket.stepsTaken && ticket.stepsTaken.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-slate-200">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                            <ListChecks size={12} />
                            Log: Steps Taken by User
                          </p>
                          <ul className="space-y-1">
                            {ticket.stepsTaken.map((step, idx) => (
                              <li key={idx} className="text-[11px] text-slate-600 flex gap-2">
                                <span className="text-blue-400 font-bold">•</span>
                                {step}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">{ticket.status}</span>
                      </div>
                      <button className="text-blue-600 flex items-center gap-1 text-sm font-bold hover:underline">
                        Details <ExternalLink size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-slate-200 text-center">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <ShieldAlert size={48} className="text-slate-200" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Queue is Empty</h3>
                <p className="text-slate-500 text-sm max-w-xs leading-relaxed mb-8">
                  You haven't escalated any cases yet. Use the Copilot for guided troubleshooting.
                </p>
                <button 
                  onClick={() => setActiveView(AppView.COPILOT)}
                  className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20"
                >
                  Return to Copilot
                </button>
              </div>
            )}
          </div>
        );
      default:
        return <Dashboard onViewChange={setActiveView} />;
    }
  };

  return (
    <Layout activeView={activeView} onViewChange={setActiveView}>
      {renderView()}
    </Layout>
  );
};

export default App;
