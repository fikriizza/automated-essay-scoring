import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

interface Ujian {
    id: string;
    nama_ujian: string;
    kelas: { nama_kelas: string };
    mata_pelajaran: { nama_mapel: string };
}

interface PageProps {
    ujians: Ujian[];
}

export default function DaftarUjian({ ujians }: PageProps) {
    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Ujian Saya', href: '/soal-ujian' },
            ]}
        >
            <Head title="Daftar Ujian" />

            <div className="container mx-auto max-w-4xl space-y-6 p-6">
                <h1 className="text-2xl font-bold">Ujian yang Bisa Dikerjakan</h1>

                {ujians.length === 0 ? (
                    <p>Tidak ada ujian tersedia untuk Anda.</p>
                ) : (
                    ujians.map((ujian) => (
                        <Card key={ujian.id}>
                            <CardHeader>
                                <CardTitle>{ujian.nama_ujian}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <p>
                                    <strong>Kelas:</strong> {ujian.kelas.nama_kelas}
                                </p>
                                <p>
                                    <strong>Mata Pelajaran:</strong> {ujian.mata_pelajaran.nama_mapel}
                                </p>
                                <Link href={route('ujian.kerjakan', ujian.id)}>
                                    <Button>Kerjakan</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </AppLayout>
    );
}
