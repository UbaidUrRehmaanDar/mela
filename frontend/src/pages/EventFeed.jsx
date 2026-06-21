import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { getFilteredEvents, searchEvents } from '../services';
import { supabase } from '../config/supabase';
import { EVENT_UNIVERSITIES, CATEGORY_COLORS, CATEGORIES } from '../utils/constants';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import EventCard from '../components/ui/EventCard';
import Badge from '../components/ui/Badge';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import { SkeletonGrid } from '../components/ui/Skeleton';

const PAGE_SIZE = 12;

const INTEREST_TO_CATEGORIES_MAP = {
  Technology: ['Tech', 'Hackathon', 'Conference', 'Workshop'],
  'Artificial Intelligence': ['Tech', 'Hackathon', 'Workshop'],
  'Software Development': ['Tech', 'Hackathon', 'Workshop'],
  Business: ['Seminar', 'Conference', 'Meetup'],
  Entrepreneurship: ['Seminar', 'Conference', 'Meetup'],
  Arts: ['Workshop', 'Meetup', 'Other'],
  Design: ['Workshop', 'Meetup', 'Other'],
  Sports: ['Competition', 'Other'],
  'Medical Sciences': ['Seminar', 'Conference'],
  Engineering: ['Tech', 'Workshop', 'Conference'],
  Research: ['Seminar', 'Conference'],
  'Community Service': ['Meetup', 'Other'],
};

