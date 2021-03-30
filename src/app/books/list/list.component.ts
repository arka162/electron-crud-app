import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'
import { from, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';

@Component({
	selector: 'app-list',
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, AfterViewInit {

	displayedColumns: string[] = ['BookName', 'BookDescription', 'BookWriter', 'BookPublisher', 'BookPublisherEmail', 'action'];
	dataSource = new MatTableDataSource<PeriodicElement>();
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild('confirmDialog') confirmDialog: TemplateRef<any>;

	constructor(
		private router: Router,
		private http: HttpClient,
		private dialog: MatDialog
	) { }

	ngOnInit(): void {
		this.dataSource.paginator = this.paginator;
	}

	ngAfterViewInit() {
		this.listBook();
	}

	listBook() {
		this.getBook().subscribe(res => {
			// console.log('getBook get', res);
			if (res.result.data) {
				this.dataSource = res.result.data;
				this.dataSource.paginator = this.paginator;
			}
		});
	}

	navigateToEdit(_id) {
		this.router.navigate(['add', _id]);
	}

	navigateToAdd() {
		this.router.navigate(['add']);
	}

	getBook(): Observable<any> {
		return this.http.get(environment.baseUrl + 'books/0')
	}

	deleteBook(_id) {
		let dialogRef = this.dialog.open(this.confirmDialog, {
			width: '250px'
		});
		dialogRef.afterClosed().subscribe(confirm => {
			if (confirm) {
				this.http.delete(environment.baseUrl + 'books/' + _id).subscribe(res => {
					console.log('deleteBook delete', res);
					this.listBook();
				})
			}
		});
	}

}

export interface PeriodicElement {
	_id: string;
	BookName: string;
	BookDescription: string;
	BookWriter: string;
	BookPublisher: string;
	BookPublisherEmail: string;
}
let ELEMENT_DATA: PeriodicElement[] = [];