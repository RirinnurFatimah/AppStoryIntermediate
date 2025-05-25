import RegisterPage from '../pages/register-page';
import LoginPage from '../pages/login-page';
import HomePage from '../pages/homepage';
import AddPage from '../pages/add-page';
import { checkAuthenticatedRoute, checkUnauthenticatedRouteOnly } from '../utils/auth';
import StoryDetailPage from '../pages/stories-detail-page';
import BookmarkPage from '../pages/bookmark-page';

export const routes = {
  '/login': () => checkUnauthenticatedRouteOnly(new LoginPage()),
  '/register': () => checkUnauthenticatedRouteOnly(new RegisterPage()),

  '/': () => checkAuthenticatedRoute(new HomePage()),
  '/add': () => checkAuthenticatedRoute(new AddPage()),
  '/stories/:id': () => checkAuthenticatedRoute(new StoryDetailPage()),
  '/bookmark': () => checkAuthenticatedRoute(new BookmarkPage()),
};
