import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CourseDto } from 'app/shared/model/course-dto.model';
import { SERVER_API_URL } from 'app/app.constants';
import { CourseWithTNDto } from 'app/shared/model/courseWithTN-dto.model';

@Injectable()
export class CourseService {
    private courseAddressUrl = SERVER_API_URL + '/api/course/findAllCoursesDto';
    private courseAddressWithTNUrl = SERVER_API_URL + '/api/course/findAllCoursesWithTNDto';
    private courseDeleteUrl = SERVER_API_URL + '/api/course/deleteCourse';
    private courseUpdateUrl = SERVER_API_URL + '/api/course/updateCourse';
    private courseRegisterUrl = SERVER_API_URL + '/api/course/registerCourse';
    private courseRegisteredUrl = SERVER_API_URL + '/api/course/allRegisteredCourses';
    private courseDropUrl = SERVER_API_URL + '/api/course/dropCourse';
    private courseAddUrl = SERVER_API_URL + '/api/course/addCourse';

    constructor(private http: HttpClient) {}

    getCourseInfo(): Observable<CourseDto[]> {
        return this.http.get<CourseDto[]>(`${this.courseAddressUrl}`);
    }

    getCourseInfoWithTN(): Observable<CourseWithTNDto[]> {
        return this.http.get<CourseWithTNDto[]>(`${this.courseAddressWithTNUrl}`);
    }

    getCourseRegistered(): Observable<CourseDto[]> {
        return this.http.get<CourseDto[]>(`${this.courseRegisteredUrl}`);
    }

    deleteCourse(courseName: String): Observable<Response> {
        return this.http.delete<Response>(`${this.courseDeleteUrl}/${courseName}`);
    }

    update(course: CourseDto): Observable<Response> {
        return this.http.put<Response>(this.courseUpdateUrl, course);
    }

    registerCourse(courseName: String): Observable<Response> {
        return this.http.post<Response>(`${this.courseRegisterUrl}/${courseName}`, courseName);
    }

    dropCourse(courseName: String): Observable<Response> {
        return this.http.delete<Response>(`${this.courseDropUrl}/${courseName}`);
    }

    addCourse(course: CourseDto): Observable<Response> {
        return this.http.post<Response>(`${this.courseAddUrl}`, course);
    }
}
