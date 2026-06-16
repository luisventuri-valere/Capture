import { useState } from 'react';
import {
  LayoutDashboard, TrendingUp, Building2, Target, Filter, Users, Search as SearchIcon,
  Newspaper, BarChart3, GraduationCap, FileText, Handshake, Settings,
} from 'lucide-react';
import svgPaths from '../imports/StrategyPlanAll-2/svg-atqsyrus29';
import { CaptureProvider } from '../context/CaptureContext';
import { StrategyPlanSubTab } from './components/capture/StrategyPlanSubTab';
import { TeamingTab } from './components/capture/TeamingTab';
import { SolutioningTab } from './components/capture/SolutioningTab';
import { StaffingTab } from './components/capture/StaffingTab';
import { PastPerformanceScreen } from './components/capture/pastPerformance/PastPerformanceScreen';
import { PricingScreen } from './components/capture/pricing/PricingScreen';
import { DataCallsScreen } from './components/capture/dataCalls/DataCallsScreen';
import strategyData from '../imports/opp-001-strategy.json';
import type { StrategyData } from '../types/strategy';

const data = strategyData as StrategyData;

/* ─────────────────────────────────────────────────────────────
   GovHub Logo
───────────────────────────────────────────────────────────── */
function GovHubLogoMark() {
  return (
    <div className="h-[30px] relative shrink-0 w-[32px]">
      <div className="absolute inset-[7.73%_2.04%_5.27%_1.99%]">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30.7083 26.0993">
          <path d={svgPaths.p1e771000} fill="url(#logo_g1)" />
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="logo_g1" x1="15.3528" x2="15.3528" y1="24.0674" y2="-0.366797">
              <stop stopColor="#3668C1" /><stop offset="1" stopColor="#20427E" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 30">
        <path d={svgPaths.p1bc5c300} fill="url(#logo_g2)" />
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="logo_g2" x1="0" x2="32.0008" y1="15.001" y2="15.001">
            <stop stopColor="#3668C1" /><stop offset="1" stopColor="#20427E" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function GovHubWordmark() {
  return (
    <div className="h-[10px] relative shrink-0 w-[95px]">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 95 10">
        <path d={svgPaths.p35142100} fill="url(#wm0)" />
        <path d={svgPaths.p157e100} fill="url(#wm1)" />
        <path d={svgPaths.p1ec35800} fill="url(#wm2)" />
        <path d={svgPaths.p14d3af80} fill="url(#wm3)" />
        <path d={svgPaths.p3a0b1080} fill="url(#wm4)" />
        <path d={svgPaths.p1d04ba00} fill="url(#wm5)" />
        <defs>
          {[0,1,2,3,4,5].map(i => (
            <linearGradient key={i} gradientUnits="userSpaceOnUse" id={`wm${i}`} x1="6.99" x2="6.99" y1="-1.64" y2="10.5">
              <stop stopColor="#4682EE" /><stop offset="1" stopColor="#315698" />
            </linearGradient>
          ))}
        </defs>
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Top Header
───────────────────────────────────────────────────────────── */
function TopHeader() {
  return (
    <header
      className="flex shrink-0 w-full items-center justify-between px-[16px]"
      style={{
        height: 'var(--gh-space-56)',
        background: `linear-gradient(to right, var(--gh-bg-elevated), var(--gh-bg-surface))`,
        borderBottom: `1px solid var(--gh-border-strong)`,
        fontFamily: 'var(--gh-font)',
      }}
    >
      {/* Left: Logo + Toggle */}
      <div className="flex gap-[12px] items-center shrink-0 w-[187px]">
        <div className="flex gap-[8px] items-center">
          <GovHubLogoMark />
          <GovHubWordmark />
        </div>
        <button className="flex items-center justify-center size-[40px]" style={{ borderRadius: 'var(--gh-radius-lg)' }}>
          <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
            <path d="M2 4h14M2 9h14M2 14h14" stroke="var(--gh-text-secondary)" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Center: Department + Search */}
      <div className="flex gap-[16px] items-center shrink-0">
        <button className="flex gap-[8px] items-center px-[12px] py-[6px]" style={{ borderRadius: 'var(--gh-radius-lg)' }}>
          <span style={{ fontSize: 'var(--gh-font-size-md)', fontWeight: 'var(--gh-font-weight-medium)', color: 'var(--gh-text-secondary)', whiteSpace: 'nowrap' }}>
            BD / Growth
          </span>
          <svg width="14" height="14" fill="none" viewBox="0 0 9 5.5">
            <path d="M1 1L4.5 4.5L8 1" stroke="var(--gh-text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div
          className="flex gap-[8px] items-center h-[36px] px-[12px] py-[8px]"
          style={{ background: 'var(--gh-bg-surface-muted)', border: `1px solid var(--gh-border)`, borderRadius: 'var(--gh-radius-lg)' }}
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 11.3333 11.3333">
            <path d={svgPaths.p2c4e4080} stroke="var(--gh-text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: 'var(--gh-font-size-md)', color: 'var(--gh-text-secondary)', whiteSpace: 'nowrap' }}>
            Search opportunities, agencies...
          </span>
        </div>
      </div>

      {/* Right: Notif + Help + Avatar */}
      <div className="flex gap-[8px] items-center shrink-0">
        <div className="relative size-[40px] flex items-center justify-center" style={{ borderRadius: 'var(--gh-radius-lg)' }}>
          <svg width="18" height="18" fill="none" viewBox="0 0 15.5 13.25">
            <path d={svgPaths.p2a2f0300} stroke="var(--gh-text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div
            className="absolute top-[4px] right-[6px] size-[8px]"
            style={{ borderRadius: 'var(--gh-radius-full)', background: 'var(--gh-danger)' }}
          />
        </div>
        <button className="flex items-center justify-center size-[40px]" style={{ borderRadius: 'var(--gh-radius-lg)' }}>
          <svg width="18" height="18" fill="none" viewBox="0 0 17 17">
            <path d={svgPaths.p1d70d600} stroke="var(--gh-text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div
          className="flex items-center justify-center shrink-0 size-[32px]"
          style={{ borderRadius: 'var(--gh-radius-full)', background: `linear-gradient(135deg, var(--gh-blue-600) 0%, var(--gh-blue-800) 71%)` }}
        >
          <span style={{ fontSize: 'var(--gh-font-size-sm)', fontWeight: 'var(--gh-font-weight-semibold)', color: 'var(--gh-white)', whiteSpace: 'nowrap' }}>
            JD
          </span>
        </div>
      </div>
    </header>
  );
}

/* ─────────────────────────────────────────────────────────────
   Sidebar
───────────────────────────────────────────────────────────── */
// Collapsed 56px icon rail (Figma node 2141:100). Icon-only NavItems in 3 sections.
type RailItem = { Icon: typeof Target; label: string; active?: boolean };
const RAIL_SECTIONS: RailItem[][] = [
  [
    { Icon: LayoutDashboard, label: 'My Dashboard' },
    { Icon: TrendingUp, label: 'Executive' },
    { Icon: Building2, label: 'Department' },
  ],
  [
    { Icon: Target, label: 'Opportunities', active: true },
    { Icon: Filter, label: 'Pipeline' },
    { Icon: Users, label: 'Relationships' },
    { Icon: SearchIcon, label: 'Research' },
    { Icon: Newspaper, label: 'News' },
    { Icon: BarChart3, label: 'Analytics' },
    { Icon: GraduationCap, label: 'Learning' },
  ],
  [
    { Icon: Building2, label: 'Company Profile' },
    { Icon: FileText, label: 'Files' },
    { Icon: Handshake, label: 'Partners' },
    { Icon: Settings, label: 'Settings' },
  ],
];

function Sidebar() {
  return (
    <aside
      className="flex flex-col h-full shrink-0 items-center"
      style={{ width: 56, background: 'var(--gh-bg-elevated)', borderRight: '1px solid rgba(71,85,105,0.3)', fontFamily: 'var(--gh-font)' }}
    >
      <div className="flex flex-col flex-1 overflow-y-auto min-h-0 items-center w-full" style={{ gap: 16, padding: '16px 8px' }}>
        {RAIL_SECTIONS.map((section, si) => (
          <div key={si} className="flex flex-col items-center shrink-0" style={{ gap: 4 }}>
            {section.map(item => (
              <button
                key={item.label}
                title={item.label}
                aria-label={item.label}
                className="flex items-center justify-center shrink-0 cursor-pointer"
                style={{ width: 40, height: 36, borderRadius: 'var(--gh-radius-lg)', border: 'none', background: item.active ? 'var(--gh-accent)' : 'transparent' }}
              >
                <item.Icon size={18} color={item.active ? 'var(--gh-accent-fg)' : 'var(--gh-text-secondary)'} strokeWidth={2} />
              </button>
            ))}
          </div>
        ))}
      </div>
    </aside>
  );
}

/* ─────────────────────────────────────────────────────────────
   Opportunity Header
───────────────────────────────────────────────────────────── */
function OpportunityHeader() {
  const pos = data.sections.strategicPositioning.positioning;
  return (
    <div
      className="flex flex-col items-start shrink-0 w-full"
      style={{ background: 'var(--gh-bg-elevated)', padding: '18px var(--gh-space-12)', gap: '10px', fontFamily: 'var(--gh-font)' }}
    >
      {/* Row 1: title + status pill */}
      <div className="flex items-center gap-[10px] w-full">
        <span className="truncate" style={{ flex: '0 1 auto', minWidth: 0, fontSize: 'var(--gh-font-size-lg)', fontWeight: 'var(--gh-font-weight-bold)', color: 'var(--gh-white)' }}>
          {data.title}
        </span>
        <div className="flex items-center shrink-0" style={{ background: 'var(--gh-emerald-700)', padding: '2px var(--gh-space-5)', borderRadius: 'var(--gh-radius-default)' }}>
          <span style={{ fontSize: 'var(--gh-font-size-xs)', fontWeight: 'var(--gh-font-weight-bold)', color: 'var(--gh-text)', letterSpacing: '0.6px', whiteSpace: 'nowrap' }}>
            {data.overallStatus}
          </span>
        </div>
      </div>

      {/* Row 2: metadata line */}
      <span style={{ fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-text-tertiary)' }}>
        {data.noticeId} · {pos.vehicle} · {pos.setAsideCategory} · {pos.periodOfPerformance}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Stage Tab Bar
───────────────────────────────────────────────────────────── */
function StageTabBar() {
  const stages = ['Identify', 'Intel & Analysis', 'Capture', 'Proposal'];
  return (
    <div
      className="flex flex-row items-center shrink-0 w-full"
      style={{ background: 'var(--gh-bg-elevated)', borderBottom: `1px solid var(--gh-border)`, padding: '0 var(--gh-space-12)', fontFamily: 'var(--gh-font)' }}
    >
      <div className="flex flex-1 min-w-px items-start">
        {stages.map(s => {
          const active = s === 'Capture';
          return (
            <div key={s} className="flex flex-col items-start shrink-0">
              <div className="flex gap-[8px] items-center" style={{ padding: 'var(--gh-space-6) var(--gh-space-8)' }}>
                <span style={{ fontSize: 'var(--gh-font-size-md)', fontWeight: active ? 'var(--gh-font-weight-medium)' : 'var(--gh-font-weight-normal)', lineHeight: 1.5, color: active ? 'var(--gh-accent-tint)' : 'var(--gh-text-tertiary)', whiteSpace: 'nowrap' }}>
                  {s}
                </span>
              </div>
              <div className="h-[2px] w-full shrink-0" style={{ borderRadius: 'var(--gh-radius-sm)', background: active ? 'var(--gh-accent-hover)' : 'transparent' }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Capture Sub-Nav
───────────────────────────────────────────────────────────── */
interface SubNavProps { active: string; onChange: (t: string) => void }

function CaptureSubnav({ active, onChange }: SubNavProps) {
  const tabs = ['Strategy & Plan', 'Teaming', 'Solutioning', 'Staffing', 'Past Performance', 'Pricing', 'Data Calls'];
  return (
    <div className="flex items-center w-full shrink-0" style={{ background: 'var(--gh-bg-surface)', fontFamily: 'var(--gh-font)' }}>
      {tabs.map((tab, i) => {
        const isActive = tab === active;
        const disabled = i > 0;   // only "Strategy & Plan" (tab 1) is enabled
        return (
          <button
            key={tab}
            onClick={() => { if (!disabled) onChange(tab); }}
            disabled={disabled}
            className="flex items-center justify-center shrink-0"
            style={{ width: 180, padding: '16px 0', gap: 10, border: 'none', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1, background: isActive ? 'var(--gh-bg-canvas)' : 'transparent' }}
          >
            <span style={{
              width: 26, height: 26, flexShrink: 0, borderRadius: 'var(--gh-radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 'var(--gh-font-weight-semibold)',
              background: isActive ? 'var(--gh-blue-500)' : 'transparent',
              border: isActive ? 'none' : '1.5px solid var(--gh-border-strong)',
              color: isActive ? 'var(--gh-white)' : 'var(--gh-text-tertiary)',
            }}>{i + 1}</span>
            <span style={{ fontSize: 14, fontWeight: isActive ? 'var(--gh-font-weight-medium)' : 'var(--gh-font-weight-normal)', color: isActive ? 'var(--gh-accent-tint)' : 'var(--gh-text-tertiary)', whiteSpace: 'nowrap' }}>
              {tab}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Root App
───────────────────────────────────────────────────────────── */
export default function App() {
  return (
    <CaptureProvider>
      <div
        className="flex flex-col h-screen w-screen overflow-hidden"
        style={{ background: 'var(--gh-bg-canvas)', fontFamily: 'var(--gh-font)' }}
      >
        <TopHeader />
        <div className="flex flex-1 min-h-0 overflow-hidden">
          <Sidebar />
          <MainContent data={data} />
        </div>
      </div>
    </CaptureProvider>
  );
}

function MainContent({ data }: { data: StrategyData }) {
  const [activeTab, setActiveTab] = useState('Strategy & Plan');

  return (
    <div className="flex flex-col flex-1 min-w-0 overflow-hidden" style={{ background: 'var(--gh-bg-canvas)' }}>
      <OpportunityHeader />
      <StageTabBar />

      {/* CaptureBody */}
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
        {/* Numbered capture sub-nav — full-width bar */}
        <div className="shrink-0 w-full">
          <CaptureSubnav active={activeTab} onChange={setActiveTab} />
        </div>

        {/* Content area — flex for master/detail, scroll for others */}
        <div className="flex-1 min-h-0 overflow-hidden" style={{ background: 'var(--gh-bg-canvas)' }}>
          {activeTab === 'Strategy & Plan' ? (
            <div style={{ height: '100%', padding: 'var(--gh-space-8) var(--gh-space-12)', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
              <StrategyPlanSubTab data={data} />
            </div>
          ) : activeTab === 'Teaming' ? (
            <div style={{ height: '100%', padding: 'var(--gh-space-8) var(--gh-space-12)', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
              <TeamingTab />
            </div>
          ) : activeTab === 'Solutioning' ? (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
              <SolutioningTab />
            </div>
          ) : activeTab === 'Staffing' ? (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
              <StaffingTab />
            </div>
          ) : activeTab === 'Past Performance' ? (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
              <PastPerformanceScreen />
            </div>
          ) : activeTab === 'Pricing' ? (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
              <PricingScreen />
            </div>
          ) : activeTab === 'Data Calls' ? (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
              <DataCallsScreen />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full overflow-y-auto">
              <div className="text-center">
                <p style={{ fontSize: 'var(--gh-font-size-md)', color: 'var(--gh-text-disabled)' }}>
                  {activeTab} — coming soon
                </p>
                <p style={{ fontSize: 'var(--gh-font-size-sm)', color: 'var(--gh-border)', marginTop: 'var(--gh-space-2)' }}>
                  Confirm sections in Strategy &amp; Plan to seed this tab
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
