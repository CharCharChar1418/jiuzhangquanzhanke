package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Course;
import com.mycompany.myapp.domain.User;
import com.mycompany.myapp.domain.UserCourse;
import com.mycompany.myapp.domain.dto.CourseDto;
import com.mycompany.myapp.domain.dto.CourseWithTNDto;
import com.mycompany.myapp.repository.CourseRepository;
import com.mycompany.myapp.repository.UserCourseRepository;
import org.bouncycastle.jcajce.provider.asymmetric.ec.KeyFactorySpi;
import org.checkerframework.checker.units.qual.A;
import org.checkerframework.checker.units.qual.C;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CourseService {
    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserCourseRepository userCourseRepository;

    @Autowired
    private UserService userService;

    List<CourseDto> courseDtos = new ArrayList<>();

    public List<CourseDto> findAllCourses() {

        //Cache
        if (courseDtos.isEmpty()) {
            List<Course> courses = courseRepository.findAll();
            for (Course c : courses) {
                courseDtos.add(new CourseDto(c.getCourseName(), c.getCourseLocation(), c.getCourseContent(), c.getTeacherId()));
            }

            return courseDtos;
        }

        return courseDtos;
    }

    public List<CourseDto> findAllCoursesDtoFromDB(){
        return courseRepository.findAllCoursesDto();
    }

    public List<CourseWithTNDto> findAllCoursesDtoWithTeacherNameFromDB(){
        return courseRepository.findAllCoursesDtoWithTeacherName();
    }

    public List<CourseDto> findAllCoursesRegistered() {
        Optional<User> user = userService.getUserWithAuthorities();
        List<UserCourse> courses = userCourseRepository.findAllByUser(user.get());
        List<CourseDto> courseDtos = new ArrayList<>();

        for (UserCourse uc: courses) {
            Course course = uc.getCourse();
            courseDtos.add(CourseDto.builder()
                            .courseName(course.getCourseName())
                            .courseContent(course.getCourseContent())
                            .courseLocation(course.getCourseLocation())
                            .teacherId(course.getTeacherId())
                            .build());
        }

        return courseDtos;
    }


    public void registerCourse(String courseName) throws Exception{
        Optional<User> curUser = userService.getUserWithAuthorities();
        Optional<Course> curCourse = courseRepository.findCourseByCourseName(courseName);

        if (curUser.isPresent() && curCourse.isPresent()){
            List<UserCourse> userCourses = userCourseRepository.findAllByUserAndCourse(curUser.get(), curCourse.get());
            if (userCourses.isEmpty()) {
                userCourseRepository.save(UserCourse.builder()
                    .user(curUser.get())
                    .course(curCourse.get())
                    .build());
            } else {
                throw new Exception("Course registered");
            }

        } else {
            throw new Exception("UnExpected Exception");
        }
    }

    public void addCourse(CourseDto course) throws Exception{
        Optional<Course> courseDto = courseRepository.findCourseByCourseName(course.getCourseName());

        if (courseDto.isPresent()){
            throw new Exception("Course is existing.");
        }

        Course courseBeingSaved = Course.builder()
            .courseName(course.getCourseName())
            .courseContent(course.getCourseContent())
            .courseLocation(course.getCourseLocation())
            .teacherId(course.getTeacherId())
            .build();

        try {
            courseRepository.saveAndFlush(courseBeingSaved);
        } catch (Exception e){
            throw new Exception(e.getMessage());
        }

    }

    public void deleteCourse(String courseName) throws Exception{
        Optional<Course> OptionalExistingCourse = courseRepository.findCourseByCourseName(courseName);
        Optional<User> curUser = userService.getUserWithAuthorities();

        if(!OptionalExistingCourse.isPresent()){
            throw new Exception("Course does not exist.");
        }

        if (curUser.isPresent() && curUser.get().getId() != OptionalExistingCourse.get().getTeacherId()) {
            throw new Exception("Have no authority to delete");
        }

        try {
            courseRepository.delete(OptionalExistingCourse.get());
        } catch (Exception e){
            throw new Exception(e.getMessage());
        }
    }


    public void updateCourse(CourseDto course) throws Exception{
        Optional<Course> OptionalExistingCourse = courseRepository.findCourseByCourseName(course.getCourseName());

        if(!OptionalExistingCourse.isPresent()){
            throw new Exception("Course is not exist.");
        }

        Course existingCourse = OptionalExistingCourse.get();
        existingCourse.setCourseContent(course.getCourseContent());
        existingCourse.setCourseLocation(course.getCourseLocation());
        existingCourse.setCourseName(course.getCourseName());
        existingCourse.setTeacherId(course.getTeacherId());

    }

    public void dropCourse(String courseName) throws Exception {
        Optional<User> user = userService.getUserWithAuthorities();
        Optional<Course> course = courseRepository.findCourseByCourseName(courseName);

        Optional<UserCourse> userCourse = userCourseRepository.findUserCourseByUserAndCourse(user.get(), course.get());
        try {
            userCourseRepository.delete(userCourse.get());
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }

    }
}
