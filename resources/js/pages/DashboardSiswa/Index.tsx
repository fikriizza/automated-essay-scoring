import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';

interface PageProps {
    nama: string;
}

export default function DashboardSiswaIndex() {
    const { nama } = usePage().props as PageProps;

    return (
        <AppLayout>
            <Head title="Dashboard Siswa" />

            <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
                <h1 className="text-3xl font-bold">Selamat datang, {nama}!</h1>
                <p className="text-muted-foreground text-lg">
                    Ini adalah dashboard siswa. Di sini nanti kamu bisa melihat jadwal ujian, nilai, dan lainnya.
                </p>
            </div>
        </AppLayout>
    );
}
