import { Component, OnInit, Inject } from '@angular/core';
import { DepartmentsService } from './departments.service';

import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

export interface DialogData {
  id: number;
  departmentCode: string;
  departmentName: string;
}

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css'],
})
export class DepartmentsComponent implements OnInit {
  newDepartmentClicked: boolean = false;
  departments: any;
  depAddForm = new FormGroup({
    departmentCode: new FormControl('', {
      validators: [Validators.required],
    }),
    departmentName: new FormControl('', { validators: [Validators.required] }),
  });
  ELEMENT_DATA: DialogData[] = [];
  displayedColumns: string[] = ['departmentCode', 'departmentName', 'options'];
  dataSource: any;
  submitted: boolean = false;

  constructor(private depService: DepartmentsService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getDepartmentList();
  }

  model: any = {};
  model2: any = {};

  openDialog(departmentInfo: any) {
    console.log(departmentInfo);
    let depObj: any;
    depObj = this.depService.getDepartment(departmentInfo);
    console.log(depObj);
    const dialogRef = this.dialog.open(DepartmentEditComponent, {
      height: '500px',
      width: '800px',
      data: {
        id: departmentInfo,
        departmentCode: depObj.departmentCode,
        departmentName: depObj.departmentName,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.ngOnInit();
    });
  }

  getDepartmentList() {
    this.departments = this.depService.getDepartments();
    console.log(this.departments);
    this.ELEMENT_DATA = this.departments;
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  }

  addDepartment() {
    this.submitted = true;
    var form = {
      departmentCode: this.depAddForm.value.departmentCode,
      departmentName: this.depAddForm.value.departmentName,
    };
    console.log(form);
    this.depService.addDepartment(form);
    this.depAddForm.reset();
    this.ngOnInit();
  }

  deleteDepartment(i: number) {
    this.depService.deleteDepartment(i);
    this.ngOnInit();
  }

  myValue: any;

  addNewDepartmentBtn() {
    this.submitted = false;
  }
}


@Component({
  selector: 'app-departments',
  templateUrl: './department-edit.component.html',
  styleUrls: ['./departments.component.css'],
})
export class DepartmentEditComponent implements OnInit {
  depDetailsForm = new FormGroup({
    departmentCode: new FormControl('', {
      validators: [Validators.required],
    }),
    departmentName: new FormControl('', { validators: [Validators.required] }),
  });
  model2: any = {};
  depId: any;

  constructor(
    public dialogRef: MatDialogRef<DepartmentEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private depService: DepartmentsService
  ) {}

  ngOnInit() {
    this.depId = this.data.id;
    this.depDetailsForm.patchValue({
      departmentCode: this.data.departmentCode,
      departmentName: this.data.departmentName,
    });
  }

  submit() {
    var form = {
      departmentCode: this.depDetailsForm.value.departmentCode,
      departmentName: this.depDetailsForm.value.departmentName,
    };
    this.depService.updateDepartment(this.depId, form);
    this.onNoClick();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
