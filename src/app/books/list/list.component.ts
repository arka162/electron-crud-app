import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
	selector: 'app-list',
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

	displayedColumns: string[] = ['BookName', 'BookDescription', 'BookWriter', 'BookPublisher', 'BookPublisherEmail', 'action'];
	dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

	constructor(
		private _router: Router
	) { }

	ngOnInit(): void {
		this.dataSource.paginator = this.paginator;
	}

	getRecord(_myId) {
		this._router.navigate(['add', _myId]);
	}

	navigateToAdd() {
		this._router.navigate(['add']);
	}

}

export interface PeriodicElement {
	_myId: string;
	BookName: string;
	BookDescription: string;
	BookWriter: string;
	BookPublisher: string;
	BookPublisherEmail: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
	{ _myId: '1', BookName: 'Feluda', BookDescription: 'Detective', BookWriter: 'Satyajit Ray', BookPublisher: 'Ananda Publishers', BookPublisherEmail: 'conract@anandapublishers.in' }
];