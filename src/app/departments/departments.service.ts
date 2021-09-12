import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DepartmentsService {
  departments = [
    { departmentCode: 'TECH', departmentName: 'Technology' },
    { departmentCode: 'HR', departmentName: 'HR' },
    { departmentCode: 'FIN', departmentName: 'Finance' },
  ];

  constructor() {}

  getDepartments() {
    return this.departments;
  }

  getDepartment(i: number) {
    let departmentObj = {
      departmentCode: this.departments[i].departmentCode,
      departmentName: this.departments[i].departmentName,
    };
    return departmentObj;
  }

  addDepartment(depInfo: any) {
    this.departments.push(depInfo);
  }

  updateDepartment(empId: number, depData: any) {
    for (let i = 0; i < this.departments.length; i++) {
      if (i == empId) {
        this.departments[i] = depData;
      }
    }
  }

  deleteDepartment(i: number) {
    this.departments.splice(i,1);
  }
}
