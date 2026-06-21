import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus, CalendarDays, Clock, CheckCircle2, XCircle,
  Users, Eye, Pencil, Trash2, X, RefreshCw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  getMySubmissions, deleteSubmission,
  getOrganizerEvents, getEventRegistrations,
} from '../services';
import { formatEventDate } from '../utils/constants';
import Button from '../components/ui/Button';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import { SkeletonList } from '../components/ui/Skeleton';
import { useToast } from '../components/ui/Toast';
import { useConfirm } from '../components/ui/ConfirmDialog';

/* ── status config ──────────────────────────────────────────── */
const STATUS = {
  pending:  { label: 'Pending Review', color: 'var(--yellow)', text: '#000' },
  rejected: { label: 'Rejected',       color: 'var(--pink)',   text: '#fff' },
  approved: { label: 'Live',           color: 'var(--cyan)',   text: '#000' },
};

/* ── tiny StatusPill ─────────────────────────────────────────── */
function StatusPill({ status }) {
  const s = STATUS[status] ?? STATUS.pending;
  return (
    <span style={{
      fontFamily: 'var(--font-heading)', fontSize: 11, fontWeight: 800,
      textTransform: 'uppercase', letterSpacing: '0.08em',
      padding: '4px 10px', border: '2px solid #000',
      background: s.color, color: s.text,
      display: 'inline-flex', alignItems: 'center', gap: 5,
    }}>
      {status === 'pending'  && <Clock       size={11} />}
      {status === 'rejected' && <XCircle     size={11} />}
      {status === 'approved' && <CheckCircle2 size={11} />}
      {s.label}
    </span>
  );
}

/* ── registrations modal ─────────────────────────────────────── */
function RegistrantsModal({ event, onClose }) {
  const [rows, setRows]       = useState([]);
  const [busy, setBusy]       = useState(true);

  useEffect(() => {
    getEventRegistrations(event.id).then(r => {
      if (r.success) setRows(r.registrations);
      setBusy(false);
    });
  }, [event.id]);

  return (
    <div
      role="dialog" aria-modal="true" aria-label="Registrants"
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--white)', border: '3px solid #000',
          boxShadow: '8px 8px 0 #000', width: '100%', maxWidth: 560,
          maxHeight: '80vh', display: 'flex', flexDirection: 'column',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* header */}
        <div style={{
          padding: '16px 20px', borderBottom: '3px solid #000',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'var(--yellow)',
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800 }}>
              Registrants
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 13, fontWeight: 700, color: '#555' }}>
              {event.title}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: '2px solid #000', padding: 6, cursor: 'pointer', display: 'flex' }}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* body */}
        <div style={{ overflowY: 'auto', flex: 1, padding: 20 }}>
          {busy ? (
            <SkeletonList count={3} />
          ) : rows.length === 0 ? (
            <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, textAlign: 'center', padding: '32px 0', color: 'var(--gray-500)' }}>
              No registrations yet.
            </p>
          ) : (
            <>
              <p style={{ fontFamily: 'var(--font-heading)', fontSize: 13, fontWeight: 700, marginBottom: 12, color: 'var(--gray-500)' }}>
                {rows.length} total
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {rows.map(r => (
                  <div key={r.id} style={{
                    border: '2px solid #000', padding: '10px 14px',
                    background: 'var(--off-white)', boxShadow: '2px 2px 0 #000',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap',
                  }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 14 }}>{r.userName || r.user_name}</div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--gray-500)' }}>{r.userEmail || r.user_email}</div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: 12, fontWeight: 700, color: 'var(--gray-500)', textAlign: 'right' }}>
                      {r.userUniversity || r.user_university || '—'}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── event row card ──────────────────────────────────────────── */
function EventRow({ item, type, onDelete, onViewRegistrants }) {
  const status = type === 'approved' ? 'approved' : item.status;
  const title  = item.title;
  const date   = type === 'approved' ? item.dateTime : item.dateTime;
  const uni    = item.university;
  const isRejected = status === 'rejected';

  return (
    <div style={{
      background: 'var(--white)', border: '3px solid #000',
      boxShadow: '5px 5px 0 #000', padding: '18px 20px',
      display: 'flex', gap: 16, alignItems: 'flex-start',
      flexWrap: 'wrap',
      transition: 'transform 120ms, box-shadow 120ms',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '7px 7px 0 #000'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '5px 5px 0 #000'; }}
    >
      {/* left accent */}
      <div style={{
        width: 6, minHeight: 60, flexShrink: 0,
        background: STATUS[status]?.color ?? 'var(--gray-100)',
        border: '2px solid #000',
      }} />

      {/* main content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 6 }}>
          <StatusPill status={status} />
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: 12, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase' }}>
            {uni}
          </span>
        </div>

        <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, lineHeight: 1.2, marginBottom: 4 }}>
          {title}
        </div>

        <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <CalendarDays size={13} />
          {date ? formatEventDate(date) : '—'}
        </div>

        {isRejected && item.rejection_reason && (
          <div style={{
            marginTop: 10, padding: '8px 12px',
            background: '#FFE0E0', border: '2px solid var(--pink)',
            fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500,
          }}>
            <strong>Reason: </strong>{item.rejection_reason}
          </div>
        )}
      </div>

      {/* actions */}
      <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexWrap: 'wrap', alignItems: 'center' }}>
        {type === 'approved' && (
          <>
            <Button variant="outline" size="sm"
              onClick={() => onViewRegistrants(item)}
              style={{ display: 'flex', alignItems: 'center', gap: 5 }}
            >
              <Users size={14} /> Registrants
            </Button>
            <Link to={`/events/${item.id}`} style={{ textDecoration: 'none' }}>
              <Button variant="outline" size="sm" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Eye size={14} /> View
              </Button>
            </Link>
          </>
        )}

        {type === 'submission' && status === 'rejected' && (
          <Button variant="danger" size="sm"
            onClick={() => onDelete(item.id, item.title)}
            style={{ display: 'flex', alignItems: 'center', gap: 5 }}
          >
            <Trash2 size={14} /> Delete
          </Button>
        )}

        {type === 'submission' && status === 'pending' && (
          <Button variant="danger" size="sm"
            onClick={() => onDelete(item.id, item.title)}
            style={{ display: 'flex', alignItems: 'center', gap: 5 }}
          >
            <Trash2 size={14} /> Cancel
          </Button>
        )}
      </div>
    </div>
  );
}

