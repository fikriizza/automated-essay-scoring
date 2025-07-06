import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface Soal {
    id: string;
    pertanyaan: string;
    paket_soal: {
        mata_pelajaran: {
            nama_mapel: string;
        };
    };
}

interface Jawaban {
    soal_id: string;
    jawaban: string;
}

interface Ujian {
    id: string;
    nama_ujian: string;
    kelas: {
        nama_kelas: string;
    };
    mata_pelajaran: {
        nama_mapel: string;
    };
    soals: Soal[];
}

interface PageProps {
    ujian: Ujian;
    jawabanSebelumnya?: Record<string, Jawaban>;
}

export default function KerjakanSoal() {
    const { ujian, jawabanSebelumnya } = usePage().props as PageProps;

    const [answers, setAnswers] = useState<Record<string, string>>(() => {
        const initial: Record<string, string> = {};
        for (const soal of ujian.soals) {
            initial[soal.id] = jawabanSebelumnya?.[soal.id]?.jawaban || '';
        }
        return initial;
    });

    const { post, processing } = useForm();

    const handleSubmit = (soalId: string) => {
        post(route('soal.jawab', soalId), {
            data: { jawaban: answers[soalId] },
            preserveScroll: true,
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Soal Ujian', href: '/soal-ujian' },
                { title: 'Kerjakan', href: '#' },
            ]}
        >
            <Head title={`Kerjakan: ${ujian.nama_ujian}`} />

            <div className="container mx-auto max-w-4xl space-y-6 p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Ujian</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <p>
                            <strong>Nama Ujian:</strong> {ujian.nama_ujian}
                        </p>
                        <p>
                            <strong>Kelas:</strong> {ujian.kelas.nama_kelas}
                        </p>
                        <p>
                            {/* <strong>Mata Pelajaran:</strong> {ujian.mata_pelajaran.nama_mapel} */}
                            {/* <strong>Mata Pelajaran:</strong> {ujian.mata_pelajaran?.nama_mapel ?? '-'} */}
                            {/* <strong>Mata Pelajaran:</strong> {ujian.soals[0]?.paket_soal?.mata_pelajaran?.nama_mapel ?? '-'} */}
                            <strong>Mata Pelajaran:</strong> {ujian.mata_pelajaran?.nama_mapel ?? '-'}
                        </p>
                    </CardContent>
                </Card>

                <Separator />

                {ujian.soals.map((soal, index) => (
                    <Card key={soal.id}>
                        <CardHeader>
                            <CardTitle>Soal #{index + 1}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground">{soal.pertanyaan}</p>
                            <div>
                                <Label htmlFor={`jawaban-${soal.id}`}>Jawaban Anda</Label>
                                <Textarea
                                    id={`jawaban-${soal.id}`}
                                    value={answers[soal.id]}
                                    onChange={(e) => setAnswers({ ...answers, [soal.id]: e.target.value })}
                                    placeholder="Tulis jawaban Anda di sini..."
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button onClick={() => handleSubmit(soal.id)} disabled={processing || answers[soal.id].trim() === ''}>
                                    {processing ? 'Menyimpan...' : 'Simpan Jawaban'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </AppLayout>
    );
}
