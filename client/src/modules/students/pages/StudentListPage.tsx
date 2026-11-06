import React, { useEffect, useState, useCallback } from 'react';
import { studentService } from '../services/student.service';
import type { Student } from '../types/student.types';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import { EmptyState } from '../../../components/common/EmptyState';
import { formatValue } from '../../../utils/format';
import { formatDate } from '../../../utils/date';
import { Plus, Trash2, X, GraduationCap, Search, ChevronLeft, ChevronRight } from 'lucide-react';

export const StudentListPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination state
  const [search, setSearch] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Add form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [rollNumber, setRollNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [grade, setGrade] = useState('10');
  const [section, setSection] = useState('A');
  const [gender, setGender] = useState('male');
  const [parentPhone, setParentPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const res = await studentService.getStudents({
        page,
        limit: 10,
        search: search.trim() || undefined,
        grade: selectedGrade || undefined
      });
      setStudents(res.students);
      setTotalPages(res.totalPages);
      setTotalCount(res.total);
      setError(null);
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || 'Failed to load students.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [page, search, selectedGrade]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await studentService.createStudent({
        rollNumber,
        firstName,
        lastName,
        email,
        grade,
        section,
        gender,
        parentPhone: parentPhone.trim() ? parentPhone.trim() : undefined,
        status: 'active'
      });
      setShowAddForm(false);
      setRollNumber('');
      setFirstName('');
      setLastName('');
      setEmail('');
      setParentPhone('');
      toast.success(`Student ${firstName} ${lastName} created successfully!`);
      fetchStudents();
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || 'Failed to create student.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you really want to remove student "${name}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete student',
      cancelButtonText: 'Cancel',
      background: 'var(--bg-surface)',
      color: 'var(--text-primary)'
    });

    if (result.isConfirmed) {
      try {
        await studentService.deleteStudent(id);
        toast.success(`Student "${name}" removed successfully.`);
        fetchStudents();
      } catch (err: any) {
        const msg = err.response?.data?.error?.message || 'Failed to delete student.';
        toast.error(msg);
      }
    }
  };

  return (
    <div className="page-container">
      {/* Header bar */}
      <div className="page-header">
        <div className="page-title-group">
          <div className="page-icon-badge">
            <GraduationCap size={24} />
          </div>
          <div>
            <h1 className="page-title">Student Directory</h1>
            <p className="page-subtitle">
              Multi-tenant isolated business module ({totalCount} total students)
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-primary"
        >
          {showAddForm ? <X size={16} /> : <Plus size={16} />}
          {showAddForm ? 'Close Form' : 'Add Student'}
        </button>
      </div>

      {/* Add Student Card Form */}
      {showAddForm && (
        <div className="card">
          <div className="card-header">
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Enrol New Student
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>* Required fields</span>
          </div>
          <div className="card-body">
            <form onSubmit={handleCreateStudent}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Roll Number *</label>
                  <input
                    required
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    placeholder="e.g. STU-1001"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@school.edu"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">First Name *</label>
                  <input
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. John"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name *</label>
                  <input
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Doe"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Grade / Class *</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="form-select"
                  >
                    <option value="8">Grade 8</option>
                    <option value="9">Grade 9</option>
                    <option value="10">Grade 10</option>
                    <option value="11">Grade 11</option>
                    <option value="12">Grade 12</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Section *</label>
                  <input
                    required
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    placeholder="e.g. A"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Gender *</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="form-select"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Parent Phone (Optional)</label>
                  <input
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    placeholder="e.g. +91 9876543210"
                    className="form-input"
                  />
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px',
                  marginTop: '20px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border)'
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? 'Enrolling...' : 'Save Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {error && (
        <div
          style={{
            padding: '14px 18px',
            backgroundColor: '#fee2e2',
            color: '#b91c1c',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #fca5a5',
            fontSize: '13px'
          }}
        >
          {error}
        </div>
      )}

      {/* Styled Table Card */}
      <div className="card">
        {/* Search & Filters Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, maxWidth: '320px' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by name, roll no..."
                className="form-input"
                style={{ paddingLeft: '34px' }}
              />
              <Search
                size={16}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <select
              value={selectedGrade}
              onChange={(e) => {
                setSelectedGrade(e.target.value);
                setPage(1);
              }}
              className="form-select"
              style={{ width: 'auto', paddingRight: '28px' }}
            >
              <option value="">All Grades</option>
              <option value="8">Grade 8</option>
              <option value="9">Grade 9</option>
              <option value="10">Grade 10</option>
              <option value="11">Grade 11</option>
              <option value="12">Grade 12</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading student directory...
          </div>
        ) : students.length === 0 ? (
          <EmptyState
            title="No students found"
            description={search || selectedGrade ? "No students match your filter criteria." : "There are currently no students registered in this tenant."}
            actionText={search || selectedGrade ? "Clear Filters" : "+ Enrol First Student"}
            onAction={() => {
              if (search || selectedGrade) {
                setSearch('');
                setSelectedGrade('');
              } else {
                setShowAddForm(true);
              }
            }}
          />
        ) : (
          <>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Roll No</th>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>Class & Section</th>
                    <th>Parent Phone</th>
                    <th>Enrolled Date</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => {
                    const fullName = `${formatValue(student.firstName)} ${formatValue(student.lastName)}`;
                    return (
                      <tr key={student._id}>
                        <td style={{ fontWeight: 600 }}>{formatValue(student.rollNumber)}</td>
                        <td style={{ fontWeight: 500 }}>{fullName}</td>
                        <td style={{ color: 'var(--text-muted)' }}>{formatValue(student.email)}</td>
                        <td style={{ color: 'var(--text-muted)' }}>
                          Grade {formatValue(student.grade)} - {formatValue(student.section)}
                        </td>
                        <td style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                          {formatValue(student.parentPhone, 'N/A')}
                        </td>
                        <td style={{ color: 'var(--text-muted)' }}>
                          {formatDate(student.createdAt)}
                        </td>
                        <td>
                          <span className={`badge-status ${student.status === 'active' ? 'active' : 'inactive'}`}>
                            {formatValue(student.status)}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            onClick={() => handleDelete(student._id, fullName)}
                            title="Delete student"
                            className="btn btn-danger"
                          >
                            <Trash2 size={13} />
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls Footer */}
            {totalPages > 1 && (
              <div
                style={{
                  padding: '14px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid var(--border)',
                  fontSize: '13px',
                  color: 'var(--text-muted)'
                }}
              >
                <span>
                  Showing page <strong style={{ color: 'var(--text-primary)' }}>{page}</strong> of{' '}
                  <strong style={{ color: 'var(--text-primary)' }}>{totalPages}</strong>
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="btn btn-outline"
                    style={{ padding: '6px 12px', fontSize: '12px' }}
                  >
                    <ChevronLeft size={14} />
                    <span>Previous</span>
                  </button>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="btn btn-outline"
                    style={{ padding: '6px 12px', fontSize: '12px' }}
                  >
                    <span>Next</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