/* ── main page ───────────────────────────────────────────────── */
export default function MyEvents() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast }   = useToast();
  const { confirm } = useConfirm();

  const [tab, setTab]                 = useState('live');     // 'live' | 'pending' | 'rejected'
  const [submissions, setSubmissions] = useState([]);
  const [approved, setApproved]       = useState([]);
  const [busy, setBusy]               = useState(true);
  const [registrantsFor, setRegistrantsFor] = useState(null); // event object | null

  /* ── load data ─────────────────────────────────────────────── */
  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/login'); return; }

    let alive = true;

    async function load() {
      setBusy(true);
      try {
        const [subRes, approvedRes] = await Promise.all([
          getMySubmissions(),
          getOrganizerEvents(user.id),
        ]);
        if (!alive) return;
        if (subRes.success)     setSubmissions(subRes.submissions);
        if (approvedRes.success) setApproved(approvedRes.events);
      } catch (err) {
        if (alive) toast('Failed to load your events', 'error');
      } finally {
        if (alive) setBusy(false);
      }
    }

    load();
    return () => { alive = false; };
  }, [user, authLoading]);

  /* ── delete rejected submission ────────────────────────────── */
  async function handleDelete(id, title) {
    const ok = await confirm({
      title: 'Delete submission?',
      message: `"${title}" will be permanently removed.`,
      confirmLabel: 'Delete',
      variant: 'danger',
    });
    if (!ok) return;

    const res = await deleteSubmission(id);
    if (res.success) {
      toast('Submission deleted');
      setSubmissions(prev => prev.filter(s => s.id !== id));
    } else {
      console.error('Delete failed:', res.error);
      toast(res.error || 'Failed to delete — check console for details', 'error');
    }
  }

  /* ── derived lists ─────────────────────────────────────────── */
  const pending  = submissions.filter(s => s.status === 'pending');
  const rejected = submissions.filter(s => s.status === 'rejected');

  const TABS = [
    { key: 'live',     label: 'Live Events',  count: approved.length  },
    { key: 'pending',  label: 'In Review',    count: pending.length   },
    { key: 'rejected', label: 'Rejected',     count: rejected.length  },
  ];

  /* ── tab colours ────────────────────────────────────────────── */
  const TAB_ACCENT = { live: 'var(--cyan)', pending: 'var(--yellow)', rejected: 'var(--pink)' };

  return (
    <div className="container animate-fade-in" style={{ maxWidth: 860 }}>
      <PageHeader
        title="My Events"
        subtitle="Track everything you've submitted and published."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'My Events' }]}
        actions={
          <Link to="/submit" style={{ textDecoration: 'none' }}>
            <Button variant="primary" size="sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Plus size={15} /> New Event
            </Button>
          </Link>
        }
      />

      {/* ── stat bar ─────────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12, marginBottom: 28,
      }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: '16px 20px', border: '3px solid #000', cursor: 'pointer',
              background: tab === t.key ? TAB_ACCENT[t.key] : 'var(--white)',
              boxShadow: tab === t.key ? '5px 5px 0 #000' : '3px 3px 0 #000',
              transform: tab === t.key ? 'translate(-2px,-2px)' : '',
              transition: 'all 120ms', textAlign: 'left',
            }}
          >
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, lineHeight: 1 }}>
              {busy ? '—' : t.count}
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#555', marginTop: 4 }}>
              {t.label}
            </div>
          </button>
        ))}
      </div>

      {/* ── content ──────────────────────────────────────────── */}
      {busy ? (
        <SkeletonList count={4} />
      ) : (
        <>
          {/* refresh */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <button
              onClick={async () => {
                setBusy(true);
                const [subRes, approvedRes] = await Promise.all([
                  getMySubmissions(), getOrganizerEvents(user.id),
                ]);
                if (subRes.success)      setSubmissions(subRes.submissions);
                if (approvedRes.success) setApproved(approvedRes.events);
                setBusy(false);
              }}
              style={{
                background: 'none', border: '2px solid #000', padding: '6px 12px',
                fontFamily: 'var(--font-heading)', fontSize: 13, fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              <RefreshCw size={13} /> Refresh
            </button>
          </div>

          {/* live tab */}
          {tab === 'live' && (
            approved.length === 0 ? (
              <EmptyState
                icon={CalendarDays}
                title="No live events yet"
                description="Your approved events will appear here."
                action={<Link to="/submit" style={{ textDecoration: 'none' }}><Button variant="primary">Submit an Event</Button></Link>}
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {approved.map(ev => (
                  <EventRow
                    key={ev.id}
                    item={ev}
                    type="approved"
                    onViewRegistrants={setRegistrantsFor}
                  />
                ))}
              </div>
            )
          )}

          {/* pending tab */}
          {tab === 'pending' && (
            pending.length === 0 ? (
              <EmptyState
                icon={Clock}
                title="Nothing under review"
                description="Events you submit will appear here while moderators review them."
                action={<Link to="/submit" style={{ textDecoration: 'none' }}><Button variant="primary">Submit an Event</Button></Link>}
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {pending.map(sub => (
                  <EventRow key={sub.id} item={sub} type="submission" onDelete={handleDelete} />
                ))}
              </div>
            )
          )}

          {/* rejected tab */}
          {tab === 'rejected' && (
            rejected.length === 0 ? (
              <EmptyState
                icon={XCircle}
                title="No rejected submissions"
                description="Any submissions that were rejected will show up here."
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {rejected.map(sub => (
                  <EventRow
                    key={sub.id}
                    item={sub}
                    type="submission"
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )
          )}
        </>
      )}

      {/* ── registrants modal ────────────────────────────────── */}
      {registrantsFor && (
        <RegistrantsModal event={registrantsFor} onClose={() => setRegistrantsFor(null)} />
      )}
    </div>
  );
}
