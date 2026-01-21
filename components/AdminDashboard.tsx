import React, { useState, useEffect } from 'react';
import { ClayCard, ClayButton, ClayInput } from './ClayComponents';
import { vaccineStore } from '../services/vaccineStore';
import type {
  Vaccine,
  VaccineStock,
  ClinicDay,
  Pool,
  PoolMember,
  Booking,
  WaitlistEntry,
  PharmacySettings,
  DashboardStats,
  WalkInWindow,
} from '../types/vaccine';
import {
  ArrowLeft,
  LayoutDashboard,
  Syringe,
  Calendar,
  Users,
  ClipboardList,
  Bell,
  Settings,
  Plus,
  Minus,
  Trash2,
  Edit,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';

interface AdminDashboardProps {
  onBack: () => void;
}

type AdminTab = 'dashboard' | 'vaccines' | 'clinic-days' | 'pools' | 'bookings' | 'waitlist' | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [stock, setStock] = useState<VaccineStock[]>([]);
  const [clinicDays, setClinicDays] = useState<ClinicDay[]>([]);
  const [pools, setPools] = useState<Pool[]>([]);
  const [poolMembers, setPoolMembers] = useState<PoolMember[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [settings, setSettings] = useState<PharmacySettings | null>(null);
  const [showAddClinicDay, setShowAddClinicDay] = useState(false);
  const [newClinicDay, setNewClinicDay] = useState({
    vaccineId: '',
    clinicDate: '',
    allocatedDoses: 10,
    walkInWindows: [{ startTime: '09:00', endTime: '12:00' }] as WalkInWindow[],
  });

  const refreshData = () => {
    setStats(vaccineStore.getDashboardStats());
    setVaccines(vaccineStore.getVaccines());
    setStock(vaccineStore.getStock());
    setClinicDays(vaccineStore.getClinicDays());
    setPools(vaccineStore.getPools());
    setPoolMembers(vaccineStore.getPoolMembers());
    setBookings(vaccineStore.getBookings());
    setWaitlist(vaccineStore.getWaitlist());
    setSettings(vaccineStore.getSettings());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const getVaccineName = (vaccineId: string): string => {
    const vaccine = vaccines.find((v) => v.id === vaccineId);
    return vaccine?.name || 'Unknown';
  };

  const getStockForVaccine = (vaccineId: string): VaccineStock | undefined => {
    return stock.find((s) => s.vaccineId === vaccineId);
  };

  const formatDate = (dateStr: string | Date): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const handleStockChange = (vaccineId: string, change: number) => {
    vaccineStore.updateStock(vaccineId, change);
    refreshData();
  };

  const handleToggleVaccine = (vaccineId: string, isActive: boolean) => {
    vaccineStore.updateVaccine(vaccineId, { isActive });
    refreshData();
  };

  const handleAddClinicDay = () => {
    if (!newClinicDay.vaccineId || !newClinicDay.clinicDate) return;

    vaccineStore.addClinicDay({
      vaccineId: newClinicDay.vaccineId,
      clinicDate: newClinicDay.clinicDate,
      allocatedDoses: newClinicDay.allocatedDoses,
      walkInWindows: newClinicDay.walkInWindows,
      isActive: true,
    });

    setNewClinicDay({
      vaccineId: '',
      clinicDate: '',
      allocatedDoses: 10,
      walkInWindows: [{ startTime: '09:00', endTime: '12:00' }],
    });
    setShowAddClinicDay(false);
    refreshData();
  };

  const handleDeleteClinicDay = (id: string) => {
    if (confirm('Are you sure you want to delete this clinic day?')) {
      vaccineStore.deleteClinicDay(id);
      refreshData();
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      vaccineStore.cancelBooking(bookingId);
      refreshData();
    }
  };

  const handleOpenPool = (poolId: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    vaccineStore.updatePoolStatus(poolId, 'open', dateStr);
    refreshData();
  };

  const handleSaveSettings = () => {
    if (settings) {
      vaccineStore.updateSettings(settings);
      alert('Settings saved successfully!');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'declined':
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'moved':
        return <RefreshCw className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      filling: 'bg-yellow-100 text-yellow-700',
      open: 'bg-green-100 text-green-700',
      full: 'bg-blue-100 text-blue-700',
      completed: 'bg-gray-100 text-gray-700',
      confirmed: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      declined: 'bg-red-100 text-red-700',
      cancelled: 'bg-red-100 text-red-700',
      waiting: 'bg-blue-100 text-blue-700',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-bold ${colors[status] || 'bg-gray-100 text-gray-700'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const renderSidebar = () => (
    <div className="w-full md:w-64 shrink-0">
      <ClayCard className="p-4">
        <div className="space-y-2">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'vaccines', icon: Syringe, label: 'Vaccines & Stock' },
            { id: 'clinic-days', icon: Calendar, label: 'Clinic Days' },
            { id: 'pools', icon: Users, label: 'Pool Management' },
            { id: 'bookings', icon: ClipboardList, label: 'Bookings' },
            { id: 'waitlist', icon: Bell, label: 'Waitlist' },
            { id: 'settings', icon: Settings, label: 'Settings' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as AdminTab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id
                  ? 'bg-blue-100 text-blue-700 font-bold'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </ClayCard>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ClayCard className="p-4 text-center">
          <p className="text-3xl font-bold text-blue-600">{stats?.totalBookings || 0}</p>
          <p className="text-sm text-gray-500">Total Bookings</p>
          <p className="text-xs text-green-500 mt-1">+{stats?.todayBookings || 0} today</p>
        </ClayCard>
        <ClayCard className="p-4 text-center">
          <p className="text-3xl font-bold text-purple-600">{stats?.activePools || 0}</p>
          <p className="text-sm text-gray-500">Active Pools</p>
          <p className="text-xs text-gray-400 mt-1">{stats?.waitingPatients || 0} waiting</p>
        </ClayCard>
        <ClayCard className="p-4 text-center">
          <p className="text-3xl font-bold text-teal-600">{stats?.totalStock || 0}</p>
          <p className="text-sm text-gray-500">Total Stock</p>
          <p className="text-xs text-gray-400 mt-1">doses available</p>
        </ClayCard>
        <ClayCard className="p-4 text-center">
          <p className="text-3xl font-bold text-orange-600">{stats?.waitlistCount || 0}</p>
          <p className="text-sm text-gray-500">Waitlist</p>
          <p className="text-xs text-gray-400 mt-1">patients waiting</p>
        </ClayCard>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Pools */}
        <ClayCard className="p-6">
          <h3 className="font-bold text-lg text-gray-800 mb-4">Pool Status</h3>
          <div className="space-y-3">
            {pools
              .filter((p) => p.status === 'filling' || p.status === 'open')
              .map((pool) => {
                const members = poolMembers.filter((m) => m.poolId === pool.id);
                const vaccine = vaccines.find((v) => v.id === pool.vaccineId);
                return (
                  <div key={pool.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-bold text-gray-700">{vaccine?.name}</p>
                      <p className="text-sm text-gray-500">
                        {members.length}/{vaccine?.dosesPerVial || 0} patients
                      </p>
                    </div>
                    {getStatusBadge(pool.status)}
                  </div>
                );
              })}
            {pools.filter((p) => p.status === 'filling' || p.status === 'open').length === 0 && (
              <p className="text-gray-500 text-center py-4">No active pools</p>
            )}
          </div>
        </ClayCard>

        {/* Upcoming Clinic Days */}
        <ClayCard className="p-6">
          <h3 className="font-bold text-lg text-gray-800 mb-4">Upcoming Clinic Days</h3>
          <div className="space-y-3">
            {clinicDays
              .filter((cd) => cd.clinicDate >= new Date().toISOString().split('T')[0])
              .slice(0, 3)
              .map((day) => (
                <div key={day.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-bold text-gray-700">{formatDate(day.clinicDate)}</p>
                    <p className="text-sm text-gray-500">{getVaccineName(day.vaccineId)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-700">
                      {day.bookedDoses}/{day.allocatedDoses}
                    </p>
                    <p className="text-xs text-gray-500">booked</p>
                  </div>
                </div>
              ))}
            {clinicDays.filter((cd) => cd.clinicDate >= new Date().toISOString().split('T')[0]).length === 0 && (
              <p className="text-gray-500 text-center py-4">No upcoming clinic days</p>
            )}
          </div>
        </ClayCard>
      </div>

      {/* Alerts */}
      {stock.some((s) => s.totalStock - s.allocatedStock < 10) && (
        <ClayCard className="p-4 bg-orange-50 border-l-4 border-orange-500">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <div>
              <p className="font-bold text-orange-700">Low Stock Alert</p>
              <p className="text-sm text-orange-600">
                {stock
                  .filter((s) => s.totalStock - s.allocatedStock < 10)
                  .map((s) => getVaccineName(s.vaccineId))
                  .join(', ')}{' '}
                running low
              </p>
            </div>
          </div>
        </ClayCard>
      )}
    </div>
  );

  const renderVaccines = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Vaccines & Stock</h2>
      </div>

      <div className="space-y-4">
        {vaccines.map((vaccine) => {
          const vaccineStock = getStockForVaccine(vaccine.id);
          const available = vaccineStock ? vaccineStock.totalStock - vaccineStock.allocatedStock : 0;
          const isLowStock = available < 10;

          return (
            <ClayCard key={vaccine.id} className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      vaccine.type === 'vial' ? 'bg-blue-100 text-blue-600' : 'bg-teal-100 text-teal-600'
                    }`}
                  >
                    <Syringe className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg text-gray-800">{vaccine.name}</h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          vaccine.type === 'vial' ? 'bg-blue-100 text-blue-700' : 'bg-teal-100 text-teal-700'
                        }`}
                      >
                        {vaccine.type === 'vial' ? 'Pool' : 'Slot'}
                      </span>
                      {!vaccine.isActive && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-500">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {vaccine.type === 'vial' ? `${vaccine.dosesPerVial} doses per vial` : 'Pre-filled syringe'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">{vaccineStock?.totalStock || 0}</p>
                    <p className="text-xs text-gray-500">Total</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">{vaccineStock?.allocatedStock || 0}</p>
                    <p className="text-xs text-gray-500">Allocated</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-2xl font-bold ${isLowStock ? 'text-orange-500' : 'text-green-600'}`}>
                      {available}
                    </p>
                    <p className="text-xs text-gray-500">Available</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                <ClayButton
                  variant="secondary"
                  className="!px-3 !py-2 text-sm"
                  onClick={() => handleStockChange(vaccine.id, -10)}
                >
                  -10
                </ClayButton>
                <ClayButton
                  variant="secondary"
                  className="!px-3 !py-2 text-sm"
                  onClick={() => handleStockChange(vaccine.id, -1)}
                >
                  -1
                </ClayButton>
                <ClayButton
                  variant="secondary"
                  className="!px-3 !py-2 text-sm"
                  onClick={() => handleStockChange(vaccine.id, 1)}
                >
                  +1
                </ClayButton>
                <ClayButton
                  variant="secondary"
                  className="!px-3 !py-2 text-sm"
                  onClick={() => handleStockChange(vaccine.id, 10)}
                >
                  +10
                </ClayButton>
                <div className="flex-1" />
                <ClayButton
                  variant={vaccine.isActive ? 'danger' : 'primary'}
                  className="!px-4 !py-2 text-sm"
                  onClick={() => handleToggleVaccine(vaccine.id, !vaccine.isActive)}
                >
                  {vaccine.isActive ? 'Deactivate' : 'Activate'}
                </ClayButton>
              </div>

              {isLowStock && (
                <div className="mt-4 p-3 bg-orange-50 rounded-xl flex items-center gap-2 text-orange-700">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">Low stock warning</span>
                </div>
              )}
            </ClayCard>
          );
        })}
      </div>
    </div>
  );

  const renderClinicDays = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Clinic Days</h2>
        <ClayButton className="!px-4 !py-2" onClick={() => setShowAddClinicDay(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Clinic Day
        </ClayButton>
      </div>

      {/* Add Clinic Day Modal */}
      {showAddClinicDay && (
        <ClayCard className="p-6 border-2 border-blue-200">
          <h3 className="font-bold text-lg text-gray-800 mb-4">Add New Clinic Day</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2">Vaccine</label>
              <select
                className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200"
                value={newClinicDay.vaccineId}
                onChange={(e) => setNewClinicDay({ ...newClinicDay, vaccineId: e.target.value })}
              >
                <option value="">Select vaccine...</option>
                {vaccines
                  .filter((v) => v.type === 'prefilled' && v.isActive)
                  .map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2">Date</label>
              <ClayInput
                type="date"
                value={newClinicDay.clinicDate}
                onChange={(e) => setNewClinicDay({ ...newClinicDay, clinicDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2">Allocated Doses</label>
              <ClayInput
                type="number"
                min="1"
                value={newClinicDay.allocatedDoses}
                onChange={(e) =>
                  setNewClinicDay({ ...newClinicDay, allocatedDoses: parseInt(e.target.value) || 1 })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2">Walk-in Hours</label>
              {newClinicDay.walkInWindows.map((window, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <ClayInput
                    type="time"
                    value={window.startTime}
                    onChange={(e) => {
                      const windows = [...newClinicDay.walkInWindows];
                      windows[index].startTime = e.target.value;
                      setNewClinicDay({ ...newClinicDay, walkInWindows: windows });
                    }}
                  />
                  <span className="text-gray-500">to</span>
                  <ClayInput
                    type="time"
                    value={window.endTime}
                    onChange={(e) => {
                      const windows = [...newClinicDay.walkInWindows];
                      windows[index].endTime = e.target.value;
                      setNewClinicDay({ ...newClinicDay, walkInWindows: windows });
                    }}
                  />
                  {newClinicDay.walkInWindows.length > 1 && (
                    <ClayButton
                      variant="danger"
                      className="!p-2"
                      onClick={() => {
                        const windows = newClinicDay.walkInWindows.filter((_, i) => i !== index);
                        setNewClinicDay({ ...newClinicDay, walkInWindows: windows });
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </ClayButton>
                  )}
                </div>
              ))}
              <ClayButton
                variant="secondary"
                className="!px-3 !py-2 text-sm mt-2"
                onClick={() =>
                  setNewClinicDay({
                    ...newClinicDay,
                    walkInWindows: [...newClinicDay.walkInWindows, { startTime: '14:00', endTime: '17:00' }],
                  })
                }
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Time Window
              </ClayButton>
            </div>
            <div className="flex gap-2 pt-4">
              <ClayButton onClick={handleAddClinicDay}>Create Clinic Day</ClayButton>
              <ClayButton variant="secondary" onClick={() => setShowAddClinicDay(false)}>
                Cancel
              </ClayButton>
            </div>
          </div>
        </ClayCard>
      )}

      {/* Clinic Days List */}
      <div className="space-y-4">
        {clinicDays
          .sort((a, b) => a.clinicDate.localeCompare(b.clinicDate))
          .map((day) => {
            const progress = (day.bookedDoses / day.allocatedDoses) * 100;
            const isPast = day.clinicDate < new Date().toISOString().split('T')[0];

            return (
              <ClayCard key={day.id} className={`p-6 ${isPast ? 'opacity-60' : ''}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      <h3 className="font-bold text-lg text-gray-800">{formatDate(day.clinicDate)}</h3>
                      {isPast && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-500">
                          Past
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600">{getVaccineName(day.vaccineId)}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {day.walkInWindows.map((w) => `${formatTime(w.startTime)} - ${formatTime(w.endTime)}`).join(' • ')}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-gray-800">
                        {day.bookedDoses} / {day.allocatedDoses}
                      </p>
                      <p className="text-xs text-gray-500">doses booked</p>
                    </div>
                    {!isPast && (
                      <ClayButton
                        variant="danger"
                        className="!p-2"
                        onClick={() => handleDeleteClinicDay(day.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </ClayButton>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        progress >= 100 ? 'bg-blue-500' : progress >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>
              </ClayCard>
            );
          })}

        {clinicDays.length === 0 && (
          <ClayCard className="p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No clinic days configured</p>
          </ClayCard>
        )}
      </div>
    </div>
  );

  const renderPools = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Pool Management</h2>

      <div className="space-y-4">
        {pools.map((pool) => {
          const members = poolMembers.filter((m) => m.poolId === pool.id);
          const vaccine = vaccines.find((v) => v.id === pool.vaccineId);
          const confirmedCount = members.filter((m) => m.status === 'confirmed').length;
          const pendingCount = members.filter((m) => m.status === 'pending').length;

          return (
            <ClayCard key={pool.id} className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg text-gray-800">{vaccine?.name} Pool</h3>
                    {getStatusBadge(pool.status)}
                  </div>
                  {pool.proposedDate && (
                    <p className="text-sm text-gray-500">
                      Proposed: {formatDate(pool.proposedDate)} • Deadline:{' '}
                      {pool.confirmationDeadline ? formatDate(pool.confirmationDeadline) : 'N/A'}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-800">
                      {members.length}/{vaccine?.dosesPerVial || 0}
                    </p>
                    <p className="text-xs text-gray-500">patients</p>
                  </div>
                  {pool.status === 'filling' && members.length > 0 && (
                    <ClayButton className="!px-4 !py-2" onClick={() => handleOpenPool(pool.id)}>
                      Open Pool
                    </ClayButton>
                  )}
                </div>
              </div>

              {/* Members List */}
              {members.length > 0 && (
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-sm font-bold text-gray-600 mb-3">
                    Patients ({confirmedCount} confirmed, {pendingCount} pending)
                  </p>
                  <div className="space-y-2">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          {getStatusIcon(member.status)}
                          <div>
                            <p className="font-medium text-gray-800">{member.patientName}</p>
                            <p className="text-xs text-gray-500">{member.patientEmail}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(member.status)}
                          <p className="text-xs text-gray-400 mt-1">
                            {member.isOriginalMember ? 'Original' : 'Late joiner'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {members.length === 0 && (
                <p className="text-gray-500 text-center py-4 border-t border-gray-100">
                  No patients in this pool yet
                </p>
              )}
            </ClayCard>
          );
        })}

        {pools.length === 0 && (
          <ClayCard className="p-8 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No active pools</p>
          </ClayCard>
        )}
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">All Bookings</h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
              <th className="pb-3 font-medium">Patient</th>
              <th className="pb-3 font-medium">Vaccine</th>
              <th className="pb-3 font-medium">Date</th>
              <th className="pb-3 font-medium">Type</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((booking) => {
                const clinicDay = clinicDays.find((cd) => cd.id === booking.clinicDayId);
                return (
                  <tr key={booking.id} className="border-b border-gray-100">
                    <td className="py-4">
                      <p className="font-medium text-gray-800">{booking.patientName}</p>
                      <p className="text-xs text-gray-500">{booking.patientEmail}</p>
                    </td>
                    <td className="py-4 text-gray-600">{getVaccineName(booking.vaccineId)}</td>
                    <td className="py-4 text-gray-600">
                      {clinicDay ? formatDate(clinicDay.clinicDate) : 'N/A'}
                    </td>
                    <td className="py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                          booking.bookingType === 'pool'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-teal-100 text-teal-700'
                        }`}
                      >
                        {booking.bookingType}
                      </span>
                    </td>
                    <td className="py-4">{getStatusBadge(booking.status)}</td>
                    <td className="py-4">
                      {booking.status === 'confirmed' && (
                        <ClayButton
                          variant="danger"
                          className="!px-3 !py-1 text-xs"
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          Cancel
                        </ClayButton>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        {bookings.length === 0 && (
          <ClayCard className="p-8 text-center mt-4">
            <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No bookings yet</p>
          </ClayCard>
        )}
      </div>
    </div>
  );

  const renderWaitlist = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Waitlist</h2>

      {vaccines
        .filter((v) => v.isActive)
        .map((vaccine) => {
          const entries = waitlist.filter((w) => w.vaccineId === vaccine.id && w.status === 'waiting');
          if (entries.length === 0) return null;

          return (
            <ClayCard key={vaccine.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-gray-800">
                  {vaccine.name} ({entries.length} waiting)
                </h3>
                <ClayButton className="!px-4 !py-2 text-sm">
                  <Bell className="w-4 h-4 mr-2" />
                  Notify All
                </ClayButton>
              </div>

              <div className="space-y-2">
                {entries.map((entry, index) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-gray-800">{entry.patientName}</p>
                        <p className="text-xs text-gray-500">{entry.patientEmail}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Joined {formatDate(entry.createdAt)}</p>
                      <button
                        className="text-xs text-red-500 hover:underline mt-1"
                        onClick={() => {
                          vaccineStore.removeFromWaitlist(entry.id);
                          refreshData();
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </ClayCard>
          );
        })}

      {waitlist.filter((w) => w.status === 'waiting').length === 0 && (
        <ClayCard className="p-8 text-center">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No patients on waitlist</p>
        </ClayCard>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Pharmacy Settings</h2>

      <ClayCard className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-2">Pharmacy Name</label>
            <ClayInput
              value={settings?.pharmacyName || ''}
              onChange={(e) => setSettings(settings ? { ...settings, pharmacyName: e.target.value } : null)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-2">Email</label>
            <ClayInput
              type="email"
              value={settings?.pharmacyEmail || ''}
              onChange={(e) => setSettings(settings ? { ...settings, pharmacyEmail: e.target.value } : null)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-2">Phone</label>
            <ClayInput
              value={settings?.pharmacyPhone || ''}
              onChange={(e) => setSettings(settings ? { ...settings, pharmacyPhone: e.target.value } : null)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-2">Address</label>
            <ClayInput
              value={settings?.pharmacyAddress || ''}
              onChange={(e) => setSettings(settings ? { ...settings, pharmacyAddress: e.target.value } : null)}
            />
          </div>
          <ClayButton className="mt-4" onClick={handleSaveSettings}>
            Save Settings
          </ClayButton>
        </div>
      </ClayCard>

      <ClayCard className="p-6">
        <h3 className="font-bold text-lg text-gray-800 mb-4">Data Management</h3>
        <p className="text-gray-500 text-sm mb-4">
          Reset all booking data to default values. This action cannot be undone.
        </p>
        <ClayButton
          variant="danger"
          onClick={() => {
            if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
              vaccineStore.resetStore();
              refreshData();
            }
          }}
        >
          Reset All Data
        </ClayButton>
      </ClayCard>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'vaccines':
        return renderVaccines();
      case 'clinic-days':
        return renderClinicDays();
      case 'pools':
        return renderPools();
      case 'bookings':
        return renderBookings();
      case 'waitlist':
        return renderWaitlist();
      case 'settings':
        return renderSettings();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-clay-bg p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <ClayButton variant="secondary" className="!p-3" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </ClayButton>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">Vaccine Booking Management</p>
          </div>
        </div>

        {/* Main Layout */}
        <div className="flex flex-col md:flex-row gap-6">
          {renderSidebar()}
          <div className="flex-1">
            <ClayCard className="p-6">{renderContent()}</ClayCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
