import { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { Empty, PageHeading } from '../components/UI';
import { PostCard } from '../components/Post';
import { PersonCard } from './Community';
import { ProductCard } from './Marketplace';
import { EventCard } from './Events';
import { useStore } from '../state/Store';
import { people, products } from '../state/data';

export default function Search({ query = '' }) {
  const { state } = useStore(); const [tab, setTab] = useState('All'); const q = query.toLowerCase();
  const matches = {
    People: people.filter(p => `${p.name} ${p.role}`.toLowerCase().includes(q)),
    Posts: state.posts.filter(p => p.text.toLowerCase().includes(q)),
    Events: state.events.filter(e => `${e.title} ${e.description} ${e.location}`.toLowerCase().includes(q)),
    Products: products.filter(p => `${p.title} ${p.category}`.toLowerCase().includes(q)),
  };
  const shown = Object.entries(matches).filter(([key]) => tab === 'All' || tab === key), count = shown.reduce((sum, [, list]) => sum + list.length, 0);
  return <><PageHeading title={`Results for “${query}”`} subtitle={`${count} ${count === 1 ? 'match' : 'matches'} in your community`}/><div className="pills space-bottom">{['All', 'People', 'Posts', 'Events', 'Products'].map(t => <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>{t}</button>)}</div>{shown.map(([key, list]) => list.length > 0 && <section className="search-section" key={key}><h2 className="section-title">{key}</h2><div className={key === 'People' ? 'friends-grid search-grid' : key === 'Products' ? 'product-grid' : key === 'Events' ? 'event-grid' : ''}>{list.map(item => key === 'People' ? <PersonCard p={item} key={item.id}/> : key === 'Products' ? <ProductCard product={item} key={item.id}/> : key === 'Events' ? <EventCard event={item} key={item.id}/> : <PostCard post={item} key={item.id}/>)}</div></section>)}{!count && <div className="panel"><Empty icon={SearchIcon} title="Nothing found, yet">Try a name, “design”, “planning”, or “headphones”.</Empty></div>}</>;
}
