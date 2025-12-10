'use client';
import Dashboard from '@/components/Dashboard';
import { useAdmin } from '@/context/AdminContext';

export default function DashboardPage() {
    const { users, academies, sports, bookings } = useAdmin();
    return <Dashboard users={users} academies={academies} sports={sports} bookings={bookings} />;
}
