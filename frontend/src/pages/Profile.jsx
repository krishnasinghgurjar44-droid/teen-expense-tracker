import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { dashboardService } from '../services/dashboardService';
import ConfirmationModal from '../components/ConfirmationModal';
import { formatDate } from '../utils/formatters';
import {
  User,
  KeyRound,
  Trash2,
  LogOut,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Loader2
} from 'lucide-react';

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  // Name update state
  const [name, setName] = useState(user?.name || '');
  const [nameLoading, setNameLoading] = useState(false);
  const [nameFeedback, setNameFeedback] = useState({ type: '', text: '' });

  // Password update state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdFeedback, setPwdFeedback] = useState({ type: '', text: '' });

  // Delete account state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Update Name
  const handleUpdateName = async (e) => {
    e.preventDefault();
    setNameFeedback({ type: '', text: '' });

    if (!name.trim() || name.trim().length < 2) {
      setNameFeedback({ type: 'danger', text: 'Name must be at least 2 characters long.' });
      return;
    }

    setNameLoading(true);
    try {
      const res = await dashboardService.updateProfile({ name: name.trim() });
      if (res.success) {
        updateUser({ name: name.trim() });
        setNameFeedback({ type: 'success', text: 'Name updated successfully! ✨' });
      }
    } catch (err) {
      setNameFeedback({
        type: 'danger',
        text: err.response?.data?.message || 'Failed to update name.'
      });
    } finally {
      setNameLoading(false);
    }
  };

  // Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdFeedback({ type: '', text: '' });

    if (!currentPassword) {
      setPwdFeedback({ type: 'danger', text: 'Please enter your current password.' });
      return;
    }

    if (newPassword.length < 8 || !/(?=.*[a-zA-Z])(?=.*[0-9])/.test(newPassword)) {
      setPwdFeedback({
        type: 'danger',
        text: 'New password must be at least 8 characters with letters and numbers.'
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwdFeedback({ type: 'danger', text: 'New passwords do not match.' });
      return;
    }

    setPwdLoading(true);
    try {
      const res = await authService.changePassword({ currentPassword, newPassword, confirmPassword });
      if (res.success) {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPwdFeedback({ type: 'success', text: 'Password changed successfully! 🔒' });
      }
    } catch (err) {
      setPwdFeedback({
        type: 'danger',
        text: err.response?.data?.message || 'Failed to change password.'
      });
    } finally {
      setPwdLoading(false);
    }
  };

  // Delete Account
  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      await dashboardService.deleteAccount();
      logout();
      navigate('/register');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete account.');
      setDeleteLoading(false);
    }
  };

  return (
    <div className="page-wrapper animate-fade-in">
      <div className="profile-container">
        {/* Header */}
        <div className="profile-hero">
          <div className="profile-avatar-large">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'T'}
          </div>
          <div className="profile-info-block">
            <h1 className="profile-name-title">{user?.name || 'Teen User'}</h1>
            <p className="profile-email-text">{user?.email}</p>
            <div className="profile-badge-row">
              <span className="badge badge-info">
                <Calendar size={13} />
                <span>Member since {formatDate(user?.created_at || new Date())}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Update Profile Name Card */}
        <div className="card" style={{ marginBottom: '1.75rem' }}>
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <User size={18} color="#6366f1" />
              <h3 className="card-title">Edit Personal Details</h3>
            </div>
          </div>

          {nameFeedback.text && (
            <div
              className={`badge badge-${nameFeedback.type}`}
              style={{ width: '100%', padding: '0.75rem', marginBottom: '1.25rem' }}
            >
              {nameFeedback.text}
            </div>
          )}

          <form onSubmit={handleUpdateName}>
            <div className="form-group">
              <label className="form-label" htmlFor="name-input">
                Display Name
              </label>
              <input
                id="name-input"
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={nameLoading}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={nameLoading}
            >
              {nameLoading ? 'Saving...' : 'Update Name'}
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="card" style={{ marginBottom: '1.75rem' }}>
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <KeyRound size={18} color="#6366f1" />
              <h3 className="card-title">Change Password</h3>
            </div>
          </div>

          {pwdFeedback.text && (
            <div
              className={`badge badge-${pwdFeedback.type}`}
              style={{ width: '100%', padding: '0.75rem', marginBottom: '1.25rem' }}
            >
              {pwdFeedback.text}
            </div>
          )}

          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label className="form-label" htmlFor="curr-pwd">
                Current Password *
              </label>
              <input
                id="curr-pwd"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={pwdLoading}
                required
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="new-pwd">
                  New Password *
                </label>
                <input
                  id="new-pwd"
                  type="password"
                  className="form-input"
                  placeholder="Min. 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={pwdLoading}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="conf-pwd">
                  Confirm New Password *
                </label>
                <input
                  id="conf-pwd"
                  type="password"
                  className="form-input"
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={pwdLoading}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-secondary btn-sm"
              disabled={pwdLoading}
            >
              {pwdLoading ? 'Updating Password...' : 'Change Password'}
            </button>
          </form>
        </div>

        {/* Danger Zone: Logout & Account Deletion */}
        <div className="card danger-zone-card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <AlertTriangle size={18} color="#ef4444" />
              <h3 className="card-title" style={{ color: 'var(--danger)' }}>
                Account Actions
              </h3>
            </div>
          </div>

          <div className="danger-zone-body">
            <div className="danger-row">
              <div>
                <h4 className="danger-item-title">Sign Out</h4>
                <p className="danger-item-sub">End your active session on this device</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="btn btn-secondary btn-sm"
              >
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            </div>

            <div className="danger-row" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
              <div>
                <h4 className="danger-item-title" style={{ color: 'var(--danger)' }}>
                  Delete Account
                </h4>
                <p className="danger-item-sub">
                  Permanently erase your account, all expenses, and budget history.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="btn btn-danger btn-sm"
              >
                <Trash2 size={16} />
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Double Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Permanently Delete Account?"
        message="Deleting your account will permanently remove all your expense records, category stats, and budget data. This cannot be undone."
        confirmText="Yes, Permanently Delete"
        cancelText="Keep My Account"
        isDanger={true}
        isLoading={deleteLoading}
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowDeleteModal(false)}
      />

      <style>{`
        .profile-container {
          max-width: 680px;
          margin: 0 auto;
        }

        .profile-hero {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .profile-avatar-large {
          width: 72px;
          height: 72px;
          border-radius: var(--radius-full);
          background: var(--primary-gradient);
          color: #ffffff;
          font-weight: 800;
          font-size: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
        }

        .profile-info-block {
          flex: 1;
        }

        .profile-name-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .profile-email-text {
          font-size: 0.95rem;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
        }

        .profile-badge-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .danger-zone-card {
          border-color: rgba(239, 68, 68, 0.3);
        }

        .danger-zone-body {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .danger-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .danger-item-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .danger-item-sub {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 0.15rem;
        }
      `}</style>
    </div>
  );
}
