// Local storage utilities for the attendance system

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'parent';
  phone?: string;
}

export interface Teacher extends User {
  role: 'teacher';
  teacherId: string;
}

export interface Student {
  id: string;
  name: string;
  class: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  teacherId?: string;
}

export interface Class {
  id: string;
  name: string;
  subjects: string[];
  teacherId?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  time: string;
  status: 'Present' | 'Absent';
  teacherId: string;
}

export interface Grade {
  id: string;
  studentId: string;
  subject: string;
  marks: number;
  maxMarks: number;
  date: string;
  teacherId: string;
}

// Storage keys
const STORAGE_KEYS = {
  CURRENT_USER: 'attendance_current_user',
  USERS: 'attendance_users',
  TEACHERS: 'attendance_teachers',
  STUDENTS: 'attendance_students',
  CLASSES: 'attendance_classes',
  ATTENDANCE: 'attendance_records',
  GRADES: 'attendance_grades',
} as const;

// Generic storage functions
export const storage = {
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },

  remove: (key: string): void => {
    localStorage.removeItem(key);
  },

  clear: (): void => {
    localStorage.clear();
  },
};

// User management
export const userStorage = {
  getCurrentUser: (): User | null => {
    return storage.get<User>(STORAGE_KEYS.CURRENT_USER);
  },

  setCurrentUser: (user: User): void => {
    storage.set(STORAGE_KEYS.CURRENT_USER, user);
  },

  logout: (): void => {
    storage.remove(STORAGE_KEYS.CURRENT_USER);
  },

  getAllUsers: (): User[] => {
    return storage.get<User[]>(STORAGE_KEYS.USERS) || [];
  },

  addUser: (user: User): void => {
    const users = userStorage.getAllUsers();
    users.push(user);
    storage.set(STORAGE_KEYS.USERS, users);
  },

  findUser: (email: string, role: string): User | null => {
    const users = userStorage.getAllUsers();
    return users.find(user => user.email === email && user.role === role) || null;
  },

  // Initialize with default admin
  initializeDefaultUsers: (): void => {
    const users = userStorage.getAllUsers();
    if (users.length === 0) {
      const defaultUsers: User[] = [
        {
          id: 'admin-1',
          name: 'System Admin',
          email: 'admin@school.com',
          role: 'admin',
          phone: '1234567890',
        },
        {
          id: 'teacher-1',
          name: 'John Smith',
          email: 'teacher@school.com',
          role: 'teacher',
          phone: '1234567891',
        },
        {
          id: 'parent-1',
          name: 'Sarah Johnson',
          email: 'parent@school.com',
          role: 'parent',
          phone: '1234567892',
        },
      ];
      
      defaultUsers.forEach(user => userStorage.addUser(user));
    }
  },
};

// Teacher management
export const teacherStorage = {
  getAllTeachers: (): Teacher[] => {
    return storage.get<Teacher[]>(STORAGE_KEYS.TEACHERS) || [];
  },

  addTeacher: (teacher: Teacher): void => {
    const teachers = teacherStorage.getAllTeachers();
    teachers.push(teacher);
    storage.set(STORAGE_KEYS.TEACHERS, teachers);
    // Only add to users if not already there
    const existingUser = userStorage.findUser(teacher.email, teacher.role);
    if (!existingUser) {
      userStorage.addUser(teacher);
    }
  },

  getTeacherById: (id: string): Teacher | null => {
    const teachers = teacherStorage.getAllTeachers();
    return teachers.find(teacher => teacher.id === id) || null;
  },
};

// Student management
export const studentStorage = {
  getAllStudents: (): Student[] => {
    return storage.get<Student[]>(STORAGE_KEYS.STUDENTS) || [];
  },

  addStudent: (student: Student): void => {
    const students = studentStorage.getAllStudents();
    students.push(student);
    storage.set(STORAGE_KEYS.STUDENTS, students);
  },

  getStudentById: (id: string): Student | null => {
    const students = studentStorage.getAllStudents();
    return students.find(student => student.id === id) || null;
  },

  getStudentsByClass: (className: string): Student[] => {
    const students = studentStorage.getAllStudents();
    return students.filter(student => student.class === className);
  },
};

// Class management
export const classStorage = {
  getAllClasses: (): Class[] => {
    return storage.get<Class[]>(STORAGE_KEYS.CLASSES) || [];
  },

  addClass: (classData: Class): void => {
    const classes = classStorage.getAllClasses();
    classes.push(classData);
    storage.set(STORAGE_KEYS.CLASSES, classes);
  },

  getClassById: (id: string): Class | null => {
    const classes = classStorage.getAllClasses();
    return classes.find(cls => cls.id === id) || null;
  },
};

// Attendance management
export const attendanceStorage = {
  getAllAttendance: (): AttendanceRecord[] => {
    return storage.get<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE) || [];
  },

  addAttendanceRecord: (record: AttendanceRecord): void => {
    const records = attendanceStorage.getAllAttendance();
    records.push(record);
    storage.set(STORAGE_KEYS.ATTENDANCE, records);
  },

  getAttendanceByStudent: (studentId: string): AttendanceRecord[] => {
    const records = attendanceStorage.getAllAttendance();
    return records.filter(record => record.studentId === studentId);
  },

  getAttendanceByTeacher: (teacherId: string): AttendanceRecord[] => {
    const records = attendanceStorage.getAllAttendance();
    return records.filter(record => record.teacherId === teacherId);
  },
};

// Grade management
export const gradeStorage = {
  getAllGrades: (): Grade[] => {
    return storage.get<Grade[]>(STORAGE_KEYS.GRADES) || [];
  },

  addGrade: (grade: Grade): void => {
    const grades = gradeStorage.getAllGrades();
    grades.push(grade);
    storage.set(STORAGE_KEYS.GRADES, grades);
  },

  getGradesByStudent: (studentId: string): Grade[] => {
    const grades = gradeStorage.getAllGrades();
    return grades.filter(grade => grade.studentId === studentId);
  },
};

// Initialize storage with default data
export const initializeStorage = (): void => {
  userStorage.initializeDefaultUsers();
  
  // Initialize default teacher data if none exist
  const teachers = teacherStorage.getAllTeachers();
  if (teachers.length === 0) {
    const defaultTeacher: Teacher = {
      id: 'teacher-1',
      teacherId: 'T001',
      name: 'John Smith',
      email: 'teacher@school.com',
      role: 'teacher',
      phone: '1234567891',
    };
    
    // Add directly to storage without recursive calls
    const existingTeachers = storage.get<Teacher[]>(STORAGE_KEYS.TEACHERS) || [];
    existingTeachers.push(defaultTeacher);
    storage.set(STORAGE_KEYS.TEACHERS, existingTeachers);
  }
  
  // Initialize default classes if none exist
  const classes = classStorage.getAllClasses();
  if (classes.length === 0) {
    const defaultClasses: Class[] = [
      {
        id: 'class-1',
        name: 'Grade 10-A',
        subjects: ['Mathematics', 'Science', 'English', 'History', 'Geography'],
      },
      {
        id: 'class-2',
        name: 'Grade 10-B',
        subjects: ['Mathematics', 'Science', 'English', 'History', 'Geography'],
      },
      {
        id: 'class-3',
        name: 'Grade 11-A',
        subjects: ['Advanced Mathematics', 'Physics', 'Chemistry', 'English Literature', 'Economics'],
      },
    ];
    
    defaultClasses.forEach(cls => classStorage.addClass(cls));
  }
};