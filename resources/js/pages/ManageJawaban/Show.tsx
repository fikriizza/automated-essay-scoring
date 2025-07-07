import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

interface Siswa {
    id: string;
    user: {
        name: string;
    };
    nisn: string;
}

interface Soal {
    id: string;
}

interface Ujian {
    id: string;
    nama_ujian: string;
    mata_pelajaran: {
        nama: string;
    };
    kelas: {
        nama: string;
        tahun_ajaran: string;
        // Tambahkan siswa jika perlu
    };
    soals: Soal[];
}

interface Jawaban {
    id: string;
    soal_id: string;
    siswa_id: string;
}

interface Props {
    ujian: Ujian;
    siswas: Siswa[];
    jawabans: Record<string, Jawaban[]>; // key = siswa_id
}

export default function Show({ ujian, siswas, jawabans }: Props) {
    return (
        <AppLayout>
            <Head title={`Jawaban Ujian - ${ujian.nama_ujian}`} />

            <div className="space-y-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold">Jawaban Ujian</h1>
                    <p className="text-muted-foreground">
                        {ujian.nama_ujian} - {ujian.mata_pelajaran.nama} <br />
                        Kelas {ujian.kelas.nama} ({ujian.kelas.tahun_ajaran})
                    </p>
                </div>

                <Separator />

                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Siswa</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>No</TableHead>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>NISN</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {siswas.map((siswa, index) => {
                                        const jawabanSiswa = jawabans[siswa.id] || [];
                                        const totalSoal = ujian.soals.length;
                                        const totalJawaban = jawabanSiswa.length;
                                        const sudahMengisi = totalJawaban > 0;

                                        return (
                                            <TableRow key={siswa.id}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{siswa.user.name}</TableCell>
                                                <TableCell>{siswa.nisn}</TableCell>
                                                <TableCell>
                                                    {sudahMengisi ? (
                                                        <Badge variant="default">
                                                            {totalJawaban}/{totalSoal} Jawaban
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="destructive">Belum mengerjakan</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {sudahMengisi && (
                                                        <Link href={`/manage-jawaban/ujian/${ujian.id}/siswa/${siswa.id}`}>
                                                            <Button size="sm">Lihat Detail</Button>
                                                        </Link>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
