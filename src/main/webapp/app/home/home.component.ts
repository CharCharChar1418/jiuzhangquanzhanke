import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { LoginModalService, Principal, Account } from 'app/core';
import { CourseService } from 'app/shared/service/CourseService';
import { CourseDto } from 'app/shared/model/course-dto.model';
import { CourseWithTNDto } from 'app/shared/model/courseWithTN-dto.model';

@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html',
    styleUrls: ['home.css']
})
export class HomeComponent implements OnInit {
    account: Account;
    modalRef: NgbModalRef;
    classeNameNeedToReg: string;
    courses: CourseDto[] = [];
    coursesWithTN: CourseWithTNDto[] = [];
    coursesRegistered: CourseDto[] = [];
    classNameAdded: string;
    classLocation: string;
    classTeacherID: number;
    classContent: string;

    constructor(
        private principal: Principal,
        private loginModalService: LoginModalService,
        private eventManager: JhiEventManager,
        private courseService: CourseService
    ) {}

    ngOnInit() {
        this.principal.identity().then(account => {
            this.account = account;
        });
        this.registerAuthenticationSuccess();
    }

    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', message => {
            this.principal.identity().then(account => {
                this.account = account;
            });
        });
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }

    isAdmin() {
        for (const a of this.account.authorities) {
            if (a === 'ROLE_ADMIN') {
                return true;
            }
        }
        return false;
        // return this.principal.isTeacher();
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }

    getAllCourses() {
        this.courseService.getCourseInfo().subscribe(curDto => {
            if (!curDto) {
                this.courses = [];
            } else {
                this.courses = curDto;
            }
        });
    }

    getAllCoursesWithTN() {
        this.courseService.getCourseInfoWithTN().subscribe(curDto => {
            if (!curDto) {
                this.coursesWithTN = [];
            } else {
                this.coursesWithTN = curDto;
            }
        });
    }

    // registerCourse(courseName) {
    //
    // }

    clearAllCourses() {
        this.courses = [];
    }

    getAllCourseRegistered() {
        this.courseService.getCourseRegistered().subscribe(curDto => {
            if (!curDto) {
                this.coursesRegistered = [];
            } else {
                this.coursesRegistered = curDto;
            }
        });
    }

    registerCourse(courseName: String) {
        this.courseService.registerCourse(courseName).subscribe(response => {
            if (response.ok === false) {
                return;
            }
            this.getAllCourseRegistered();
        });
    }

    dropCourse(courseName: String) {
        this.courseService.dropCourse(courseName).subscribe(response => {
            if (response.ok === false) {
                return;
            }
            this.getAllCourseRegistered();
        });
    }

    addCourse() {
        const courseAdd: CourseDto = {
            courseName: this.classNameAdded,
            courseLocation: this.classLocation,
            courseContent: this.classContent,
            teacherId: this.classTeacherID
        };
        this.courseService.addCourse(courseAdd).subscribe(response => {
            if (response.ok === false) {
                return;
            }
            this.getAllCourses();
            this.classNameAdded = null;
            this.classLocation = null;
            this.classContent = null;
            this.classTeacherID = null;
        });
    }

    deleteCourse(courseName: string) {
        this.courseService.deleteCourse(courseName).subscribe(response => {
            if (response.ok === false) {
                return;
            }
            this.getAllCourses();
        });
    }
}
