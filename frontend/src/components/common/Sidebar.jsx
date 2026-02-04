import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HomeIcon,
  UserGroupIcon,
  CalendarIcon,
  UserIcon,
  ClipboardDocumentIcon,
  ShieldCheckIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

export const Sidebar = () => {
  const { userType } = useAuth();
  const location = useLocation();

  const patientNav = [
    { name: 'Dashboard', href: '/patient/dashboard', icon: HomeIcon },
    { name: 'Consultations', href: '/patient/consultations', icon: CalendarIcon },
    { name: 'Profile', href: '/patient/profile', icon: UserIcon },
  ];

  const doctorNav = [
    { name: 'Dashboard', href: '/doctor/dashboard', icon: HomeIcon },
    { name: 'Available', href: '/doctor/available', icon: ClipboardDocumentIcon },
    { name: 'My Consultations', href: '/doctor/consultations', icon: CalendarIcon },
    { name: 'Profile', href: '/doctor/profile', icon: UserIcon },
  ];

  const adminNav = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
    { name: 'Doctor Verification', href: '/admin/doctors/pending', icon: ShieldCheckIcon },
    { name: 'All Doctors', href: '/admin/doctors', icon: UserGroupIcon },
    { name: 'All Patients', href: '/admin/patients', icon: UsersIcon },
  ];

  const navigation = userType === 'patient' ? patientNav :
                    userType === 'doctor' ? doctorNav :
                    userType === 'admin' ? adminNav : [];

  if (!userType) return null;

  return (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
      <div className="flex flex-col flex-grow border-r border-gray-200 bg-white pt-5 pb-4 overflow-y-auto">
        <nav className="flex-1 px-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};