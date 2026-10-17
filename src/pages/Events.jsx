import { useState } from 'react';
import { CalendarDays, Check, MapPin, Plus, Users } from 'lucide-react';
import { Art, Avatar, Button, Empty, ErrorNotice, Modal, PageHeading, useUI } from '../components/UI';
import { useStore } from '../state/Store';
import { uid } from '../state/model';
import { dateLabel, eventTime } from '../lib/format';

export function EventCard({ event }) {
  const { state, person } = useStore(); const { openModal } = useUI();
  const attending = state.attending.includes(event.id);
  return <article className="panel event-card"><button className="event-cover" onClick={() => openModal('event', event.id)}><Art name={event.art} alt={event.title}/><span className="date-stamp"><small>{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</small><b>{new Date(event.date).getDate()}</b></span>{attending && <span className="going-pill"><Check size={12}/>Going</span>}</button><div className="event-content"><span className="event-time">{eventTime(event.date)}</span><button className="title-button" onClick={() => openModal('event', event.id)}><h2>{event.title}</h2></button><p><MapPin size={13}/>{event.location}</p><div className="event-card-footer"><span className="avatar-stack">{['cameron', 'tony', 'roger', 'angel'].map(id => <Avatar key={id} person={person(id)} size={24}/>)}<span className="attendee-count">+{event.attendees - 4 + Number(attending)}</span></span><button className="text-button" onClick={() => openModal('event', event.id)}>{attending ? 'Details' : 'Join event'}</button></div></div></article>;
}
export default function Events() {
  const { state } = useStore(); const { openModal } = useUI(); const [category, setCategory] = useState('All events'), [sort, setSort] = useState('upcoming');
  const events = state.events.filter(e => category === 'All events' || (category === 'Going' ? state.attending.includes(e.id) : e.category === category)).sort((a, b) => sort === 'popular' ? b.attendees - a.attendees : new Date(a.date) - new Date(b.date));
  return <><PageHeading title="Upcoming events" subtitle="Good things happen when we get together."><Button onClick={() => openModal('create-event')}><Plus size={16}/>Create event</Button></PageHeading><div className="page-toolbar"><div className="pills">{['All events', 'Workshop', 'Meetup', 'Going'].map(c => <button key={c} className={c === category ? 'active' : ''} onClick={() => setCategory(c)}>{c}</button>)}</div><select aria-label="Sort events" value={sort} onChange={e => setSort(e.target.value)}><option value="upcoming">Soonest first</option><option value="popular">Most popular</option></select></div><div className="event-grid">{events.map(event => <EventCard event={event} key={event.id}/>)}</div>{!events.length && <div className="panel"><Empty icon={CalendarDays} title="Your next gathering is waiting">Browse all events or create one of your own.</Empty></div>}</>;
}
export function EventDialog({ eventId, onClose }) {
  const { state, person, toggle, notify } = useStore(); const event = state.events.find(e => e.id === eventId);
  if (!event) return <Modal title="Event unavailable" onClose={onClose}><Empty title="Event not found">It may have been removed from your local data.</Empty></Modal>;
  const going = state.attending.includes(event.id);
  return <Modal title="Event details" onClose={onClose}><div className="event-detail"><Art className="event-detail-art" name={event.art} alt={event.title}/><div className="form-body"><span className="eyebrow">{event.category}</span><h2>{event.title}</h2><p>{event.description}</p><div className="detail-line"><CalendarDays size={18}/>{dateLabel(event.date)} · {eventTime(event.date)}</div><div className="detail-line"><MapPin size={18}/>{event.location}</div><div className="detail-line"><Users size={18}/>{event.attendees + Number(going)} people going</div><div className="person-line"><Avatar person={person(event.host)} size={32}/><span><small>Hosted by</small><strong>{person(event.host).name}</strong></span></div><Button className="full-width" variant={going ? 'soft' : 'primary'} onClick={() => { toggle('attending', event.id); notify(going ? 'RSVP removed.' : 'You’re on the list! RSVP saved on this device.'); }}>{going ? <><Check size={17}/>Going · cancel RSVP</> : 'I’m going'}</Button></div></div></Modal>;
}
export function CreateEventDialog({ onClose }) {
  const { dispatch, notify } = useStore(); const [error, setError] = useState('');
  function create(e) {
    e.preventDefault(); const f = new FormData(e.currentTarget); const date = new Date(f.get('date'));
    if (!f.get('title').trim() || !f.get('location').trim()) return setError('Add an event name and a location.');
    if (Number.isNaN(date.getTime()) || date <= new Date()) return setError('Choose a date and time in the future.');
    dispatch({ type: 'EVENT_CREATE', payload: { id: uid(), title: f.get('title').trim(), description: f.get('description').trim(), location: f.get('location').trim(), date: date.toISOString(), category: f.get('category'), art: f.get('art'), attendees: 1, host: 'me' } }); notify('Your event has been created locally.'); onClose();
  }
  return <Modal title="Bring people together" onClose={onClose}><form className="form-body" onSubmit={create}><label className="field">Event name<input name="title" required maxLength={100} placeholder="Give your gathering a name" data-autofocus/></label><div className="form-row"><label className="field">Date & time<input name="date" type="datetime-local" required/></label><label className="field">Category<select name="category"><option>Workshop</option><option>Meetup</option><option>Music</option><option>Art & design</option></select></label></div><label className="field">Location<input name="location" required maxLength={160} placeholder="Venue or meeting link"/></label><label className="field">What’s the plan?<textarea name="description" maxLength={1500} rows={3} placeholder="Tell people what to expect…"/></label><label className="field">Cover artwork<select name="art"><option value="planning">Soft coral forms</option><option value="monument">Playful pastels</option><option value="summer">Colorful shapes</option><option value="craft">The maker’s corner</option></select></label><ErrorNotice>{error}</ErrorNotice><p className="local-disclosure">This event is saved locally; no invitations are sent.</p><Button type="submit">Create event</Button></form></Modal>;
}
