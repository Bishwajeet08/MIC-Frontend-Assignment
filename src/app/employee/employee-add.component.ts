import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { EmployeesService } from './employees.service';
import { DepartmentsService } from '../departments/departments.service';

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

export interface DialogData {
  id: number;
  name: string;
  department: string;
}

export interface usersData {
  name: string;
  department: string;
}

@Component({
  selector: 'app-employee-add',
  templateUrl: './employee-add.component.html',
  styleUrls: ['./employee-add.component.css'],
})
export class EmployeeAddComponent implements OnInit {
  newEmployeeClicked: boolean = false;
  submitted: boolean = false;
  color: any;
  department: any;
  employees: any;
  departments: any;
  empAddForm = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required],
    }),
    department: new FormControl('', { validators: [Validators.required] }),
  });
  ELEMENT_DATA: DialogData[] = [];
  displayedColumns: string[] = ['name', 'department', 'options'];
  dataSource: any;
  filterValues = {
    department: '',
  };
  departmentFilter = new FormControl('');

  constructor(
    private empService: EmployeesService,
    private depService: DepartmentsService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getEmployeeList();
    let empsData = this.getEmployeeList();
    this.getDepartments();
    this.dataSource.filterPredicate = (data: any, filtersJson: string) => {
      const matchFilter: usersData[] = [];
      const filters = JSON.parse(filtersJson);

      console.log(filters);
      filters.forEach((filter: any) => {
        const val = data[filter.id] === null ? '' : data[filter.id];
        console.log(val);
        matchFilter.push(
          val.toLowerCase().includes(filter.value.toLowerCase())
        );
      });
      return matchFilter.every(Boolean);
    };
  }

  applyFilter(filterValue: any) {
    const tableFilters = [];
    tableFilters.push({
      id: 'department',
      value: filterValue.target.value,
    });
    console.log(tableFilters);

    this.dataSource.filter = JSON.stringify(tableFilters);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  model: any = {};
  model2: any = {};

  search(event: any) {
    console.log(event);
  }

  openDialog(editEmployeeInfo: any) {
    console.log(editEmployeeInfo);
    let empObj: any;
    empObj = this.empService.getEmployee(editEmployeeInfo);
    const dialogRef = this.dialog.open(EmployeeEditComponent, {
      height: '500px',
      width: '800px',
      data: {
        id: editEmployeeInfo,
        name: empObj.name,
        department: empObj.department,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.ngOnInit();
    });
  }

  getEmployeeList() {
    this.employees = this.empService.getEmployees();
    this.ELEMENT_DATA = this.employees;
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  }

  getDepartments() {
    this.departments = this.depService.getDepartments();
  }

  addEmployee() {
    this.submitted = true;
    var form = {
      name: this.empAddForm.value.name,
      department: this.empAddForm.value.department,
    };
    this.empService.createEmployee(form);
    this.empAddForm.reset();
    this.ngOnInit();
  }

  deleteEmployee(i: number) {
    this.empService.deleteEmployee(i);
    this.ngOnInit();
  }

  myValue: any;

  addNewEmployeeBtn() {
    this.submitted = false;
  }
}

@Component({
  selector: 'app-employee-add',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-add.component.css'],
})
export class EmployeeEditComponent implements OnInit {
  empDetailsForm = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required],
    }),
    department: new FormControl('', { validators: [Validators.required] }),
  });
  model2: any = {};
  empId: any;
  departments: any;

  constructor(
    public dialogRef: MatDialogRef<EmployeeEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private empService: EmployeesService,
    private depService: DepartmentsService
  ) {}

  ngOnInit() {
    this.getDepartments();
    this.empId = this.data.id;
    this.empDetailsForm.patchValue({
      name: this.data.name,
      department: this.data.department,
    });
  }

  submit() {
    var form = {
      name: this.empDetailsForm.value.name,
      department: this.empDetailsForm.value.department,
    };
    this.empService.updateEmployee(this.empId, form);
    this.onNoClick();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getDepartments() {
    this.departments = this.depService.getDepartments();
  }
}
