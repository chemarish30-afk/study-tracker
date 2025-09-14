'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ExamCourse, Subject, Unit, Chapter, Module, Content } from '@/types';

type NavigationLevel = 'exam' | 'subject' | 'unit' | 'chapter' | 'module' | 'content';

export default function CoursesPage() {
  const [examCourses, setExamCourses] = useState<ExamCourse[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [contents, setContents] = useState<Content[]>([]);
  const [currentLevel, setCurrentLevel] = useState<NavigationLevel>('exam');
  const [selectedExam, setSelectedExam] = useState<ExamCourse | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExamCourses();
  }, []);

  const fetchExamCourses = async () => {
    try {
      const response = await fetch('/api/exam-courses?populate=subjects');
      if (response.ok) {
        const data = await response.json();
        setExamCourses(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching exam courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async (examCourseId: number) => {
    try {
      const response = await fetch(`/api/subjects?filters[exam_course][id][$eq]=${examCourseId}&populate=units`);
      if (response.ok) {
        const data = await response.json();
        setSubjects(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchUnits = async (subjectId: number) => {
    try {
      const response = await fetch(`/api/units?filters[subject][id][$eq]=${subjectId}&populate=chapters`);
      if (response.ok) {
        const data = await response.json();
        setUnits(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching units:', error);
    }
  };

  const fetchChapters = async (unitId: number) => {
    try {
      const response = await fetch(`/api/chapters?filters[unit][id][$eq]=${unitId}&populate=modules`);
      if (response.ok) {
        const data = await response.json();
        setChapters(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching chapters:', error);
    }
  };

  const fetchModules = async (chapterId: number) => {
    try {
      const response = await fetch(`/api/modules?filters[chapter][id][$eq]=${chapterId}&populate=contents`);
      if (response.ok) {
        const data = await response.json();
        setModules(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching modules:', error);
    }
  };

  const fetchContents = async (moduleId: number) => {
    try {
      const response = await fetch(`/api/contents?filters[module][id][$eq]=${moduleId}`);
      if (response.ok) {
        const data = await response.json();
        setContents(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching contents:', error);
    }
  };

  const handleExamSelect = (exam: ExamCourse) => {
    setSelectedExam(exam);
    setCurrentLevel('subject');
    fetchSubjects(exam.id);
  };

  const handleSubjectSelect = (subject: Subject) => {
    setSelectedSubject(subject);
    setCurrentLevel('unit');
    fetchUnits(subject.id);
  };

  const handleUnitSelect = (unit: Unit) => {
    setSelectedUnit(unit);
    setCurrentLevel('chapter');
    fetchChapters(unit.id);
  };

  const handleChapterSelect = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setCurrentLevel('module');
    fetchModules(chapter.id);
  };

  const handleModuleSelect = (module: Module) => {
    setSelectedModule(module);
    setCurrentLevel('content');
    fetchContents(module.id);
  };

  const handleBack = () => {
    switch (currentLevel) {
      case 'subject':
        setCurrentLevel('exam');
        setSelectedExam(null);
        break;
      case 'unit':
        setCurrentLevel('subject');
        setSelectedSubject(null);
        break;
      case 'chapter':
        setCurrentLevel('unit');
        setSelectedUnit(null);
        break;
      case 'module':
        setCurrentLevel('chapter');
        setSelectedChapter(null);
        break;
      case 'content':
        setCurrentLevel('module');
        setSelectedModule(null);
        break;
    }
  };

  const getBreadcrumb = () => {
    const items = [];
    if (selectedExam) items.push(selectedExam.attributes.title);
    if (selectedSubject) items.push(selectedSubject.attributes.title);
    if (selectedUnit) items.push(selectedUnit.attributes.title);
    if (selectedChapter) items.push(selectedChapter.attributes.title);
    if (selectedModule) items.push(selectedModule.attributes.title);
    return items.join(' > ');
  };

  const renderContent = () => {
    switch (currentLevel) {
      case 'exam':
        return (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {examCourses.map((exam) => (
              <Card key={exam.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleExamSelect(exam)}>
                <CardHeader>
                  <CardTitle className="text-xl">{exam.attributes.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {exam.attributes.summary && (
                    <p className="text-gray-600">{exam.attributes.summary}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 'subject':
        return (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <Card key={subject.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleSubjectSelect(subject)}>
                <CardHeader>
                  <CardTitle className="text-xl">{subject.attributes.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {subject.attributes.summary && (
                    <p className="text-gray-600">{subject.attributes.summary}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 'unit':
        return (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {units.map((unit) => (
              <Card key={unit.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleUnitSelect(unit)}>
                <CardHeader>
                  <CardTitle className="text-xl">{unit.attributes.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {unit.attributes.summary && (
                    <p className="text-gray-600">{unit.attributes.summary}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 'chapter':
        return (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chapters.map((chapter) => (
              <Card key={chapter.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleChapterSelect(chapter)}>
                <CardHeader>
                  <CardTitle className="text-xl">{chapter.attributes.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {chapter.attributes.summary && (
                    <p className="text-gray-600">{chapter.attributes.summary}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 'module':
        return (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <Card key={module.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleModuleSelect(module)}>
                <CardHeader>
                  <CardTitle className="text-xl">{module.attributes.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {module.attributes.summary && (
                    <p className="text-gray-600">{module.attributes.summary}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 'content':
        return (
          <div className="space-y-6">
            {contents.map((content) => (
              <Card key={content.id}>
                <CardHeader>
                  <CardTitle className="text-xl">{content.attributes.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: content.attributes.body }}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading courses...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
            {getBreadcrumb() && (
              <p className="text-gray-600 mt-1">{getBreadcrumb()}</p>
            )}
          </div>
          {currentLevel !== 'exam' && (
            <button
              onClick={handleBack}
              className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              <span className="mr-2">←</span>
              Back
            </button>
          )}
        </div>

        {/* Content */}
        {renderContent()}

        {/* Empty State */}
        {currentLevel === 'exam' && examCourses.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No exam courses available at the moment.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}





