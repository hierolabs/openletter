import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { HomePage } from '../pages/Home';
import { StaysPage } from '../pages/Stays';
import { StayDetailPage } from '../pages/StayDetail';
import { BrandStoryPage } from '../pages/BrandStory';
import { MyPage } from '../pages/MyPage';
import { NeighborhoodPage } from '../pages/Neighborhood';
import { HostDashboard } from '../pages/Host/Dashboard';
import { SelectMethod } from '../pages/Host/Register/SelectMethod';
import { RegisterLayout } from '../pages/Host/Register/RegisterLayout';
import { TypeStep } from '../pages/Host/Register/steps/TypeStep';
import { ConceptStep } from '../pages/Host/Register/steps/ConceptStep';
import { BasicsStep } from '../pages/Host/Register/steps/BasicsStep';
import { DescriptionStep } from '../pages/Host/Register/steps/DescriptionStep';
import { LocationStep } from '../pages/Host/Register/steps/LocationStep';
import { PhotosStep } from '../pages/Host/Register/steps/PhotosStep';
import { PriceStep } from '../pages/Host/Register/steps/PriceStep';
import { SuccessStep } from '../pages/Host/Register/steps/SuccessStep';

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/stays', element: <StaysPage /> },
      { path: '/stays/:id', element: <StayDetailPage /> },
      { path: '/brand-story', element: <BrandStoryPage /> },
      { path: '/mypage', element: <MyPage /> },
      { path: '/neighborhood', element: <NeighborhoodPage /> },
    ],
  },
  {
    path: '/host',
    element: <HostDashboard />,
  },
  {
    path: '/host/register/select',
    element: <SelectMethod />,
  },
  {
    path: '/host/register',
    element: <RegisterLayout />,
    children: [
      { path: 'type', element: <TypeStep /> },
      { path: 'concept', element: <ConceptStep /> },
      { path: 'basics', element: <BasicsStep /> },
      { path: 'description', element: <DescriptionStep /> },
      { path: 'location', element: <LocationStep /> },
      { path: 'photos', element: <PhotosStep /> },
      { path: 'price', element: <PriceStep /> },
      { path: 'success', element: <SuccessStep /> },
    ],
  },
]);
