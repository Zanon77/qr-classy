import React, { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { teacherStorage, classStorage, Teacher, Class } from '@/lib/storage';
import { UserPlus, BookOpen, Users, LogOut, Trash2, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'teachers' | 'classes'>('teachers');

  // Teacher form state
  const [teacherForm, setTeacherForm] = useState({
    teacherId: '',
    name: '',
    email: '',
    phone: '',
  });

  // Class form state
  const [classForm, setClassForm] = useState({
    name: '',
    subjects: [''],
  });

  const [teachers, setTeachers] = useState<Teacher[]>(teacherStorage.getAllTeachers());
  const [classes, setClasses] = useState<Class[]>(classStorage.getAllClasses());

  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!teacherForm.teacherId || !teacherForm.name || !teacherForm.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newTeacher: Teacher = {
      id: `teacher-${Date.now()}`,
      teacherId: teacherForm.teacherId,
      name: teacherForm.name,
      email: teacherForm.email,
      phone: teacherForm.phone,
      role: 'teacher',
    };

    teacherStorage.addTeacher(newTeacher);
    setTeachers(teacherStorage.getAllTeachers());
    setTeacherForm({ teacherId: '', name: '', email: '', phone: '' });
    
    toast({
      title: "Teacher Added",
      description: `${newTeacher.name} has been added successfully`,
    });
  };

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!classForm.name || classForm.subjects.some(subject => !subject.trim())) {
      toast({
        title: "Missing Information",
        description: "Please fill in class name and all subjects",
        variant: "destructive",
      });
      return;
    }

    const newClass: Class = {
      id: `class-${Date.now()}`,
      name: classForm.name,
      subjects: classForm.subjects.filter(subject => subject.trim()),
    };

    classStorage.addClass(newClass);
    setClasses(classStorage.getAllClasses());
    setClassForm({ name: '', subjects: [''] });
    
    toast({
      title: "Class Added",
      description: `${newClass.name} has been created successfully`,
    });
  };

  const addSubjectField = () => {
    setClassForm(prev => ({
      ...prev,
      subjects: [...prev.subjects, '']
    }));
  };

  const removeSubjectField = (index: number) => {
    setClassForm(prev => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index)
    }));
  };

  const updateSubject = (index: number, value: string) => {
    setClassForm(prev => ({
      ...prev,
      subjects: prev.subjects.map((subject, i) => i === index ? value : subject)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-border/50 shadow-[var(--shadow-soft)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-card-foreground">Admin Dashboard</h1>
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
        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-white/50 p-1 rounded-lg w-fit">
          <Button
            variant={activeTab === 'teachers' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('teachers')}
            className="flex items-center space-x-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Manage Teachers</span>
          </Button>
          <Button
            variant={activeTab === 'classes' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('classes')}
            className="flex items-center space-x-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Manage Classes</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {activeTab === 'teachers' && (
            <>
              {/* Add Teacher Form */}
              <Card className="dashboard-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <UserPlus className="w-5 h-5" />
                    <span>Add New Teacher</span>
                  </CardTitle>
                  <CardDescription>
                    Add a new teacher to the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddTeacher} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="teacherId">Teacher ID *</Label>
                      <Input
                        id="teacherId"
                        value={teacherForm.teacherId}
                        onChange={(e) => setTeacherForm(prev => ({ ...prev, teacherId: e.target.value }))}
                        placeholder="e.g., T001"
                        className="input-field"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={teacherForm.name}
                        onChange={(e) => setTeacherForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter teacher's full name"
                        className="input-field"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={teacherForm.email}
                        onChange={(e) => setTeacherForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="teacher@school.com"
                        className="input-field"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={teacherForm.phone}
                        onChange={(e) => setTeacherForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Enter phone number"
                        className="input-field"
                      />
                    </div>
                    <Button type="submit" className="w-full btn-primary">
                      Add Teacher
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Teachers List */}
              <Card className="dashboard-card">
                <CardHeader>
                  <CardTitle>Current Teachers ({teachers.length})</CardTitle>
                  <CardDescription>
                    All registered teachers in the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {teachers.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No teachers added yet
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {teachers.map((teacher) => (
                        <div 
                          key={teacher.id} 
                          className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                        >
                          <div>
                            <h4 className="font-medium">{teacher.name}</h4>
                            <p className="text-sm text-muted-foreground">{teacher.email}</p>
                            <Badge variant="outline" className="mt-1 text-xs">
                              ID: {teacher.teacherId}
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

          {activeTab === 'classes' && (
            <>
              {/* Add Class Form */}
              <Card className="dashboard-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5" />
                    <span>Add New Class</span>
                  </CardTitle>
                  <CardDescription>
                    Create a new class with subjects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddClass} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="className">Class Name *</Label>
                      <Input
                        id="className"
                        value={classForm.name}
                        onChange={(e) => setClassForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Grade 10-A"
                        className="input-field"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Subjects *</Label>
                      {classForm.subjects.map((subject, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            value={subject}
                            onChange={(e) => updateSubject(index, e.target.value)}
                            placeholder={`Subject ${index + 1}`}
                            className="input-field flex-1"
                            required
                          />
                          {classForm.subjects.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeSubjectField(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addSubjectField}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Subject
                      </Button>
                    </div>
                    
                    <Button type="submit" className="w-full btn-primary">
                      Create Class
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Classes List */}
              <Card className="dashboard-card">
                <CardHeader>
                  <CardTitle>Current Classes ({classes.length})</CardTitle>
                  <CardDescription>
                    All classes in the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {classes.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No classes created yet
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {classes.map((cls) => (
                        <div 
                          key={cls.id} 
                          className="p-4 bg-muted/30 rounded-lg"
                        >
                          <h4 className="font-medium mb-2">{cls.name}</h4>
                          <div className="flex flex-wrap gap-2">
                            {cls.subjects.map((subject, index) => (
                              <Badge key={index} variant="secondary">
                                {subject}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;