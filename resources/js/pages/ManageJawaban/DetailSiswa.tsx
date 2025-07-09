import { Badge } from '@/components/ui/badge';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
interface Soal {
    id: string;
    pertanyaan: string;
}

interface Ujian {
    id: string;
    nama_ujian: string;
    mata_pelajaran: {
        nama_mapel: string;
    };
    kelas: {
        nama_kelas: string;
        tahun_ajaran: string;
    };
    soals: Soal[];
}

interface Siswa {
    id: string;
    nisn: string;
    user: {
        name: string;
    };
}

interface Jawaban {
    soal_id: string;
    jawaban: string;
    skor: number | null;
}

interface Props {
    ujian: Ujian;
    siswa: Siswa;
    jawabans: Record<string, Jawaban>;
}

export default function DetailSiswa({ ujian, siswa, jawabans }: Props) {
    const [loading, setLoading] = useState(false);

    const handleAutoGrade = async () => {
        setLoading(true);
        try {
            await router.post(
                route('manage-jawaban.nilai-otomatis', { ujianId: ujian.id, siswaId: siswa.id }),
                {},
                {
                    preserveScroll: true,
                    onFinish: () => setLoading(false),
                },
            );
        } catch (error) {
            console.error('Gagal mengirim ke Groq:', error);
            setLoading(false);
        }
    };
    const skorList = Object.values(jawabans)
        .map((j) => j.skor)
        .filter((skor): skor is number => skor !== null);

    const rataRataNilai = skorList.length > 0 ? (skorList.reduce((a, b) => a + b, 0) / skorList.length).toFixed(2) : null;

    return (
        <AppLayout>
            <Head title={`Jawaban ${siswa.user.name}`} />

            <div className="space-y-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold">Detail Jawaban Siswa</h1>
                    <p className="text-muted-foreground text-sm">
                        <span className="font-medium">Siswa:</span> {siswa.user.name} (NISN: {siswa.nisn}) <br />
                        <span className="font-medium">Ujian:</span> {ujian.nama_ujian} - {ujian.mata_pelajaran.nama_mapel} <br />
                        <span className="font-medium">Kelas:</span> {ujian.kelas.nama_kelas} ({ujian.kelas.tahun_ajaran})
                    </p>
                </div>

                <Separator />
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <button
                        onClick={handleAutoGrade}
                        disabled={loading}
                        className="w-fit rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Menilai...' : 'Nilai Otomatis'}
                    </button>

                    {rataRataNilai ? (
                        <div className="text-sm font-semibold text-green-600">
                            Nilai Akhir: <span className="text-2xl font-bold">{rataRataNilai}</span>
                        </div>
                    ) : (
                        <div className="w-fit rounded border border-red-300 bg-red-100 px-3 py-2 text-sm text-red-600">
                            Semua skor belum tersedia. Nilai belum bisa dihitung.
                        </div>
                    )}
                </div>
                <div>
                    <CardHeader>
                        <CardTitle>Jawaban Siswa</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>No</TableHead>
                                        <TableHead>Pertanyaan</TableHead>
                                        <TableHead>Jawaban</TableHead>
                                        <TableHead>Skor</TableHead>
                                        <TableHead>Nilai</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {ujian.soals.map((soal, index) => {
                                        const jawaban = jawabans[soal.id];

                                        return (
                                            <TableRow key={soal.id}>
                                                <TableCell className="align-top">{index + 1}</TableCell>

                                                <TableCell className="max-w-[400px] align-top break-words whitespace-pre-line">
                                                    {soal.pertanyaan}
                                                </TableCell>

                                                <TableCell className="max-w-[400px] align-top break-words whitespace-pre-line">
                                                    {jawaban ? <span>{jawaban.jawaban}</span> : <Badge variant="destructive">Belum dijawab</Badge>}
                                                </TableCell>

                                                <TableCell className="align-top">
                                                    {jawaban?.skor != null ? (
                                                        <Badge variant="secondary">{jawaban.skor} / 100</Badge>
                                                    ) : (
                                                        <Badge variant="outline">Belum dinilai</Badge>
                                                    )}
                                                </TableCell>

                                                <TableCell className="align-top">
                                                    {jawaban?.skor != null ? <span>{jawaban.skor.toFixed(2)}</span> : '-'}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </div>
            </div>
        </AppLayout>
    );
}
