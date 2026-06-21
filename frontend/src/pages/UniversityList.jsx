import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, ExternalLink } from 'lucide-react';
import { UNIVERSITY_PROFILES, ICON_MAP } from '../utils/universitiesData';
import { supabase } from '../config/supabase';
import Button from '../components/ui/Button';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';

export default function UniversityList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [eventCounts, setEventCounts] = useState({});

  useEffect(() => {
    const fetchCounts = async () => {
      const { data } = await supabase
        .from('events')
        .select('university')
        .eq('approved', true);
      if (data) {
        const counts = {};
        data.forEach((e) => {
          counts[e.university] = (counts[e.university] || 0) + 1;
        });
        setEventCounts(counts);
      }
    };
    fetchCounts();
  }, []);

  const filteredUniversities = UNIVERSITY_PROFILES.filter((uni) =>
    uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    uni.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container animate-fade-in">
      <PageHeader
        title="Your Universities"
        subtitle="Discover events happening at partner universities across Pakistan."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Campuses' }]}
        actions={
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search universities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search universities"
            />
            <button type="button" title="Search" aria-label="Search">
              <Search size={16} strokeWidth={2.5} />
            </button>
          </div>
        }
      />

      {filteredUniversities.length === 0 ? (
        <EmptyState
          title="No universities found"
          description="Try a different search term or check spelling."
        />
      ) : (
        <div className="grid-3">
          {filteredUniversities.map((uni) => {
            const IconComponent = ICON_MAP[uni.icon] || ICON_MAP.School;
            const count = eventCounts[uni.name] || 0;
            return (
              <article key={uni.id} className="university-card">
                <div>
                  <div className="university-card-icon">
                    <IconComponent size={32} strokeWidth={2.5} aria-hidden="true" />
                  </div>

                  <h2>{uni.name}</h2>

                  <div className="location">
                    <MapPin size={16} aria-hidden="true" />
                    {uni.location.split(',')[0]}
                  </div>

                  <p className="event-count">{count} Active Event{count !== 1 ? 's' : ''}</p>

                  <p>{uni.description}</p>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <Link to={`/universities/${encodeURIComponent(uni.name)}`} style={{ flex: 1, textDecoration: 'none' }}>
                    <Button variant="outline" style={{ width: '100%', minWidth: 0 }}>
                      View University
                    </Button>
                  </Link>
                  {uni.website && (
                    <a href={uni.website} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${uni.name} website`}>
                      <Button variant="outline" style={{ minWidth: 'auto', padding: '12px' }}>
                        <ExternalLink size={16} />
                      </Button>
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
