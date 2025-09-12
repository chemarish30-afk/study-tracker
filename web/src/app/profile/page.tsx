'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Student, StudentForm } from '@/types';

export default function ProfilePage() {
  const [student, setStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState<StudentForm>({
    name: '',
    email: '',
    mobile: '',
    dob: '',
    state: '',
    district: '',
    exam: 'UPSC',
    targetYear: new Date().getFullYear() + 1,
    otherInfo: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchStudentProfile();
  }, []);

  const fetchStudentProfile = async () => {
    try {
      const response = await fetch('/api/students');
      if (response.ok) {
        const data = await response.json();
        const studentData = data.data?.[0];
        if (studentData) {
          setStudent(studentData);
          setFormData({
            name: studentData.attributes.name || '',
            email: studentData.attributes.email || '',
            mobile: studentData.attributes.mobile || '',
            dob: studentData.attributes.dob || '',
            state: studentData.attributes.state || '',
            district: studentData.attributes.district || '',
            exam: studentData.attributes.exam || 'UPSC',
            targetYear: studentData.attributes.targetYear || new Date().getFullYear() + 1,
            otherInfo: studentData.attributes.otherInfo || '',
          });
        }
      }
    } catch (error) {
      console.error('Error fetching student profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/students/${student?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: formData,
        }),
      });

      if (response.ok) {
        setSuccess('Profile updated successfully!');
        fetchStudentProfile(); // Refresh data
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof StudentForm, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading profile...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">Manage your personal information and preferences</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
                  {success}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    id="mobile"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your mobile number"
                  />
                </div>

                <div>
                  <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="dob"
                    value={formData.dob}
                    onChange={(e) => handleInputChange('dob', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your state"
                  />
                </div>

                <div>
                  <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
                    District
                  </label>
                  <input
                    type="text"
                    id="district"
                    value={formData.district}
                    onChange={(e) => handleInputChange('district', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your district"
                  />
                </div>

                <div>
                  <label htmlFor="exam" className="block text-sm font-medium text-gray-700 mb-1">
                    Target Exam *
                  </label>
                  <select
                    id="exam"
                    required
                    value={formData.exam}
                    onChange={(e) => handleInputChange('exam', e.target.value as 'UPSC' | 'TNPSC' | 'NEET')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="UPSC">UPSC - Civil Services</option>
                    <option value="TNPSC">TNPSC - Tamil Nadu Civil Services</option>
                    <option value="NEET">NEET - Medical Entrance</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="targetYear" className="block text-sm font-medium text-gray-700 mb-1">
                    Target Year
                  </label>
                  <input
                    type="number"
                    id="targetYear"
                    min={new Date().getFullYear()}
                    max={new Date().getFullYear() + 5}
                    value={formData.targetYear}
                    onChange={(e) => handleInputChange('targetYear', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="otherInfo" className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Information
                </label>
                <textarea
                  id="otherInfo"
                  rows={4}
                  value={formData.otherInfo}
                  onChange={(e) => handleInputChange('otherInfo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Any additional information you'd like to share..."
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}



