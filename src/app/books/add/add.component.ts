import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from "@angular/material/snack-bar";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
	selector: 'app-add',
	templateUrl: './add.component.html',
	styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

	bookForm: FormGroup;
	emailRegx = /^(([^<>+()\[\]\\.,;:\s@"-#$%&=]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/;
	editId: string = null;

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private route: ActivatedRoute,
		private snackBar: MatSnackBar,
		private http: HttpClient
	) { }

	ngOnInit(): void {
		this.editId = this.route.snapshot.paramMap.get('id');
		console.log('Book ID', this.route.snapshot.paramMap.get('id'));
		this.bookForm = this.formBuilder.group({
			BookName: [null, Validators.required],
			BookDescription: [null],
			BookWriter: [null, Validators.required],
			BookPublisher: [null, Validators.required],
			BookPublisherEmail: [null, [Validators.required, Validators.pattern(this.emailRegx)]],
		});
		if (this.editId != null) {
			this.getBook().subscribe(res => {
				// console.log('getBook res', res);
				this.bookForm = this.formBuilder.group({
					BookName: [res.result.data.BookName, Validators.required],
					BookDescription: [res.result.data.BookDescription],
					BookWriter: [res.result.data.BookWriter, Validators.required],
					BookPublisher: [res.result.data.BookPublisher, Validators.required],
					BookPublisherEmail: [res.result.data.BookPublisherEmail, [Validators.required, Validators.pattern(this.emailRegx)]],
				});
			})
		}
	}

	submit() {
		if (!this.bookForm.valid) {
			return;
		}
		if (this.editId != null) {
			this.updateBook(this.bookForm.value).subscribe(res => {
				// console.log('addBook submit', res);
				if (res.status == 1) {
					this.navigateToList();
				}
				else if (res.message) {
					this.bookForm.controls.BookName.setErrors({ exist: true });
					this.showSnackbar(res.message);
				}
			});
		}
		else {
			this.addBook(this.bookForm.value).subscribe(res => {
				// console.log('addBook submit', res);
				if (res.status == 1) {
					this.navigateToList();
				}
				else if (res.message) {
					this.bookForm.controls.BookName.setErrors({ exist: true });
					this.showSnackbar(res.message);
				}
			});
		}
	}

	navigateToList() {
		this.router.navigate(['list'])
	}

	showSnackbar(content) {
		this.snackBar.open(content, 'Close', {
			duration: 3000
		});
	}

	addBook(book): Observable<any> {
		const headers = { 'content-type': 'application/json' };
		return this.http.post(environment.baseUrl + 'books', JSON.stringify(book), { 'headers': headers })
	}

	updateBook(book): Observable<any> {
		book['_id'] = this.editId;
		const headers = { 'content-type': 'application/json' };
		return this.http.put(environment.baseUrl + 'books', JSON.stringify(book), { 'headers': headers })
	}

	getBook(): Observable<any> {
		return this.http.get(environment.baseUrl + 'books/' + this.editId)
	}

}
