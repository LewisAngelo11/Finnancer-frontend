import { Routes } from '@angular/router';
import { AuthPage } from './auth-page/auth-page';
import { RestorePassw } from './auth-page/restore-passw/restore-passw';
import { Dashboard } from './dashboard/dashboard';
import { Account } from './account/account';
import { Categories } from './categories/categories';
import { VerifyMail } from './verify-mail/verify-mail';
import { Onboarding } from './onboarding/onboarding';
import { ProfilesSelector } from './profiles-selector/profiles-selector';
import { Transactions } from './transactions/transactions';
import { Persons } from './persons/persons';
import { Balance } from './balance/balance';
import { VerifyMailPassw } from './verify-mail-passw/verify-mail-passw';

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
    },
    {
        path: 'profilesSelector',
        component: ProfilesSelector,
    },
    {
        path: 'persons',
        component: Persons,
    },
    {
        path: 'transactions',
        component: Transactions,
    },
    {
        path: 'balance',
        component: Balance,
    },
    {
        path: 'verifyMailPassw',
        component: VerifyMailPassw,
    }
];
