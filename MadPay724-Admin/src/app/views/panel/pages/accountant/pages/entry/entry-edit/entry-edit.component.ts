import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Entry } from 'src/app/data/models/accountant/entry';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EntryService } from 'src/app/core/_services/panel/accountant/entry.service';

@Component({
  selector: 'app-entry-edit',
  templateUrl: './entry-edit.component.html',
  styleUrls: ['./entry-edit.component.css']
})
export class EntryEditComponent implements OnInit, OnDestroy {
  subManager = new Subscription();
  entry: Entry;
  entryEditForm: FormGroup = this.formBuilder.group({
    textForUser: ['', [Validators.required]],
    bankTrackingCode: ['', [Validators.required]],
  })
  constructor(private route: ActivatedRoute, private title: Title,
    private formBuilder: FormBuilder, private alertService: ToastrService,
    private entrySerrvice: EntryService, private router: Router) { }

  ngOnInit() {
    this.loadEntry();
    this.title.setTitle('ویرایش،جزییات واریزی ' + this.entry.ownerName);
    this.populateForm();
  }
  loadEntry() {
    this.subManager.add(
      this.route.data.subscribe(data => {
        this.entry = data.entry;
      })
    );
  }
  populateForm() {
    this.entryEditForm.setValue({
      textForUser: this.entry.textForUser,
      bankTrackingCode: this.entry.bankTrackingCode
    });
  }
  ngOnDestroy() {
    this.subManager.unsubscribe();
  }
  onClear() {
    if (!this.entry.isApprove) {
      this.router.navigate(['/panel/accountant/entryapprove']);
    } else if (this.entry.isApprove && !this.entry.isPardakht && !this.entry.isReject) {
      this.router.navigate(['/panel/accountant/entrypardakht']);
    } else if (this.entry.isApprove && (this.entry.isPardakht || this.entry.isReject)) {
      this.router.navigate(['/panel/accountant/entryarchive']);
    } else {
      this.router.navigate(['/panel/accountant/entryarchive']);
    }    
  }
  onSubmitEditEntry() {
    if (this.entryEditForm.valid) {
      const entryForUpdate = new FormData();
      entryForUpdate.append('textForUser', this.entryEditForm.get('textForUser').value);
      entryForUpdate.append('bankTrackingCode', this.entryEditForm.get('bankTrackingCode').value);

      this.subManager.add(
        this.entrySerrvice.updateEntry(this.entry.id, entryForUpdate).subscribe(data => {
          this.alertService.success('واریزی ویرایش شد', 'موفق');
          this.onClear();
        }, error => {
          this.alertService.error(error, 'ناموفق');
        })
      );
    } else {
      this.alertService.warning('اطلاعات را به درستی وارد کنید !', 'هشدار')
    }
    this.subManager.unsubscribe();
  }
}