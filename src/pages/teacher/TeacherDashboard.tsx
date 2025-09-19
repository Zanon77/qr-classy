import React, { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { studentStorage, attendanceStorage, classStorage, Student, AttendanceRecord } from '@/lib/storage';
import { UserCheck, Camera, Users, ClipboardList, LogOut, UserPlus, QrCode, CheckCircle, Mail, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'attendance' | 'students' | 'records'>('attendance');

  // Student form state
  const [studentForm, setStudentForm] = useState({
    studentId: '',
    name: '',
    class: '',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
  });

  const [students, setStudents] = useState<Student[]>(studentStorage.getAllStudents());
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(attendanceStorage.getAllAttendance());
  const [classes] = useState(classStorage.getAllClasses());

  const handleTakeAttendance = () => {
    // For now, we'll simulate QR code scanning
    toast({
      title: "QR Scanner",
      description: "QR code scanner would open here. For demo, we'll simulate attendance marking.",
    });
    
    // Simulate scanning a QR code and marking attendance
    setTimeout(() => {
      if (students.length > 0) {
        const randomStudent = students[Math.floor(Math.random() * students.length)];
        const newRecord: AttendanceRecord = {
          id: `attendance-${Date.now()}`,
          studentId: randomStudent.id,
          studentName: randomStudent.name,
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
          status: 'Present',
          teacherId: user?.id || '',
        };
        
        attendanceStorage.addAttendanceRecord(newRecord);
        setAttendanceRecords(attendanceStorage.getAllAttendance());
        
        toast({
          title: "Attendance Marked",
          description: `${randomStudent.name} marked as present`,
        });
      } else {
        toast({
          title: "No Students",
          description: "Please add students first before taking attendance",
          variant: "destructive",
        });
      }
    }, 2000);
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!studentForm.studentId || !studentForm.name || !studentForm.class || !studentForm.parentName || !studentForm.parentEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newStudent: Student = {
      id: `student-${Date.now()}`,
      ...studentForm,
      teacherId: user?.id,
    };

    studentStorage.addStudent(newStudent);
    setStudents(studentStorage.getAllStudents());
    setStudentForm({
      studentId: '',
      name: '',
      class: '',
      parentName: '',
      parentEmail: '',
      parentPhone: '',
    });
    
    toast({
      title: "Student Added",
      description: `${newStudent.name} has been added successfully`,
    });
  };

  const handleSendEmail = (parentEmail: string, studentName: string) => {
    toast({
      title: "Email Sent",
      description: `Attendance notification sent to ${parentEmail} for ${studentName}`,
    });
  };

  const handleSendSMS = (parentPhone: string, studentName: string) => {
    toast({
      title: "SMS Sent",
      description: `Attendance notification sent to ${parentPhone} for ${studentName}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-border/50 shadow-[var(--shadow-soft)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-card-foreground">Teacher Dashboard</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {user?.name}</p>
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
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="dashboard-card cursor-pointer hover:scale-105 transition-transform" onClick={handleTakeAttendance}>
            <CardContent className="flex items-center justify-center p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <QrCode className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold">Take Attendance</h3>
                <p className="text-sm text-muted-foreground">Scan QR codes</p>
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardContent className="flex items-center justify-center p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-success" />
                </div>
                <h3 className="font-semibold">Total Students</h3>
                <p className="text-2xl font-bold text-success">{students.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardContent className="flex items-center justify-center p-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold">Today's Attendance</h3>
                <p className="text-2xl font-bold text-accent">
                  {attendanceRecords.filter(record => record.date === new Date().toLocaleDateString()).length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-white/50 p-1 rounded-lg w-fit">
          <Button
            variant={activeTab === 'attendance' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('attendance')}
            className="flex items-center space-x-2"
          >
            <Camera className="w-4 h-4" />
            <span>Take Attendance</span>
          </Button>
          <Button
            variant={activeTab === 'students' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('students')}
            className="flex items-center space-x-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Student</span>
          </Button>
          <Button
            variant={activeTab === 'records' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('records')}
            className="flex items-center space-x-2"
          >
            <ClipboardList className="w-4 h-4" />
            <span>View Records</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {activeTab === 'attendance' && (
            <>
              <Card className="dashboard-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <QrCode className="w-5 h-5" />
                    <span>QR Code Attendance</span>
                  </CardTitle>
                  <CardDescription>
                    Click the button below to open camera and scan student QR codes
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="py-8">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Camera className="w-12 h-12 text-primary" />
                    </div>
                    <Button onClick={handleTakeAttendance} className="btn-primary">
                      <QrCode className="w-4 h-4 mr-2" />
                      Start QR Scanner
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="dashboard-card">
                <CardHeader>
                  <CardTitle>Recent Attendance</CardTitle>
                  <CardDescription>
                    Latest attendance records from today
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {attendanceRecords.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No attendance records yet
                    </p>
                  ) : (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {attendanceRecords
                        .filter(record => record.date === new Date().toLocaleDateString())
                        .slice(-5)
                        .map((record) => (
                        <div 
                          key={record.id} 
                          className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                        >
                          <div>
                            <h4 className="font-medium">{record.studentName}</h4>
                            <p className="text-sm text-muted-foreground">{record.time}</p>
                          </div>
                          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                            {record.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === 'students' && (
            <>
              <Card className="dashboard-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <UserPlus className="w-5 h-5" />
                    <span>Add New Student</span>
                  </CardTitle>
                  <CardDescription>
                    Register a new student in your class
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddStudent} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="studentId">Student ID *</Label>
                      <Input
                        id="studentId"
                        value={studentForm.studentId}
                        onChange={(e) => setStudentForm(prev => ({ ...prev, studentId: e.target.value }))}
                        placeholder="e.g., S001"
                        className="input-field"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="studentName">Full Name *</Label>
                      <Input
                        id="studentName"
                        value={studentForm.name}
                        onChange={(e) => setStudentForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter student's full name"
                        className="input-field"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="class">Class *</Label>
                      <Select value={studentForm.class} onValueChange={(value) => setStudentForm(prev => ({ ...prev, class: value }))}>
                        <SelectTrigger className="input-field">
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent>
                          {classes.map((cls) => (
                            <SelectItem key={cls.id} value={cls.name}>
                              {cls.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="parentName">Parent's Name *</Label>
                      <Input
                        id="parentName"
                        value={studentForm.parentName}
                        onChange={(e) => setStudentForm(prev => ({ ...prev, parentName: e.target.value }))}
                        placeholder="Enter parent's full name"
                        className="input-field"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="parentEmail">Parent's Email *</Label>
                      <Input
                        id="parentEmail"
                        type="email"
                        value={studentForm.parentEmail}
                        onChange={(e) => setStudentForm(prev => ({ ...prev, parentEmail: e.target.value }))}
                        placeholder="parent@email.com"
                        className="input-field"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="parentPhone">Parent's Phone</Label>
                      <Input
                        id="parentPhone"
                        value={studentForm.parentPhone}
                        onChange={(e) => setStudentForm(prev => ({ ...prev, parentPhone: e.target.value }))}
                        placeholder="Enter phone number"
                        className="input-field"
                      />
                    </div>
                    <Button type="submit" className="w-full btn-primary">
                      Add Student
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="dashboard-card">
                <CardHeader>
                  <CardTitle>Current Students ({students.length})</CardTitle>
                  <CardDescription>
                    All students in your classes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {students.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No students added yet
                    </p>
                  ) : (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {students.map((student) => (
                        <div 
                          key={student.id} 
                          className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                        >
                          <div>
                            <h4 className="font-medium">{student.name}</h4>
                            <p className="text-sm text-muted-foreground">{student.class}</p>
                            <Badge variant="outline" className="mt-1 text-xs">
                              ID: {student.id}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === 'records' && (
            <Card className="dashboard-card lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ClipboardList className="w-5 h-5" />
                  <span>Attendance Records</span>
                </CardTitle>
                <CardDescription>
                  View and manage all attendance records
                </CardDescription>
              </CardHeader>
              <CardContent>
                {attendanceRecords.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No attendance records yet
                  </p>
                ) : (
                  <div className="space-y-4">
                    {attendanceRecords.map((record) => {
                      const student = students.find(s => s.id === record.studentId);
                      return (
                        <div 
                          key={record.id} 
                          className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
                        >
                          <div className="flex-1">
                            <h4 className="font-medium">{record.studentName}</h4>
                            <p className="text-sm text-muted-foreground">
                              {record.date} at {record.time}
                            </p>
                          </div>
                          <div className="flex items-center space-x-3">
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
                            {student && (
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleSendEmail(student.parentEmail, student.name)}
                                  className="flex items-center space-x-1"
                                >
                                  <Mail className="w-3 h-3" />
                                  <span>Email</span>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleSendSMS(student.parentPhone, student.name)}
                                  className="flex items-center space-x-1"
                                >
                                  <MessageCircle className="w-3 h-3" />
                                  <span>SMS</span>
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;