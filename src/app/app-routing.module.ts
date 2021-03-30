import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddComponent } from './books/add/add.component';
import { ListComponent } from './books/list/list.component';

const routes: Routes = [
	{
		path: 'add',
		component: AddComponent,
		data: {
			moduleName: 'add'
		}
	},
	{
		path: 'list',
		component: ListComponent,
		data: {
			moduleName: 'list'
		}
	},
	{
		path: '',
		component: ListComponent,
		data: {
			moduleName: 'list'
		}
	},
	{ path: '**', redirectTo: 'list' }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
