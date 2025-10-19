import { Routes } from '@angular/router';
import { AuthPage } from './auth-page/auth-page';
import { RestorePassw } from './auth-page/restore-passw/restore-passw';
import { Dashboard } from './dashboard/dashboard';
import { Account } from './account/account';
import { Categories } from './categories/categories';
import { VerifyMail } from './verify-mail/verify-mail';
import { Onboarding } from './onboarding/onboarding';

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
    },
    {
        path: 'account',
        component: Account,
    },
    {
        path: 'categories',
        component: Categories,
    },
    {
        path: 'verifyMail',
        component: VerifyMail,
    },
    {
        path: 'onboarding',
        component: Onboarding,
    }
];
