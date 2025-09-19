import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { attendanceStorage, gradeStorage, studentStorage, AttendanceRecord, Grade, Student } from '@/lib/storage';
import { GraduationCap, LogOut, Calendar, TrendingUp, CheckCircle, XCircle, BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ParentDashboard = () => {
  const { user, logout } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);

  useEffect(() => {
    // In a real app, we'd find the student by parent email
    // For demo, we'll use the first student or create a demo student
    const allStudents = studentStorage.getAllStudents();
    let demoStudent = allStudents.find(s => s.parentEmail === user?.email);
    
    if (!demoStudent && allStudents.length === 0) {
      // Create a demo student for the parent
      demoStudent = {
        id: 'demo-student-1',
        name: 'Alex Johnson',
        class: 'Grade 10-A',
        parentName: user?.name || 'Parent',
        parentEmail: user?.email || 'parent@school.com',
        parentPhone: '1234567890',
      };
      studentStorage.addStudent(demoStudent);
    } else if (!demoStudent) {
      demoStudent = allStudents[0]; // Use first student for demo
    }
    
    setStudent(demoStudent);
    
    if (demoStudent) {
      const studentAttendance = attendanceStorage.getAttendanceByStudent(demoStudent.id);
      const studentGrades = gradeStorage.getGradesByStudent(demoStudent.id);
      
      setAttendanceRecords(studentAttendance);
      setGrades(studentGrades);
      
      // Create some demo data if none exists
      if (studentAttendance.length === 0) {
        const demoAttendance: AttendanceRecord[] = [];
        const today = new Date();
        
        for (let i = 0; i < 7; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          
          demoAttendance.push({
            id: `demo-attendance-${i}`,
            studentId: demoStudent.id,
            studentName: demoStudent.name,
            date: date.toLocaleDateString(),
            time: '09:00 AM',
            status: Math.random() > 0.2 ? 'Present' : 'Absent',
            teacherId: 'demo-teacher',
          });
        }
        
        demoAttendance.forEach(record => attendanceStorage.addAttendanceRecord(record));
        setAttendanceRecords(demoAttendance);
      }
      
      if (studentGrades.length === 0) {
        const demoGrades: Grade[] = [
          {
            id: 'demo-grade-1',
            studentId: demoStudent.id,
            subject: 'Mathematics',
            marks: 85,
            maxMarks: 100,
            date: new Date().toLocaleDateString(),
            teacherId: 'demo-teacher',
          },
          {
            id: 'demo-grade-2',
            studentId: demoStudent.id,
            subject: 'Science',
            marks: 92,
            maxMarks: 100,
            date: new Date().toLocaleDateString(),
            teacherId: 'demo-teacher',
          },
          {
            id: 'demo-grade-3',
            studentId: demoStudent.id,
            subject: 'English',
            marks: 78,
            maxMarks: 100,
            date: new Date().toLocaleDateString(),
            teacherId: 'demo-teacher',
          },
          {
            id: 'demo-grade-4',
            studentId: demoStudent.id,
            subject: 'History',
            marks: 88,
            maxMarks: 100,
            date: new Date().toLocaleDateString(),
            teacherId: 'demo-teacher',
          },
        ];
        
        demoGrades.forEach(grade => gradeStorage.addGrade(grade));
        setGrades(demoGrades);
      }
    }
  }, [user]);

  const getAttendancePercentage = () => {
    if (attendanceRecords.length === 0) return 0;
    const presentCount = attendanceRecords.filter(record => record.status === 'Present').length;
    return Math.round((presentCount / attendanceRecords.length) * 100);
  };

  const getAverageGrade = () => {
    if (grades.length === 0) return 0;
    const total = grades.reduce((sum, grade) => sum + (grade.marks / grade.maxMarks) * 100, 0);
    return Math.round(total / grades.length);
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-success';
    if (percentage >= 80) return 'text-primary';
    if (percentage >= 70) return 'text-warning';
    return 'text-destructive';
  };

  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading student information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-border/50 shadow-[var(--shadow-soft)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-card-foreground">{student.name}'s Progress</h1>
                <p className="text-sm text-muted-foreground">Welcome, {user?.name}</p>
              </div>
            </div>
            <Button 
              onClick={logout}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="dashboard-card">
            <CardContent className="flex items-center justify-center p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
                <h3 className="font-semibold">Attendance Rate</h3>
                <p className="text-2xl font-bold text-success">{getAttendancePercentage()}%</p>
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardContent className="flex items-center justify-center p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold">Average Grade</h3>
                <p className={`text-2xl font-bold ${getGradeColor(getAverageGrade())}`}>
                  {getAverageGrade()}%
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardContent className="flex items-center justify-center p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold">Class</h3>
                <p className="text-lg font-bold text-accent">{student.class}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Attendance */}
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Recent Attendance</span>
              </CardTitle>
              <CardDescription>
                Last 7 days attendance records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {attendanceRecords.slice(0, 7).map((record) => (
                  <div 
                    key={record.id} 
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">{record.date}</h4>
                      <p className="text-sm text-muted-foreground">{record.time}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {record.status === 'Present' ? (
                        <CheckCircle className="w-5 h-5 text-success" />
                      ) : (
                        <XCircle className="w-5 h-5 text-destructive" />
                      )}
                      <Badge 
                        variant="outline" 
                        className={
                          record.status === 'Present' 
                            ? "bg-success/10 text-success border-success/20"
                            : "bg-destructive/10 text-destructive border-destructive/20"
                        }
                      >
                        {record.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Academic Performance */}
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Academic Performance</span>
              </CardTitle>
              <CardDescription>
                Subject-wise grades and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {grades.map((grade) => {
                  const percentage = Math.round((grade.marks / grade.maxMarks) * 100);
                  return (
                    <div key={grade.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{grade.subject}</h4>
                        <Badge 
                          variant="outline" 
                          className={`${getGradeColor(percentage)} border-current`}
                        >
                          {grade.marks}/{grade.maxMarks} ({percentage}%)
                        </Badge>
                      </div>
                      <div className="w-full bg-muted/30 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            percentage >= 90 ? 'bg-success' :
                            percentage >= 80 ? 'bg-primary' :
                            percentage >= 70 ? 'bg-warning' :
                            'bg-destructive'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Attendance Chart */}
          <Card className="dashboard-card lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Attendance Overview</span>
              </CardTitle>
              <CardDescription>
                Monthly attendance summary and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-success/5 rounded-lg border border-success/20">
                  <div className="text-2xl font-bold text-success">
                    {attendanceRecords.filter(r => r.status === 'Present').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Present Days</div>
                </div>
                <div className="text-center p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                  <div className="text-2xl font-bold text-destructive">
                    {attendanceRecords.filter(r => r.status === 'Absent').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Absent Days</div>
                </div>
                <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="text-2xl font-bold text-primary">
                    {attendanceRecords.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Days</div>
                </div>
                <div className="text-center p-4 bg-accent/5 rounded-lg border border-accent/20">
                  <div className="text-2xl font-bold text-accent">
                    {getAverageGrade()}%
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Grade</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;