import React, { useState, useEffect, useCallback } from 'react';
import {
  RefreshCw, CheckCircle, AlertCircle,
  UserCheck, FileText, Download, Check, X,
} from 'lucide-react';
import {
  getAllUsers, adminUpdateUserProfile,
  getAllOrganizerApplications, reviewOrganizerApplication,
} from '../services';
import { UNIVERSITIES } from '../utils/constants';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import PageHeader from '../components/ui/PageHeader';
import { SkeletonList } from '../components/ui/Skeleton';
import { useToast } from '../components/ui/Toast';
import { useConfirm } from '../components/ui/ConfirmDialog';

const TAB_STYLE = (active, color) => ({
  padding: '0.8rem 1.5rem', fontFamily: 'inherit', fontWeight: 900, textTransform: 'uppercase',
  border: '3px solid black', borderBottom: 'none', borderRadius: 0, cursor: 'pointer',
  background: active ? color : 'white',
  boxShadow: active ? '0px 0px 0 black' : '2px -2px 0 black',
  transform: active ? 'translateY(4px)' : 'none',
  fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem',
  transition: 'all 80ms',
});

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');

  // Users
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({ role: '', moderatorFor: [] });

  // Organizer Applications
  const [applications, setApplications] = useState([]);
  const [reviewingApp, setReviewingApp] = useState(null);
  const [rejectFeedback, setRejectFeedback] = useState('');
  const [appsLoading, setAppsLoading] = useState(false);

  // Shared
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  const { toast } = useToast();
  const { confirm } = useConfirm();

  /* ── data loading ─────────────────────────────────────────── */
  const fetchAll = useCallback(async () => {
    setLoading(true);
    setMessage('');
    try {
      const [usersRes, appsRes] = await Promise.all([
        getAllUsers(),
        getAllOrganizerApplications(),
      ]);
      if (usersRes.success) { setUsers(usersRes.users); setFilteredUsers(usersRes.users); }
      if (appsRes.success)  setApplications(appsRes.applications);
    } catch {
      setMessage('Failed to load admin data'); setMessageType('error');
    }
    setLoading(false);
    setAppsLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Refresh active tab on switch
  const prevTab = React.useRef(activeTab);
  useEffect(() => {
    if (prevTab.current === activeTab) return;
    prevTab.current = activeTab;
    if (activeTab === 'users') {
      getAllUsers().then(r => { if (r.success) { setUsers(r.users); setFilteredUsers(r.users); } });
    } else if (activeTab === 'applications') {
      setAppsLoading(true);
      getAllOrganizerApplications().then(r => {
        if (r.success) setApplications(r.applications);
        setAppsLoading(false);
      });
    }
  }, [activeTab]);

  // Live search filter
  useEffect(() => {
    const t = searchTerm.toLowerCase();
    setFilteredUsers(users.filter(u =>
      (u.displayName || u.display_name || '').toLowerCase().includes(t) ||
      (u.email || '').toLowerCase().includes(t) ||
      (u.university || '').toLowerCase().includes(t)
    ));
  }, [searchTerm, users]);

  /* ── user actions ─────────────────────────────────────────── */
  const handleEditClick = (u) => {
    setEditingUser(u);
    setEditFormData({ role: u.role || 'student', moderatorFor: u.moderatorFor || u.moderator_for || [] });
  };

  const handleRoleChange = (e) => setEditFormData(prev => ({
    ...prev,
    role: e.target.value,
    moderatorFor: e.target.value === 'moderator' ? prev.moderatorFor : [],
  }));

  const handleUniCheckbox = (uni) => setEditFormData(prev => {
    const list = [...prev.moderatorFor];
    const i = list.indexOf(uni);
    if (i > -1) list.splice(i, 1); else list.push(uni);
    return { ...prev, moderatorFor: list };
  });

  const handleSaveUser = async (e) => {
    e.preventDefault();
    setSaving(true); setMessage('');
    const result = await adminUpdateUserProfile(editingUser.id, editFormData);
    if (result.success) {
      setMessage(`Updated ${editingUser.email}`); setMessageType('success');
      setEditingUser(null); fetchAll();
    } else {
      setMessage(result.error); setMessageType('error');
    }
    setSaving(false);
  };

  /* ── application actions ──────────────────────────────────── */
  const handleApproveApp = async (app) => {
    const ok = await confirm({
      title: 'Approve organizer?',
      message: `Approve ${app.displayName || app.display_name} as moderator for ${app.university}?`,
      confirmLabel: 'Approve',
    });
    if (!ok) return;
    setSaving(true); setMessage('');
    const result = await reviewOrganizerApplication(app.id, app.userId || app.user_id, 'approve', '', app.university);
    if (result.success) {
      setMessage(`Approved ${app.displayName || app.display_name}`); setMessageType('success'); fetchAll();
    } else {
      setMessage(result.error); setMessageType('error');
    }
    setSaving(false);
  };

  const handleRejectAppSubmit = async (e) => {
    e.preventDefault();
    if (!rejectFeedback.trim()) { toast('Please provide feedback', 'error'); return; }
    setSaving(true); setMessage('');
    const result = await reviewOrganizerApplication(
      reviewingApp.id, reviewingApp.userId || reviewingApp.user_id,
      'reject', rejectFeedback, reviewingApp.university
    );
    if (result.success) {
      setMessage(`Rejected application for ${reviewingApp.displayName || reviewingApp.display_name}`);
      setMessageType('success'); setReviewingApp(null); setRejectFeedback(''); fetchAll();
    } else {
      setMessage(result.error); setMessageType('error');
    }
    setSaving(false);
  };

  const isInitialLoading = loading && users.length === 0 && applications.length === 0;

  /* ── render ───────────────────────────────────────────────── */
  return (
    <div className="container animate-fade-in">
      <PageHeader
        title="Admin Panel"
        subtitle={isInitialLoading ? 'Loading...' : 'Manage users and organizer applications.'}
      />

      {isInitialLoading ? <SkeletonList count={5} /> : (
        <div style={{ position: 'relative', margin: '0 0 2rem' }}>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '4px solid black' }}>
            <button onClick={() => setActiveTab('users')} style={TAB_STYLE(activeTab === 'users', 'var(--yellow)')}>
              <UserCheck size={16} /> User Accounts ({users.length})
            </button>
            <button onClick={() => setActiveTab('applications')} style={TAB_STYLE(activeTab === 'applications', 'var(--cyan)')}>
              <FileText size={16} /> Organizer Applications ({applications.filter(a => a.status === 'pending').length})
            </button>
          </div>

          {/* Status message */}
          {message && (
            <div style={{
              padding: '1rem', background: messageType === 'error' ? 'var(--pink)' : 'var(--cyan)',
              border: '3px solid black', marginBottom: '1.5rem', fontWeight: 700,
              boxShadow: '4px 4px 0 black', display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              {messageType === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
              {message}
            </div>
          )}

          {/* ── USERS TAB ───────────────────────────────────── */}
          {activeTab === 'users' && (
            <div style={{ display: 'grid', gridTemplateColumns: editingUser ? '1.5fr 1fr' : '1fr', gap: '2rem' }}>
              <div className="brutal-border" style={{ background: 'white', padding: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ flex: 1 }}>
                    <Input
                      placeholder="Search by name, email, or university..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      style={{ marginBottom: 0 }}
                    />
                  </div>
                  <Button variant="outline" onClick={fetchAll} style={{ padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <RefreshCw size={16} /> Refresh
                  </Button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '4px solid black', background: 'var(--off-white)' }}>
                        {['User', 'University', 'Role', 'Moderates', ''].map(h => (
                          <th key={h} style={{ padding: '1rem', fontWeight: 800, textAlign: h === '' ? 'right' : 'left' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length === 0 ? (
                        <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', fontWeight: 700 }}>No users found</td></tr>
                      ) : filteredUsers.map(u => (
                        <tr key={u.id} style={{ borderBottom: '2px solid black', background: editingUser?.id === u.id ? 'rgba(255,214,0,0.2)' : 'transparent' }}>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ fontWeight: 700 }}>{u.displayName || u.display_name || 'Anonymous'}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--gray-600)' }}>{u.email}</div>
                          </td>
                          <td style={{ padding: '1rem', fontWeight: 700 }}>{u.university || '—'}</td>
                          <td style={{ padding: '1rem' }}>
                            <span style={{
                              padding: '0.3rem 0.6rem', border: '2px solid black',
                              fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', display: 'inline-block',
                              background: u.role === 'admin' ? 'var(--pink)' : u.role === 'moderator' ? 'var(--orange)' : u.role === 'advisor' ? 'var(--purple)' : 'var(--cyan)',
                            }}>{u.role}</span>
                          </td>
                          <td style={{ padding: '1rem', fontSize: '0.85rem' }}>
                            {u.role === 'moderator' ? (
                              (u.moderatorFor || u.moderator_for || []).length > 0
                                ? <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                                    {(u.moderatorFor || u.moderator_for).map(uni => (
                                      <span key={uni} style={{ background: 'var(--gray-100)', border: '1px solid black', padding: '0.1rem 0.4rem', fontSize: '0.75rem', fontWeight: 700 }}>{uni}</span>
                                    ))}
                                  </div>
                                : <span style={{ color: 'var(--pink)', fontWeight: 700 }}>None assigned</span>
                            ) : <span style={{ color: 'var(--gray-400)' }}>—</span>}
                          </td>
                          <td style={{ padding: '1rem', textAlign: 'right' }}>
                            <Button variant="primary" onClick={() => handleEditClick(u)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>
                              Edit Role
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {editingUser && (
                <div className="brutal-border" style={{ background: 'var(--yellow)', padding: '2rem', alignSelf: 'start', position: 'sticky', top: '20px' }}>
                  <h2 style={{ textTransform: 'uppercase', fontSize: '1.8rem', marginBottom: '1rem', borderBottom: '3px solid black', paddingBottom: '0.5rem' }}>Edit Permissions</h2>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ margin: '0 0 0.2rem', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase' }}>Selected User</p>
                    <div style={{ background: 'white', border: '2px solid black', padding: '0.8rem', fontWeight: 700 }}>
                      <div>{editingUser.displayName || editingUser.display_name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--gray-600)' }}>{editingUser.email}</div>
                    </div>
                  </div>
                  <form onSubmit={handleSaveUser}>
                    <Input label="Account Role" name="role" type="select"
                      options={['student', 'advisor', 'moderator', 'admin']}
                      value={editFormData.role} onChange={handleRoleChange} required />
                    {editFormData.role === 'moderator' && (
                      <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem' }}>Assign Campus(es)</label>
                        <div style={{ background: 'white', border: '3px solid black', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
                          {UNIVERSITIES.filter(u => u !== 'Other' && u !== '').map(uni => (
                            <label key={uni} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, cursor: 'pointer' }}>
                              <input type="checkbox"
                                checked={editFormData.moderatorFor.includes(uni)}
                                onChange={() => handleUniCheckbox(uni)}
                                style={{ width: 18, height: 18, accentColor: 'black', cursor: 'pointer' }}
                              />
                              {uni}
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                      <Button variant="secondary" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
                      <Button variant="outline" type="button" onClick={() => setEditingUser(null)}>Cancel</Button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ── APPLICATIONS TAB ────────────────────────────── */}
          {activeTab === 'applications' && (
            <div style={{ display: 'grid', gridTemplateColumns: reviewingApp ? '1.5fr 1fr' : '1fr', gap: '2rem' }}>
              <div className="brutal-border" style={{ background: 'white', padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2>Organizer Applications</h2>
                  <Button variant="outline" onClick={fetchAll} disabled={appsLoading}>
                    {appsLoading ? 'Refreshing...' : 'Refresh'}
                  </Button>
                </div>

                {applications.length === 0 ? (
                  <div style={{ padding: '3rem', textAlign: 'center', fontWeight: 700, background: 'var(--off-white)', border: '2px solid black' }}>
                    No applications in queue.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {applications.map(app => (
                      <div key={app.id} className="brutal-border" style={{
                        background: app.status === 'pending' ? 'var(--yellow)' : app.status === 'approved' ? 'var(--cyan)' : 'var(--pink)',
                        padding: '1.5rem',
                      }}>
                        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
                          <span style={{ padding: '0.2rem 0.5rem', background: 'white', border: '2px solid black', fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase' }}>
                            {app.status}
                          </span>
                          <span style={{ fontWeight: 800 }}>
                            {app.created_at ? new Date(app.created_at).toLocaleDateString() : '—'}
                          </span>
                        </div>

                        <h3 style={{ fontSize: '1.3rem', fontWeight: 900, marginTop: '0.5rem', textTransform: 'uppercase' }}>
                          {app.displayName || app.display_name} — {app.societyName || app.society_name}
                        </h3>
                        <p style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>Campus: {app.university}</p>

                        <div style={{ background: 'white', padding: '0.75rem', border: '2px solid black', marginBottom: '1rem', fontSize: '0.95rem' }}>
                          <strong>Reason:</strong> {app.reason}
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                          {(app.idCardURL || app.id_card_url) && (
                            <a href={app.idCardURL || app.id_card_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                              <Button variant="outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'white' }}>
                                <Download size={12} /> Student ID
                              </Button>
                            </a>
                          )}
                          {(app.societyProofURL || app.society_proof_url) && (
                            <a href={app.societyProofURL || app.society_proof_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                              <Button variant="outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'white' }}>
                                <Download size={12} /> Society Proof
                              </Button>
                            </a>
                          )}
                          {(app.authorizationURL || app.authorization_url) && (
                            <a href={app.authorizationURL || app.authorization_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                              <Button variant="outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'white' }}>
                                <Download size={12} /> Auth Letter
                              </Button>
                            </a>
                          )}
                        </div>

                        {app.status === 'pending' && (
                          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.2rem' }}>
                            <Button variant="success" onClick={() => handleApproveApp(app)} style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <Check size={14} /> Approve
                            </Button>
                            <Button variant="danger" onClick={() => { setReviewingApp(app); setRejectFeedback(''); }} style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <X size={14} /> Reject
                            </Button>
                          </div>
                        )}

                        {app.feedback && (
                          <div style={{ fontSize: '0.9rem', borderTop: '1px solid black', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                            <strong>Feedback:</strong> {app.feedback}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {reviewingApp && (
                <div className="brutal-border" style={{ background: 'var(--pink)', padding: '2rem', alignSelf: 'start', position: 'sticky', top: '20px', color: 'white' }}>
                  <h2 style={{ textTransform: 'uppercase', fontSize: '1.5rem', marginBottom: '1rem', borderBottom: '3px solid white', paddingBottom: '0.5rem' }}>Reject Application</h2>
                  <div style={{ marginBottom: '1rem', background: 'white', border: '2px solid black', padding: '0.8rem', color: 'black', fontWeight: 700 }}>
                    <div>{reviewingApp.displayName || reviewingApp.display_name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--gray-600)' }}>{reviewingApp.societyName || reviewingApp.society_name}</div>
                  </div>
                  <form onSubmit={handleRejectAppSubmit}>
                    <div className="input-group">
                      <label style={{ color: 'white' }}>Rejection Feedback</label>
                      <textarea
                        placeholder="e.g. ID card image is blurry..."
                        value={rejectFeedback}
                        onChange={e => setRejectFeedback(e.target.value)}
                        required
                        style={{ padding: '0.8rem', fontFamily: 'inherit', fontWeight: 700, minHeight: '100px', border: '3px solid black' }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                      <Button variant="outline" type="submit" disabled={saving} style={{ flex: 1, color: 'black', background: 'white' }}>
                        {saving ? 'Rejecting...' : 'Reject'}
                      </Button>
                      <Button variant="outline" type="button" onClick={() => setReviewingApp(null)} style={{ flex: 1, color: 'black', background: 'white' }}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

        </div>
      )}
    </div>
  );
}
