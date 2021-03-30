import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
	selector: 'app-add',
	templateUrl: './add.component.html',
	styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

	bookForm: FormGroup;
	emailRegx = /^(([^<>+()\[\]\\.,;:\s@"-#$%&=]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/;

	constructor(
		private formBuilder: FormBuilder,
		private _router: Router
	) { }

	ngOnInit(): void {
		this.bookForm = this.formBuilder.group({
			BookName: [null, Validators.required],
			BookDescription: [null],
			BookWriter: [null, Validators.required],
			BookPublisher: [null, Validators.required],
			BookPublisherEmail: [null, [Validators.required, Validators.pattern(this.emailRegx)]],
		});
	}

	submit() {
		if (!this.bookForm.valid) {
			return;
		}
		console.log(this.bookForm.value);
	}

	navigateToList() {
		this._router.navigate(['list'])
	}

}