function FilterSidebar({ filters, onFilterChange, onApply, onReset, mobile = false }) {
  return (
    <aside className={`filter-sidebar ${mobile ? 'open' : ''}`} aria-label="Event filters">
      <h3>Filters</h3>

      <div className="filter-group">
        <span className="filter-group-title">By Category</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {CATEGORIES.map((cat) => (
            <label key={cat} className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.category === cat}
                onChange={(e) => onFilterChange('category', e.target.checked ? cat : '')}
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <span className="filter-group-title">By University</span>
        <select
          value={filters.university}
          onChange={(e) => onFilterChange('university', e.target.value)}
          aria-label="Filter by university"
        >
          <option value="">All Universities</option>
          {EVENT_UNIVERSITIES.map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={filters.upcomingOnly}
            onChange={(e) => onFilterChange('upcomingOnly', e.target.checked)}
          />
          Upcoming Only
        </label>
      </div>

      <div className="filter-actions">
        <Button variant="primary" onClick={onApply} style={{ width: '100%', minWidth: 0 }}>
          Apply Filters
        </Button>
        <Button variant="outline" onClick={onReset} style={{ width: '100%', minWidth: 0 }}>
          Reset
        </Button>
      </div>
    </aside>
  );
}

export default function EventFeed() {
  const [searchParams] = useSearchParams();
  const { profile } = useAuth();
  const [allEvents, setAllEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState({
    university: '',
    category: searchParams.get('category') || '',
    upcomingOnly: true,
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [eventStats, setEventStats] = useState({});

  const totalPages = Math.ceil(allEvents.length / PAGE_SIZE);

  const fetchCountsForEvents = async (eventList) => {
    if (!eventList.length) return;
    const ids = eventList.map((e) => e.id);

    const [likesRes, commentsRes, regsRes] = await Promise.all([
      supabase.from('likes').select('event_id, id').in('event_id', ids),
      supabase.from('comments').select('event_id, id').in('event_id', ids),
      supabase.from('registrations').select('event_id, id').in('event_id', ids),
    ]);

    const counts = {};
    ids.forEach((id) => { counts[id] = { likes: 0, comments: 0, registrations: 0 }; });

    (likesRes.data || []).forEach((r) => { if (counts[r.event_id]) counts[r.event_id].likes++; });
    (commentsRes.data || []).forEach((r) => { if (counts[r.event_id]) counts[r.event_id].comments++; });
    (regsRes.data || []).forEach((r) => { if (counts[r.event_id]) counts[r.event_id].registrations++; });

    setEventStats(counts);
  };

  const paginate = useCallback((list, p) => {
    const start = (p - 1) * PAGE_SIZE;
    const sliced = list.slice(start, start + PAGE_SIZE);
    setEvents(sliced);
    fetchCountsForEvents(sliced);
  }, []);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    const result = await getFilteredEvents(filters);
    if (result.success) {
      setAllEvents(result.events);
      setPage(1);
      paginate(result.events, 1);
    }
    setLoading(false);
  }, [filters, paginate]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    if (profile?.interests?.length > 0 && allEvents.length > 0) {
      const targetCategories = new Set();
      profile.interests.forEach((interest) => {
        (INTEREST_TO_CATEGORIES_MAP[interest] || []).forEach((c) => targetCategories.add(c));
      });

      const recommended = allEvents.filter((event) => targetCategories.has(event.category));
      recommended.sort((a, b) => {
        const isAMyUni = a.university === profile.university;
        const isBMyUni = b.university === profile.university;
        if (isAMyUni && !isBMyUni) return -1;
        if (!isAMyUni && isBMyUni) return 1;
        return a.dateTime - b.dateTime;
      });

      setRecommendedEvents(recommended);
    } else {
      setRecommendedEvents([]);
    }
  }, [profile, allEvents]);

  useEffect(() => {
    paginate(allEvents, page);
  }, [page, allEvents, paginate]);

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      setLoading(true);
      const result = await searchEvents(searchTerm);
      if (result.success) {
        setAllEvents(result.events);
        setPage(1);
        paginate(result.events, 1);
      }
      setLoading(false);
    } else {
      fetchEvents();
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleReset = () => {
    setFilters({ university: '', category: '', upcomingOnly: true });
    setSearchTerm('');
    setShowMobileFilters(false);
  };

  return (
    <div className="container animate-fade-in">
      <PageHeader
        title="Discover Events"
        subtitle="Find hackathons, workshops, and meetups across campuses."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Events' }]}
        actions={
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search events by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                aria-label="Search events"
              />
              <button onClick={handleSearch} title="Search" aria-label="Search">
                <Search size={16} strokeWidth={2.5} />
              </button>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="filter-panel-mobile-trigger"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 'auto' }}
            >
              <SlidersHorizontal size={14} />
              Filters
            </Button>
          </div>
        }
      />

      <div className="category-pills" style={{ marginBottom: '24px' }}>
        <button
          type="button"
          className={`btn-pill ${!filters.category ? 'active' : ''}`}
          style={!filters.category ? { background: 'var(--yellow)' } : undefined}
          onClick={() => handleFilterChange('category', '')}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`btn-pill ${filters.category === cat ? 'active' : ''}`}
            style={{ background: CATEGORY_COLORS[cat] || 'var(--off-white)' }}
            onClick={() => handleFilterChange('category', cat === filters.category ? '' : cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {showMobileFilters && (
        <>
          <div className="modal-overlay" onClick={() => setShowMobileFilters(false)} aria-hidden="true" />
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onApply={() => { fetchEvents(); setShowMobileFilters(false); }}
            onReset={handleReset}
            mobile
          />
        </>
      )}

      <div className="discover-layout">
        <FilterSidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          onApply={fetchEvents}
          onReset={handleReset}
        />

        <div>
          {!loading && recommendedEvents.length > 0 && (
            <div className="recommended-section">
              <h2 className="section-heading" style={{ fontSize: '1.75rem' }}>
                <Sparkles size={22} aria-hidden="true" /> Recommended for you
              </h2>
              <div className="grid-3">
                {recommendedEvents.slice(0, 3).map((event) => (
                  <EventCard
                    key={`rec-${event.id}`}
                    event={event}
                    variant="recommended"
                    extraBadges={
                      event.university === profile?.university ? (
                        <Badge className="badge-verified">My Campus</Badge>
                      ) : null
                    }
                    showRegister
                  />
                ))}
              </div>
            </div>
          )}

          {loading ? (
            <SkeletonGrid count={6} />
          ) : allEvents.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No events found"
              description={searchTerm ? 'Try a different search term' : 'No events match your filters'}
              action={
                <Button variant="outline" onClick={handleReset}>
                  Clear Filters
                </Button>
              }
            />
          ) : (
            <>
              <p className="font-ui" style={{ fontWeight: 700, marginBottom: '16px' }}>
                {allEvents.length} event{allEvents.length !== 1 ? 's' : ''} found
                {totalPages > 1 && ` — page ${page} of ${totalPages}`}
              </p>

              <div className="grid-4">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} stats={eventStats[event.id]} showRegister />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    style={{ minWidth: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <ChevronLeft size={14} /> Prev
                  </Button>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPage(p)}
                        className={`page-num ${p === page ? 'active' : ''}`}
                        aria-current={p === page ? 'page' : undefined}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    style={{ minWidth: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    Next <ChevronRight size={14} />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
