import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EmployeesService {
  employees = [
    { name: 'Kevin', department: 'Technology' },
    { name: 'Michael', department: 'HR' },
    { name: 'Neil', department: 'Finance' },
  ];

  constructor() {}

  getEmployees() {
    return this.employees;
  }

  getEmployee(i: number) {
    let employeeObj = {
      name: this.employees[i].name,
      department: this.employees[i].department,
    };
    return employeeObj;
  }

  createEmployee(employeeInfo: any) {
    this.employees.push(employeeInfo);
  }

  updateEmployee(empId: number, empData: any) {
    console.log(empId);
    console.log(empData);
    for (let i = 0; i < this.employees.length; i++) {
      if (i == empId) {
        this.employees[i] = empData;
      }
    }
    console.log(this.employees);
  }

  deleteEmployee(i: number) {
    this.employees.splice(i, 1);
  }
}
