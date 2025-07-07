import { Badge } from '@/components/ui/badge';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

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
}

interface Props {
    ujian: Ujian;
    siswa: Siswa;
    jawabans: Record<string, Jawaban>;
}

export default function DetailSiswa({ ujian, siswa, jawabans }: Props) {
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
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {ujian.soals.map((soal, index) => {
                                        const jawaban = jawabans[soal.id];

                                        return (
                                            <TableRow key={soal.id}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{soal.pertanyaan}</TableCell>
                                                <TableCell>
                                                    {jawaban ? <span>{jawaban.jawaban}</span> : <Badge variant="destructive">Belum dijawab</Badge>}
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
