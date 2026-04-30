import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { CategoryBar } from './CategoryBar';
import { Footer } from './Footer';
import { SearchModal } from '../search/SearchModal';
import { ScrollTopButton } from '../common/ScrollTopButton';

export function MainLayout() {
  return (
    <>
      <Navbar />
      <CategoryBar />
      <div style={{ paddingTop: '112px' }}>
        <Outlet />
      </div>
      <Footer />
      <ScrollTopButton />
      <SearchModal />
    </>
  );
}
