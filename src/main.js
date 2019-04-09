import { Router } from '@vaadin/router';

import './views/start-page';
import './views/act1';
import './views/act2';

const router = new Router(document.getElementById('root'));

router.setRoutes([{
  path: '/',
  children: [
    { path: '', component: 'start-page' },
    { path: '/act-1', component: 'act-1' },
    { path: '/act-2', component: 'act-2' },
    { path: '(.*)', redirect: '/not-found' },
  ],
}]);
