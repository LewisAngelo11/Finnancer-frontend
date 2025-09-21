import { Routes } from '@angular/router';
import { AuthPage } from './auth-page/auth-page';
import { RestorePassw } from './restore-passw/restore-passw';
import { Dashboard } from './dashboard/dashboard';

export const routes: Routes = [
    {
        path: '',
        component: AuthPage,
    },
    {
        path: 'restorePassw',
        component: RestorePassw,
    },
    {
        path: 'dashboard',
        component: Dashboard,
    }
];
